import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try {
        console.log(`|====================================================================|`);
        console.log(`| [comment] Trying to POST new comment`);
        console.log(`|====================================================================|`);
        
        const model = await db.comment.create({
            data: await req.json()
        });

        return NextResponse.json(model);
    } catch (error) {
        console.log("[Comment POST] Error: ", error);
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    }
};