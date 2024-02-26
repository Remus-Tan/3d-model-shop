import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
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
};

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log(`|====================================================================|`);
        console.log(`| [models] Deleting data... ~`);
        console.log(`| [models] DELETE ${params.id} ~`);
        console.log(`|====================================================================|`);

        const result = await db.model.delete({ where: { id: Number(params.id) } });

        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code == 'P2025') {
            return NextResponse.json({ error, status: 404 });
        } else {
            console.log(error);
            return NextResponse.json({ error, status: 500 });
        }
    }
};

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await req.json();
        console.log(`|====================================================================|`);
        console.log(`| [models] Trying to PATCH ${JSON.stringify(data)} ~`);
        console.log(`|====================================================================|`);

        const model = await db.model.update({
            where: {
                id: Number(params.id)
            },
            data
        });

        return NextResponse.json(model);
    } catch (error) {
        console.log("[models]", error);
        console.log("Could not patch for some reason... uh oh!");
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
};