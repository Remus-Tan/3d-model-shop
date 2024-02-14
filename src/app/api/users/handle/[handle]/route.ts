import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { handle: string } }
) {
    try {
        console.log(`|====================================================================|`);
        console.log(`| [handle] GET ${params.handle} ~`);
        console.log(`|====================================================================|`);
        const result = await db.user.findUniqueOrThrow({ where: { handle: params.handle.toLowerCase() } });
        return NextResponse.json(result);
    } catch (error) {
        console.log("[User GET]", error);
        
        if (error instanceof PrismaClientKnownRequestError && error.code == 'P2025') {
            return NextResponse.json({error: "User not found"}, { status: 404 });
        } else {
            return NextResponse.json({error: "Internal Error"}, { status: 500 });
        }
    }
}