"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

async function updateFollow(
    isFollowing: boolean,
    apiPath: string
) {
    const result = fetch(apiPath, {
        method: isFollowing ? "Delete" : "Post",
    }).then(async res => {
        res = await res.json();
    });
}

export default function FollowButton({
    loggedInUser,
    targetUser,
}: {
    loggedInUser: string,
    targetUser: string
}) {
    const [isFetching, setIsFetching] = useState(true);
    const [isFollowing, setIsFollowing] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const apiPath = process.env.NEXT_PUBLIC_BASE_URL + "/api/users/follow-data/" + loggedInUser + "?target=" + targetUser;

    useEffect(() => {
        // Find logged in user's following list, then see if target user is already followed
        setIsFetching(true);
        fetch(apiPath, { next: { revalidate: 0 } })
            .then(res => {
                setIsFetching(false);
                if (res.ok) {
                    setIsFollowing(true);
                } else {
                    setIsFollowing(false);
                }
            });
    }, []);

    return (
        <>
            {
                !isUpdating &&
                <Button
                    className={cn("p-1 h-fit text-sm font-extralight transition-none", isFetching && "text-primary")}
                    disabled={isFetching}
                    onClick={() => {
                        updateFollow(isFollowing, apiPath);
                        if (isFollowing) {
                            setIsFollowing(false);
                        } else {
                            setIsFollowing(true);
                        };
                        setIsUpdating(true);
                        setTimeout(() => setIsUpdating(false), 200);
                    }}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </Button>
            }

            {isUpdating &&
                <Button
                    className={cn("p-1 h-fit text-sm font-extralight transition-none")}
                    disabled>
                    <Loader2 size={20} className="animate-spin" />
                </Button>
            }
        </>
    );
}