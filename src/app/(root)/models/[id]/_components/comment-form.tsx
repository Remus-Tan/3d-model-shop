"use client";

import { Comment, Model, User } from "@prisma/client";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default function CommentForm({ params }: { params: { id: string } }) {
    const { user, isSignedIn } = useUser();

    const [isLoading, setLoading] = useState(true);
    const [isSubmitting, setSubmitting] = useState(false);
    const [model, setModel] = useState({} as Model);
    const [creator, setCreator] = useState({} as User);
    const [comments, setComments] = useState<Comment[]>([]);

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