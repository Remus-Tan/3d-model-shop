import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { searchQuery: string } }) {
    console.log(`|====================================================================|`);
    console.log(`| [user/search] Retrieving all users matching search... ~`);
    console.log(`| [user/search] GET ${params.searchQuery}`);
    console.log(`|====================================================================|`);

    try {
        const results = await db.user.findMany({
            where: {
                handle: {
                    contains: params.searchQuery
                }
            }
        });

        return NextResponse.json(results);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code == 'P2025') {
            return NextResponse.json({ error }, { status: 404 });
        } else {
            return NextResponse.json({ error }, { status: 500 });
        }
    }
};