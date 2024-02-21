import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const results = await db.model.findMany({
            where: {
                creatorId: params.id
            }
        });

        return NextResponse.json(results);

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code == 'P2025') {
            return NextResponse.json({ error, status: 404 });
        } else {
            return NextResponse.json({ error, status: 500 });
        }
    }
};