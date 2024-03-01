import { currentUser } from "@clerk/nextjs";
import HomeNav from "../_components/home-nav";
import { Follows, User } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import FeedRow from "../_components/feed-row";

export default async function Feed() {
    const user = await currentUser();

    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/users/follow-data/" + user?.id + "?get_all=true", { next: { revalidate: 0 } });
    const followData: Follows[] = await response.json();

    const followedUsers: User[] = [];

    for (let i = 0; i < followData.length; i++) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${followData[i].followingId}`);
        const userData = await response.json();
        followedUsers.push(userData);
    }

    return (
        <>
            <HomeNav />
            {followedUsers.length == 0 &&
                <>
                    <p className="pl-8 pt-8 text-2xl font-medium">
                        Looks like you&apos;re not following anyone yet!
                    </p>
                </>
            }
            {followedUsers.length != 0 &&
                <>
                    <p className="pl-8 pt-8 text-2xl font-medium">
                        Catch up with this week&apos;s uploads!
                    </p>
                    <p className="pl-8 pb-8">You&apos;ll find all of your favorite creator&apos;s updated models here. (Last 7 days)</p>
                    {followedUsers.map((user: User) => {
                        return (
                            <>
                                <Separator className="h-2" />
                                <FeedRow key={user.id} creator={user} />
                            </>
                        );
                    })}
                </>
            }
        </>
    );
};
