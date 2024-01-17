import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const result = await db.user.findUniqueOrThrow({
            where: {
                id: params.id
            }
        });

        return NextResponse.json(result);

    } catch (error) {
        console.log("[User GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await req.json();

        await db.user.create({
            data
        });
    } catch (error) {
        console.log("[User POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};