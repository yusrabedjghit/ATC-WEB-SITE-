import math
import os
from dataclasses import dataclass

import numpy as np
from PIL import Image


@dataclass(frozen=True)
class Box:
    x1: int
    y1: int
    x2: int
    y2: int

    @property
    def w(self) -> int:
        return max(0, self.x2 - self.x1)

    @property
    def h(self) -> int:
        return max(0, self.y2 - self.y1)


def group_consecutive(idxs: np.ndarray, min_len: int) -> list[tuple[int, int]]:
    if idxs.size == 0:
        return []
    idxs = np.sort(idxs)
    groups: list[tuple[int, int]] = []
    start = int(idxs[0])
    prev = int(idxs[0])
    for v in idxs[1:]:
        v = int(v)
        if v == prev + 1:
            prev = v
            continue
        if (prev - start + 1) >= min_len:
            groups.append((start, prev + 1))
        start = v
        prev = v
    if (prev - start + 1) >= min_len:
        groups.append((start, prev + 1))
    return groups


def main() -> None:
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    inp = os.path.join(root, "_figma", "00-initial.png")
    out_dir = os.path.join(root, "_figma")
    os.makedirs(out_dir, exist_ok=True)

    img = Image.open(inp).convert("RGB")
    arr = np.asarray(img).astype(np.int16)  # (H, W, 3)
    h, w = arr.shape[0], arr.shape[1]

    # Use a corner pixel as background reference.
    bg = arr[8, 8, :]
    diff = np.max(np.abs(arr - bg), axis=2)  # (H, W)

    # Exclude top toolbar + bottom banner areas to reduce noise.
    y_top = 60
    y_bottom = 120
    work = diff[y_top : max(y_top, h - y_bottom), :]

    boxes: list[Box] = []

    # Detect the two large desktop frames (they have consistent columns with some high contrast).
    col_score = np.percentile(work, 98, axis=0)
    dense_cols = np.where(col_score > 25)[0]
    x_groups = group_consecutive(dense_cols, min_len=120)
    x_groups = [(x1, x2) for x1, x2 in x_groups if x1 >= 900 and x2 <= 1800]

    for x1, x2 in x_groups:
        seg = work[:, x1:x2]
        row_max = seg.max(axis=1)
        dense_rows = np.where(row_max > 35)[0]
        if dense_rows.size < 120:
            continue
        y1 = int(dense_rows.min())
        y2 = int(dense_rows.max() + 1)
        b = Box(x1, y_top + y1, x2, y_top + y2)
        if b.w >= 120 and b.h >= 350 and (b.h / max(1, b.w)) >= 1.6:
            boxes.append(b)

    # Detect the narrow "Android" frame as a subtle mean-brightness shift on the far right.
    gray = (
        arr[:, :, 0] * 0.299 + arr[:, :, 1] * 0.587 + arr[:, :, 2] * 0.114
    )  # float-ish
    region = gray[y_top : max(y_top, h - y_bottom), :]
    bg_mean = float(region[:, 2250:2390].mean())
    col_mean = region.mean(axis=0)
    col_diff = np.abs(col_mean - bg_mean)
    android_cols = np.where(col_diff > 0.8)[0]
    android_groups = [g for g in group_consecutive(android_cols, min_len=40) if g[0] >= 1750]
    if android_groups:
        ax1, ax2 = max(android_groups, key=lambda t: t[1] - t[0])
        a_seg = region[:, ax1:ax2]
        row_mean = a_seg.mean(axis=1)
        bg_row = region[:, 2250:2390].mean(axis=1)
        row_diff = np.abs(row_mean - bg_row)
        a_rows = np.where(row_diff > 0.6)[0]
        if a_rows.size > 200:
            ay1 = int(a_rows.min())
            ay2 = int(a_rows.max() + 1)
            boxes.append(Box(ax1, y_top + ay1, ax2, y_top + ay2))

    boxes = sorted(boxes, key=lambda b: b.x1)

    # The screenshot shows zoom = 16% in the Figma UI.
    zoom_pct = 16.0
    scale = 100.0 / zoom_pct

    names = ["landing-page", "example", "android"]
    results = []

    for i, b in enumerate(boxes[:3]):
        name = names[i] if i < len(names) else f"frame-{i+1}"

        # Crop with a tiny padding (stays within bounds).
        pad = 2
        x1 = max(0, b.x1 - pad)
        y1 = max(0, b.y1 - pad)
        x2 = min(w, b.x2 + pad)
        y2 = min(h, b.y2 + pad)
        crop = img.crop((x1, y1, x2, y2))

        # Upscale crop so it approximates a "100% zoom" view.
        up_w = int(math.ceil(crop.size[0] * scale))
        up_h = int(math.ceil(crop.size[1] * scale))
        up = crop.resize((up_w, up_h), resample=Image.Resampling.NEAREST)

        out_path = os.path.join(out_dir, f"{name}-approx-100pct.png")
        up.save(out_path, format="PNG", optimize=True)

        results.append(
            {
                "name": name,
                "breakpoint": "mobile" if name == "android" else "desktop",
                "measured_in_screenshot_px": {"w": crop.size[0], "h": crop.size[1]},
                "estimated_frame_px_at_100pct": {
                    "w": int(round(crop.size[0] * scale)),
                    "h": int(round(crop.size[1] * scale)),
                },
                "zoom_pct_assumed": zoom_pct,
                "screenshot": out_path,
            }
        )

    report_path = os.path.join(out_dir, "frame-extract-report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        import json

        json.dump({"source": inp, "results": results}, f, indent=2)


if __name__ == "__main__":
    main()

