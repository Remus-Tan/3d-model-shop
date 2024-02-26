"use client";

import { Comment, Model, User } from "@prisma/client";
import { useEffect, useState } from "react";
import ModelViewer from "../settings/_components/model-viewer";
import { useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "../../../user/profile/[[...id]]/_components/followButton";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import LikeButton from "../../../user/profile/[[...id]]/_components/likeButton";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CommentDisplay from "./comment";
import { Metadata, ResolvingMetadata } from "next";
import { revalidatePath } from "next/cache";

export default function ModelView(
    { params }: { params: { id: string } }
) {
    const { user, isSignedIn } = useUser();

    const [isLoading, setLoading] = useState(true);
    const [isSubmitting, setSubmitting] = useState(false);
    const [model, setModel] = useState({} as Model);
    const [creator, setCreator] = useState({} as User);
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        // Fetching model details
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/models/${params.id}`, { next: { revalidate: 0 } })
            .then(async res => {
                if (res.ok) {
                    const data: Model = await res.json();
                    setModel(data);
                    setLoading(false);

                    // After success, fetch creator details
                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${data.creatorId}`, { next: { revalidate: 0 } })
                        .then(async res => {
                            if (res.ok) {
                                const data = await res.json();
                                setCreator(data);
                            }
                        });

                    // After success, fetch comments
                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/${params.id}`, { next: { revalidate: 0 } })
                        .then(async res => {
                            if (res.ok) {
                                const data = await res.json();
                                setComments(data);
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
                            <div className="
                                sm:flex sm:mx-36
                                gap-4 m-6 mx-4
                                ">
                                <div className="sm:w-3/4 w-full">
                                    <ModelViewer modelId={String(model.id)} sizeClass="w-full h-[70vh]" />
                                    <ModelDetails />
                                    <Separator className="my-4" />
                                    <Comments />
                                    <CommentForm />
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
                {comments.map(comment => (<CommentDisplay comment={comment} key={comment.id} />))}
            </>
        );
    }

    function CommentForm() {
        const formSchema = z.object({
            comment: z.string()
                .trim()
                .min(1, "Comment cannot be empty!")
                .max(255, "Too long!")
        });

        type formValues = z.infer<typeof formSchema>;

        const form = useForm<formValues>({
            resolver: zodResolver(formSchema),
            defaultValues: { comment: "" }
        });

        async function onSubmit(comment: formValues) {
            setSubmitting(true);

            await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/comments/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: user?.id,
                    modelId: model.id,
                    comment: comment.comment
                })
            });

            // After success, fetch comments again
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/${params.id}`, { next: { revalidate: 0 } })
                .then(async res => {
                    if (res.ok) {
                        const data = await res.json();
                        setComments(data);
                        setSubmitting(false);
                    }
                });
        };

        return (
            <>
                {isSignedIn &&
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel />
                                        <FormControl>
                                            <Textarea placeholder="Leave a comment..." {...field} />
                                        </FormControl>
                                        {form.formState.isDirty && <FormMessage />}
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={!form.formState.isDirty || isSubmitting} className="mt-4">
                                {isSubmitting ?
                                    <Loader2 size={20} className="animate-spin" />
                                    :
                                    <>Comment</>
                                }
                            </Button>
                        </form>
                    </Form>
                }
                {!isSignedIn && <p>Sign in to leave a comment!</p>}
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