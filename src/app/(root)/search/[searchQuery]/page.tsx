import ModelCard from "@/components/shared/model-card";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Model, User } from "@prisma/client";
import Image from "next/image";
import FollowButton from "../../user/profile/[[...id]]/_components/follow-button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import UserCard from "@/components/shared/user-card";

export default async function Search(
    { params }: { params: { searchQuery: string } }
) {
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/search/${params.searchQuery}`, { next: { revalidate: 0 } });
    const userResults: User[] = await userResponse.json();

    const modelResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/models/search/${params.searchQuery}`, { next: { revalidate: 0 } });
    const modelResults: Model[] = await modelResponse.json();

    return (
        <div className="px-8">
            <h1 className="text-2xl py-8 font-medium">Results for: {params.searchQuery}</h1>
            <Separator className="h-2" />
            {
                (userResults.length === 0 && modelResults.length === 0) &&
                <h2 className="py-8 text-2xl font-medium">
                    No results!
                </h2>
            }
            {
                userResults.length != 0 &&
                <>
                    <h2 className="py-8 text-2xl font-medium">Users</h2>
                    <div className="pb-8 flex flex-col gap-4">
                        <div className="flex gap-4 flex-wrap">
                            {userResults.map((result) => (<UserCard user={result} key={result.id} />))}
                        </div>
                    </div>
                    <Separator className="h-2"/>
                </>
            }
            {
                modelResults.length != 0 &&
                <>
                    <h2 className="py-8 text-2xl font-medium">Models</h2>
                    <div className="pb-8 flex flex-col gap-4">
                        <div className="flex gap-4 flex-wrap">
                            {modelResults.map((result) => (<ModelCard model={result} key={result.id} />))}
                        </div>
                    </div>
                </>
            }
        </div>
    );
}