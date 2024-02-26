import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { searchQuery: string } }) {
    console.log(`|====================================================================|`);
    console.log(`| [model/search] Retrieving all models matching search... ~`);
    console.log(`| [model/search] GET ${params.searchQuery}`);
    console.log(`|====================================================================|`);

    try {
        const results = await db.model.findMany({
            where: {
                name: {
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