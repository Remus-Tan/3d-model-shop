import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Submission } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try {
        console.log(`|====================================================================|`);
        console.log(`| Trying to POST new model entry`);
        console.log(`|====================================================================|`);
        const submission = await db.submission.create({
            data: await req.json()
        });

        return NextResponse.json(submission);
    } catch (error) {
        console.log("[Submission POST] Error: ", error);
    }
}

export async function PATCH(
    req: Request
) {
    try {
        const data = await req.json();
        console.log(`|====================================================================|`);
        console.log(`| Trying to PATCH ${JSON.stringify(data)}`);
        console.log(`|====================================================================|`);

        const submission = await db.submission.update({
            where: {
                id: data.id
            },
            data: {
                downloadUrl: data.downloadUrl
            }
        });

        return NextResponse.json(submission);
    } catch (error) {
        console.log("[Submission PATCH] Error: ", error);
        return NextResponse.json({error: "Internal Error"}, {status: 500});
    }
}