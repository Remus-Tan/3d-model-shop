import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // If search params given, only search published models
        //@ts-ignore TS hates dates
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { where } = req.nextUrl.searchParams.get("public") ? {
            where: {
                creatorId: params.id,
                published: true,
                updatedAt: {
                    lte: new Date(),
                    gte: sevenDaysAgo
                }
            }
        } : {
            where: {
                creatorId: params.id,
            }
        };

        const results = await db.model.findMany({ where });

        return NextResponse.json(results);

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code == 'P2025') {
            return NextResponse.json({ error, status: 404 });
        } else {
            return NextResponse.json({ error, status: 500 });
        }
    }
};