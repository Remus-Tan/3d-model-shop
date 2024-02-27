import { db } from "@/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { searchQuery: string } }
) {
    console.log(`|====================================================================|`);
    console.log(`| [model/search] Retrieving all models matching search... ~`);
    console.log(`| [model/search] GET ${params.searchQuery}`);
    console.log(`|====================================================================|`);

    try {
        if (req.nextUrl.searchParams.get("take")) {
            console.log(Number(req.nextUrl.searchParams.get("take")));
            const results = await db.model.findMany({
                where: {
                    name: {
                        contains: params.searchQuery
                    }
                },
                take: Number(req.nextUrl.searchParams.get("take"))
            });

            return NextResponse.json(results);
        } else {
            const results = await db.model.findMany({
                where: {
                    name: {
                        contains: params.searchQuery
                    }
                }
            });

            return NextResponse.json(results);
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code == 'P2025') {
            return NextResponse.json({ error }, { status: 404 });
        } else {
            return NextResponse.json({ error }, { status: 500 });
        }
    }
};