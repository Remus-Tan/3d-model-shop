import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log(`|====================================================================|`);
        console.log(`| [comments] Trying to GET comments for model ${params.id}`);
        console.log(`|====================================================================|`);

        const comments = await db.comment.findMany({
            where: { modelId: Number(params.id) }
        });

        return NextResponse.json(comments);

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code == 'P2025') {
            return NextResponse.json({ error, status: 404 });
        } else {
            return NextResponse.json({ error, status: 500 });
        }
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log(`|====================================================================|`);
        console.log(`| [comments] Trying to DELETE comment ${params.id}`);
        console.log(`|====================================================================|`);

        const deletedComment = await db.comment.delete({
            where: {
                id: Number(params.id)
            }
        });

        return NextResponse.json(deletedComment);

    } catch (error) {
        return NextResponse.json({ error, status: 500 });
    }
}