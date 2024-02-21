import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string[] } }
) {
    if (req.nextUrl.searchParams.get("target")) {
        // GET Request for specific combination to see whether current user is following current profile
        console.log(`|====================================================================|`);
        console.log(`| [follow-data] Getting data to see if current user is following target... ~`);
        console.log(`| [follow-data] GET ${req.nextUrl.searchParams.get("target")} ~`);
        console.log(`|====================================================================|`);

        try {
            const result = await db.follows.findFirstOrThrow({
                where: {
                    followerId: params.id[0],
                    followingId: req.nextUrl.searchParams.get("target")!
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
    } else {
        // If no query params provided, get follower / following count
        console.log(`|====================================================================|`);
        console.log(`| [follow-data] Getting follow counts for current user... ~`);
        console.log(`| [follow-data] GET ${params.id} ~`);
        console.log(`|====================================================================|`);

        try {
            const followerCount = await db.follows.count({
                where: { followingId: params.id[0] }
            });

            const followingCount = await db.follows.count({
                where: { followerId: params.id[0] }
            });

            return NextResponse.json({ followerCount, followingCount }, { status: 200 });

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code == 'P2025') {
                return NextResponse.json({ error }, { status: 404 });
            } else {
                return NextResponse.json({ error }, { status: 500 });
            }
        }
    }

}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    console.log(`|====================================================================|`);
    console.log(`| [follow-data] User is trying to follow target... ~`);
    console.log(`| [follow-data] POST ${params.id[0]} => ${req.nextUrl.searchParams.get("target")}~`);
    console.log(`|====================================================================|`);

    try {
        // Make sure that current user exists in DB
        const follower = await db.user.findFirstOrThrow({
            where: {
                id: params.id[0]
            }
        });

        // Make sure that target user exists in DB
        const following = await db.user.findFirstOrThrow({
            where: {
                id: req.nextUrl.searchParams.get("target")!
            }
        });

        if (follower && following) {
            const result = await db.follows.create({
                data: {
                    followerId: params.id[0],
                    followingId: req.nextUrl.searchParams.get("target")!
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
    console.log(`| [follow-data] DELETE ${params.id[0]} ~`);
    console.log(`|====================================================================|`);

    try {
        // Make sure that current user exists in DB
        const follower = await db.user.findFirstOrThrow({
            where: {
                id: params.id[0]
            }
        });

        // Make sure that target user exists in DB
        const following = await db.user.findFirstOrThrow({
            where: {
                id: req.nextUrl.searchParams.get("target")!
            }
        });

        if (follower && following) {
            const result = await db.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: params.id[0],
                        followingId: req.nextUrl.searchParams.get("target")!
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