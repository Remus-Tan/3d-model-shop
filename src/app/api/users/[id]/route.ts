import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log(`|====================================================================|`);
        console.log(`~ Trying to GET ${params.id} ~`);
        console.log(`|====================================================================|`);
        const result = await db.user.findUniqueOrThrow({ where: { id: params.id } });
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

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await req.json();

        const user = await db.user.create({
            data
        });

        return NextResponse.json(user);

    } catch (error) {
        console.log("[User POST]", error);
        return NextResponse.json({error: "Internal Error"}, { status: 500 });
    }
};