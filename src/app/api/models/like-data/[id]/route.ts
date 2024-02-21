import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

// This is nearly a 1-to-1 copy of the follow API
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    // If target param exists
    if (req.nextUrl.searchParams.get("target")) {
        // GET Request for specific combination to see whether current user is liking current profile
        console.log(`|====================================================================|`);
        console.log(`| [like-data] Getting if current user likes target... ~`);
        console.log(`| [like-data] GET ${req.nextUrl.searchParams.get("target")} ~`);
        console.log(`|====================================================================|`);

        try {
            const result = await db.likes.findFirstOrThrow({
                where: {
                    userId: params.id,
                    modelId: Number(req.nextUrl.searchParams.get("target"))
                }
            });

            return NextResponse.json(result);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code == 'P2025') {
                return NextResponse.json({ error }, { status: 404 });
            } else {
                return NextResponse.json({ error }, { status: 500 });
            }
        }
    }

    // If no query params given, get count of likes
    if (!params.id.startsWith("user_")) {
        console.log(`|====================================================================|`);
        console.log(`| [like-data] Getting like count... ~`);
        console.log(`| [like-data] GET ${params.id} ~`);
        console.log(`|====================================================================|`);

        try {
            const result = await db.likes.count({
                where: { modelId: Number(params.id) }
            });

            return NextResponse.json(result);
        } catch (error) {
            return NextResponse.json({ error }, { status: 500 });
        }
    };

    // If no params given, this is to populate user's like tab
    if (params.id.startsWith("user_")) {
        console.log(`|====================================================================|`);
        console.log(`| [like-data] Getting all likes by this user... ~`);
        console.log(`| [like-data] GET ${params.id} ~`);
        console.log(`|====================================================================|`);

        try {
            const results = await db.likes.findMany({
                where: { userId: String(params.id) }
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

}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    console.log(`|====================================================================|`);
    console.log(`| [likes-data] User is trying to like target... ~`);
    console.log(`| [likes-data] POST ${params.id} => ${req.nextUrl.searchParams.get("target")}~`);
    console.log(`|====================================================================|`);

    try {
        // Make sure that current user exists in DB
        const liker = await db.user.findFirstOrThrow({
            where: {
                id: params.id
            }
        });

        // Make sure that target model exists in DB
        const model = await db.model.findFirstOrThrow({
            where: {
                id: Number(req.nextUrl.searchParams.get("target"))
            }
        });

        if (liker && model) {
            const result = await db.likes.create({
                data: {
                    userId: params.id,
                    modelId: Number(req.nextUrl.searchParams.get("target"))
                }
            });
            return NextResponse.json(result);
        };
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code == 'P2025') {
            return NextResponse.json({ error }, { status: 404 });
        } else {
            return NextResponse.json({ error }, { status: 500 });
        }
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    console.log(`|====================================================================|`);
    console.log(`| [like-data] DELETE ${params.id} ~`);
    console.log(`|====================================================================|`);

    try {
        // Make sure that current user exists in DB
        const liker = await db.user.findFirstOrThrow({
            where: {
                id: params.id
            }
        });

        // Make sure that target model exists in DB
        const model = await db.model.findFirstOrThrow({
            where: {
                id: Number(req.nextUrl.searchParams.get("target"))
            }
        });

        if (liker && model) {
            const result = await db.likes.delete({
                where: {
                    userId_modelId: {
                        userId: params.id,
                        modelId: Number(req.nextUrl.searchParams.get("target"))
                    }
                }
            });
            return NextResponse.json(result);
        };
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code == 'P2025') {
            return NextResponse.json({ error }, { status: 404 });
        } else {
            return NextResponse.json({ error }, { status: 500 });
        }
    }
}