"use client";

import { Model, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ModelViewer from "./settings/_components/model-viewer";
import { useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "../../user/profile/[[...id]]/_components/followButton";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import LikeButton from "../../user/profile/[[...id]]/_components/likeButton";

export default function ModelView(
    { params }: { params: { id: string } }
) {
    const { user, isSignedIn } = useUser();
    const router = useRouter();

    const [isLoading, setLoading] = useState(true);
    const [model, setModel] = useState({} as Model);
    const [creator, setCreator] = useState({} as User);

    useEffect(() => {
        // Fetching model details
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/models/${params.id}`, {
            next: {
                revalidate: 0
            }
        }).then(async res => {
            if (res.ok) {
                const data: Model = await res.json();
                console.log(JSON.stringify(data));
                setModel(data);
                setLoading(false);

                // After success, fetch creator details
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${data.creatorId}`, {
                    next: {
                        revalidate: 0
                    }
                }).then(async res => {
                    if (res.ok) {
                        const data = await res.json();
                        console.log(JSON.stringify(data));
                        setCreator(data);
                    }
                });
            }
        });
    }, []);

    // @ts-ignore because model.error will exist if model returns an error, obviously
    if ((Object.keys(model).length === 0 || model.error) && !isLoading) {
        return (
            <h1 className="border-2 bg-secondary text-foreground w-fit m-auto mt-12 p-8 font-semibold">
                Model does not exist!
            </h1>
        );
    };

    return (
        <>
            {
                isLoading ?
                    <div className="flex flex-col mt-64 items-center">
                        <Loader2 className="animate-spin rounded-full bg-background" size={160} strokeWidth="1" color="orange" />
                        <>Loading...</>
                    </div>
                    :
                    // Once loaded, check if user is authorized to view the model
                    (!model.published && user?.id != model.creatorId) ?
                        (
                            <>This model is private!</>
                        ) :
                        (
                            <div className="flex gap-4 m-12 mx-36">
                                <div className="w-3/4">
                                    <ModelViewer modelId={String(model.id)} size={{ width: "full", height: "[600px]" }} />
                                    <ModelDetails />
                                    <Separator className="my-4" />
                                    <Comments />
                                </div>

                                <MoreModels />
                            </div>
                        )
            }
        </>

    );

    function ModelDetails() {
        return (
            <div className="mt-6">
                <h3 className="text-3xl mb-6">{model.name}</h3>
                <div className="flex">
                    <Image src={creator.imageUrl || ""} alt="Profile Picture" width={60} height={60} />
                    <div className="flex flex-col ml-2">
                        <Link href={"/user/profile/" + creator.handle} className="text-lg font-semibold hover:text-primary">{creator.handle}</Link>
                        {user && (user.id != creator.id && <FollowButton loggedInUser={user.id} targetUser={creator.id} />)}
                    </div>
                    
                    <div className="ml-auto">
                        {user && <LikeButton loggedInUser={user.id} targetModel={model.id} targetCreator={creator.id} />}
                    </div>
                </div>
            </div>
        );
    };

    function Comments() {
        return (
            <>
                <h3 className="text-lg font-semibold">
                    Comments
                </h3>
                <Textarea disabled={!isSignedIn}></Textarea>
            </>
        );
    }

    function MoreModels() {
        return (
            <div className="bg-green-200 w-1/4">
                More Models
            </div>
        );
    };
}