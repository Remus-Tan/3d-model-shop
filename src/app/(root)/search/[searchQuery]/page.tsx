import ModelCard from "@/components/shared/model-card";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Model, User } from "@prisma/client";
import Image from "next/image";

export default async function Search(
    { params }: { params: { searchQuery: string } }
) {
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/search/${params.searchQuery}`, { next: { revalidate: 0 } });
    const userResults: User[] = await userResponse.json();

    const modelResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/models/search/${params.searchQuery}`, { next: { revalidate: 0 } });
    const modelResults: Model[] = await modelResponse.json();

    return (
        <>
            <h1>Search Results</h1>
            <p>You searched for: {params.searchQuery}</p>
            <div>
                <h2>Users:</h2>
            </div>
            {
                userResults.length === 0 ?
                    "No results!" :
                    userResults.map((result) => (<UserCard user={result} key={result.id} />))
            }

            <div>
                <h2>Models:</h2>
                {
                    modelResults.length === 0 ?
                        "No results!" :
                        modelResults.map((result) => (<ModelCard model={result} key={result.id} />))
                }
            </div>
        </>
    );

    function UserCard({ user }: { user: User }) {
        return (
            <div>
                <a href={"/user/profile/" + user.handle} className="flex bg-purple-200">
                    <Image src={user.imageUrl} alt="Profile Picture" width={24} height={24} />
                    {user.handle}
                </a>
            </div>
        );
    }

}