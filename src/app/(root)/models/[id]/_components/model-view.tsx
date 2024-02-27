import { Comment, Model, User } from "@prisma/client";
import ModelViewer from "../settings/_components/model-viewer";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "../../../user/profile/[[...id]]/_components/followButton";
import { Separator } from "@/components/ui/separator";
import LikeButton from "../../../user/profile/[[...id]]/_components/likeButton";
import { Button } from "@/components/ui/button";
import CommentDisplay from "./comment";
import { revalidatePath } from "next/cache";
import MoreModels from "./more-models";
import CommentForm from "./comment-form";
import { currentUser } from "@clerk/nextjs";

export default async function ModelView(
    { params }: { params: { id: string } }
) {
    const user = await currentUser();

    const modelResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/models/${params.id}`, { next: { revalidate: 0 } });
    const model: Model = await modelResponse.json();

    const creatorResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${model.creatorId}`, { next: { revalidate: 0 } });
    const creator: User = await creatorResponse.json();

    const commentsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/${params.id}`, { next: { revalidate: 0 } });
    const comments: Comment[] = await commentsResponse.json();

    // @ts-ignore because model.error will exist if model returns an error, obviously
    if ((Object.keys(model).length === 0 || model.error)) {
        return (
            <h1 className="border-2 bg-secondary text-foreground w-fit m-auto mt-12 p-8 font-semibold">
                Model does not exist!
            </h1>
        );
    };

    return (
        <>
            {(!model.published && user?.id != model.creatorId) ?
                        (
                            <>This model is private!</>
                        ) :
                        (
                            <div className="
                                sm:flex sm:mx-36
                                gap-4 m-6 mx-4
                                ">
                                <div className="sm:w-3/4 w-full">
                                    <ModelViewer modelId={String(model.id)} sizeClass="w-full h-[70vh]" />
                                    <ModelDetails />
                                    <Separator className="my-4" />
                                    <Comments />
                                    <CommentForm params={params} />
                                </div>

                                {model.name && <MoreModels searchvalue={model.name} currentModel={model.id} />}
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

                    <div className="ml-auto">
                        {user && <LikeButton loggedInUser={user.id} targetModel={model.id} targetCreator={creator.id} />}
                    </div>
                </div>
                <div className="flex p-1 gap-2 my-4">
                    <Separator orientation="vertical" className="h-auto w-1" />
                    <p className="whitespace-pre-wrap p-1">
                        {model.description}
                    </p>
                </div>
                {
                    user?.id == model.creatorId &&
                    <Button>
                        <Link href={`/models/${params.id}/settings`} onClick={() => revalidatePath(`/models/${params.id}/settings`)}>Edit Settings</Link>
                    </Button>
                }
            </div >
        );
    };

    function Comments() {
        return (
            <>
                <h3 className="text-lg font-semibold">
                    Comments
                </h3>
                {comments.length === 0 ?
                    <p className="text-muted-foreground">Nothing here... yet!</p>
                    :
                    <Separator className="my-4" />}
                {comments.map((comment: Comment) => (<CommentDisplay comment={comment} key={comment.id} />))}
            </>
        );
    }
}