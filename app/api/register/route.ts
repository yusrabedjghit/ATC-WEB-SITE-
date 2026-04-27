export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { teamName, robotName, experienceLevel, participants } = body;

        // Validation
        if (!teamName || !robotName || !experienceLevel) {
            return NextResponse.json(
                { success: false, error: "Team name, Robot name, and Experience Level are required." },
                { status: 400 }
            );
        }

        if (!Array.isArray(participants) || participants.length === 0) {
            return NextResponse.json(
                { success: false, error: "At least one participant is required." },
                { status: 400 }
            );
        }

        if (participants.length > 5) {
            return NextResponse.json(
                { success: false, error: "Maximum of 5 participants allowed." },
                { status: 400 }
            );
        }

        const hasLeader = participants.some((p: any) => p.role === "leader");
        if (!hasLeader) {
            return NextResponse.json(
                { success: false, error: "One participant must have the role 'leader'." },
                { status: 400 }
            );
        }

        // validate all participants have required fields (fullname, phone)
        for (const p of participants) {
            if (!p.fullName) {
                return NextResponse.json(
                    { success: false, error: "All participants must have a fullName." },
                    { status: 400 }
                );
            }
        }

        // Create team and participants using a transaction
        await prisma.team.create({
            data: {
                teamName,
                robotName,
                experienceLevel,
                participants: {
                    create: participants.map((p: any) => ({
                        fullName: p.fullName,
                        phone: p.phone || "",
                        email: p.email || "",
                        role: p.role,
                    })),
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to register team. Please try again later." },
            { status: 500 }
        );
    }
}
