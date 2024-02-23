"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast, useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Model } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Please provide a name.")
        .max(40, "Too long!"),
    description: z.string()
        .trim()
        .min(1, "Please provide a description.")
        .max(255, "Too long!"),
    published: z.boolean()
});

type formValues = z.infer<typeof formSchema>;

function LoadForm() {
    return (
        <>
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-[144] h-6 rounded-full" />
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-[144] h-6 rounded-full" />
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-[144] h-6 rounded-full" />
        </>
    );
}

function LevaControls() {
    return (
        <>
        </>
    );
}

export default function SettingsForm({
    defaultValues,
    modelId
}: {
    defaultValues: Model,
    modelId: string
}) {
    const [settings, setSettings] = useState();
    const { toast } = useToast();
    const [handleValidity, setHandleValidity] = useState(false);
    const [refresh, setRefresh] = useState(false); // This is to refresh the form value after submitting changes
    const router = useRouter();
    const [isDeleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!settings || refresh) {
            fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/models/" + Number(modelId))
                .then(res => res.json())
                .then(data => {
                    setSettings(data);
                    form.reset(data);
                    setRefresh(false);
                });
        }
    }, [refresh]);

    const form = useForm<formValues>({
        resolver: zodResolver(formSchema),
        defaultValues: useMemo(() => settings, [settings]),
        mode: "all"
    });

    function onSubmit(data: formValues) {
        return fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/models/${modelId}`, {
            method: "PATCH",
            body: JSON.stringify(data)
        }).then((res) => {
            if (res.ok) {
                setRefresh(true);
                toast({
                    title: "Saved! ✅",
                    description: "Changes saved successfully."
                });
            } else {
                toast({
                    title: "Uh oh! ❌",
                    description: "Changes could not be saved."
                });
            }
        });
    };

    return (
        <>
            {!settings ?
                <LoadForm />
                :
                <div className="flex flex-1 m-4 gap-4">
                    <Form {...form}>
                        <form onSubmit={(form.handleSubmit(onSubmit))} className="flex flex-col w-full gap-8 lg:max-w-2xl">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="text-foreground">
                                        <FormLabel>Name</FormLabel>
                                        {form.formState.errors.name ?
                                            <FormMessage /> :
                                            <FormDescription>Name of your model.</FormDescription>
                                        }
                                        <FormControl>
                                            <Input placeholder="Model name" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="text-foreground">
                                        <FormLabel>Description</FormLabel>
                                        {form.formState.errors.description ?
                                            <FormMessage /> :
                                            <FormDescription>Additional information about your model.</FormDescription>
                                        }
                                        <FormControl>
                                            <Textarea placeholder="Description" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="published"
                                render={({ field }) => (
                                    <FormItem className="flex items-center text-foreground -mt-4 gap-2">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription className="!mt-0">Publish model publicly?</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-2 *:flex-grow">
                                <Button
                                    type="button"
                                    variant={"secondary"}
                                    onClick={() => { form.reset(settings); }}
                                >
                                    Reset
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        // If form values did not change, disable button
                                        JSON.stringify(form.formState.defaultValues) == JSON.stringify(form.getValues()) ||

                                        // If form is being submitted / loading / has validation errors, disable button
                                        form.formState.isSubmitting ||
                                        form.formState.isLoading ||
                                        !form.formState.isValid ||
                                        isDeleting
                                    }
                                >
                                    Save
                                </Button>
                                {(!form.formState.isValid)}
                                {/* I don't know why but I have to render this property in order to make the damn save button reflect the first change but it works so I'm leaving it in */}
                            </div>
                            <Dialog >
                                <DialogTrigger className="mt-auto w-fit">
                                    <Button
                                        disabled={isDeleting}
                                        type="button"
                                        variant={"destructive"}
                                    >
                                        Delete Model
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader className="gap-4">
                                        <DialogTitle>Are you sure?</DialogTitle>
                                        <DialogDescription className="flex gap-4 *:flex-grow">
                                            <DialogClose>
                                                <Button disabled={isDeleting} className="w-full" variant={"secondary"}>No!!!</Button>
                                            </DialogClose>
                                            <Button disabled={isDeleting} variant={"destructive"} onClick={() => {
                                                setDeleting(true);
                                                deleteModel(modelId, router);
                                            }}
                                            >Yes... 🥵</Button>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </form>
                    </Form >
                </div>
            }
        </>
    );
}

const deleteModel = async (modelId: string, router: AppRouterInstance) => {
    await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/models/${modelId}`, { method: "DELETE" })
        .then((res) => {
            toast({
                title: "Model deleted!",
                description: "Redirecting..."
            });
            router.push("/user/profile?tab=models");
        });
};