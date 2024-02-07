import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log(`|====================================================================|`);
        console.log(`| Trying to GET ${params.id} ~`);
        console.log(`|====================================================================|`);
        const result = await db.user.findUniqueOrThrow({ where: { id: params.id } });
        return NextResponse.json(result);
    } catch (error) {
        console.log("[User GET]", error);

        if (error instanceof PrismaClientKnownRequestError && error.code == 'P2025') {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        } else {
            return NextResponse.json({ error: "Internal Error" }, { status: 500 });
        }
    }
}

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await req.json();
        console.log(`|====================================================================|`);
        console.log(`|Trying to POST ${JSON.stringify(data)} ~`);
        console.log(`|====================================================================|`);

        const user = await db.user.create({
            data
        });

        return NextResponse.json(user);

    } catch (error) {
        console.log("[User POST]", error);
        console.log("Please verify the User Id, Clerk might have given the user a new ID but the database is preventing the creation of another user with the same email.");
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
};

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await req.json();
        console.log(`|====================================================================|`);
        console.log(`|Trying to PATCH ${JSON.stringify(data)} ~`);
        console.log(`|====================================================================|`);

        const user = await db.user.update({
            where: {
                id: params.id
            },
            data
        });

        return NextResponse.json(user);
    } catch (error) {
        console.log("[USER PATCH]", error);
        console.log("Could not patch for some reason... uh oh!");
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
};