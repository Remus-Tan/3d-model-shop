import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log(`|====================================================================|`);
        console.log(`| [models] Getting data... ~`);
        console.log(`| [models] GET ${params.id} ~`);
        console.log(`|====================================================================|`);

        const result = await db.model.findUniqueOrThrow({ where: { id: Number(params.id) } });
        
        return NextResponse.json(result);
        
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code == 'P2025') {
            return NextResponse.json({ error, status: 404 });
        } else {
            return NextResponse.json({ error, status: 500 });
        }
    }
}