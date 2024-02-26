import ModelCard from "@/components/shared/model-card";
import { Model, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "../user/profile/[[...id]]/_components/followButton";
import { currentUser } from "@clerk/nextjs";

export default async function FeedRow({ creator }: { creator: User }) {
    const user = await currentUser();
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/models/user/" + creator.id + "?public=true?days=7", { next: { revalidate: 0 } });
    const models = await response.json();

    return (
        <div className="m-8 flex flex-col gap-4">
            <div className="flex">
                <Image src={creator.imageUrl || ""} alt="Profile Picture" width={60} height={60} />
                <div className="flex flex-col ml-2 justify-center">
                    <Link
                        href={"/user/profile/" + creator.handle}
                        className="text-lg font-semibold hover:text-primary group"
                    >
                        {creator.firstName + " " + creator.lastName}
                        <span className="text-sm font-light text-muted-foreground group-hover:text-primary"> (@{creator.handle})</span>
                    </Link>
                    <div>
                        {user && (user.id != creator.id && <FollowButton loggedInUser={user.id} targetUser={creator.id} />)}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 flex-wrap">
                {models.length == 0 && <p>No recent uploads!</p>}
                {models.length != 0 && models.map((model: Model) => <ModelCard key={model.id} model={model} />)}
            </div>
        </div>
    );
};