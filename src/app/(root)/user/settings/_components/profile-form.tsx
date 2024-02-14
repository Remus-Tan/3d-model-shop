"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, Trash2, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    firstName: z.string()
        .min(1, "Please provide a first name.")
        .max(30, "Cannot be longer than 30 characters.")
        .regex(new RegExp("^(?! )[A-Za-z ]*(?<! )$"), "Name can only contain alphabets and cannot start or end with a space."),
    lastName: z.string()
        .max(30, "Cannot be longer than 30 characters!")
        .regex(new RegExp("^(?! )[A-Za-z ]*(?<! )$"), "Name can only contain alphabets and cannot start or end with a space.")
        .optional(),
    handle: z.string()
        .min(1, "A handle is mandatory.")
        .max(32, "Cannot be longer than 32 characters.")
        .regex(new RegExp("^[a-zA-Z0-9_]*$"),
            "Your handle can only contain alphabets, numbers and underscores."),
    email: z.string(),
    emailPublic: z.boolean(),
    headline: z.string()
        .max(32, "Cannot be longer than 32 characters.")
        .optional(),
    aboutMe: z.string()
        .max(128, "Cannot be longer than 128 characters.")
        .optional(),
    externalUrls: z.array(
        z.object({
            url: z.string().url("Please enter a URL.")
        })
    ).optional(),
    skills: z.array(
        z.string()
    ).optional()
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

const skills = ["3D-Coat", "3ds Max", "AutoCAD", "Blender", "Cinema 4D",
    "GIMP", "Houdini", "Lightwave 3D", "Maya", "Modo", "Mudbox", "Photogrammetry", 
    "Photoshop", "Revit", "Rhino", "Sculptris", "SketchUp", "Softimage", "SolidWorks",
    "Substance", "Unity", "Unreal", "Vray", "ZBrush"
];

export default function ProfileForm() {
    const { userId } = useAuth();
    const [user, setUser] = useState();
    const { toast } = useToast();
    const [isFetchingHandle, setFetchingHandle] = useState(false);
    const [hasFetchedHandle, setFetchedHandle] = useState(false);
    const [handleValidity, setHandleValidity] = useState(false);
    const [refresh, setRefresh] = useState(false); // This is to refresh the form value after submitting changes

    useEffect(() => {
        if (!user || refresh) {
            fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/users/${userId}`)
                .then(res => res.json())
                .then(data => {
                    // For new users, replace this array with many "" values instead of initial value to properly make the form changed check work
                    if (data.skills.length == 0) { data.skills = Array(skills.length).fill(""); }
                    
                    setUser(data);
                    form.reset(data);
                    setRefresh(false);
                });
        }
    }, [refresh]);

    const form = useForm<formValues>({
        resolver: zodResolver(formSchema),
        defaultValues: useMemo(() => user, [user]),
        mode: "all",
    });

    const { fields, append, remove } = useFieldArray({
        name: "externalUrls",
        control: form.control
    });

    const skillsArray = useFieldArray({
        name: "skills",
        control: form.control
    });

    function onSubmit(data: formValues) {
        return fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/users/${userId}`, {
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

    function fetchHandle() {
        // During isFetchingHandle state, handle input and check button become disabled
        setFetchingHandle(true);

        // Reset this state, if fetched handle is available and valid then set to true
        setFetchedHandle(false);

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/handle/${form.getValues("handle")}`).then((res) => {
            if (res.ok) { // Success means handle already in use
                setHandleValidity(false);
            } else { // Error means handle is not in use, fetched is set to true to allow form submission
                setHandleValidity(true);
            }
            setFetchedHandle(true);
            setFetchingHandle(false);

            setTimeout(() => form.setFocus("handle"), 1);
        });
    };

    return (
        <>
            {
                !user ?
                    <LoadForm />
                    :
                    <Form {...form}>
                        <form onSubmit={(form.handleSubmit(onSubmit))} className="flex flex-col gap-8">

                            <FormField
                                control={form.control}
                                name="handle"
                                disabled={isFetchingHandle}
                                render={({ field }) => (
                                    <FormItem className="text-foreground">
                                        <FormLabel>Handle</FormLabel>
                                        {form.formState.errors.handle ?
                                            <FormMessage /> :
                                            <FormDescription>A unique handle that will show up on your profile and on your comments.</FormDescription>
                                        }
                                        <FormControl className="flex">
                                            <Input
                                                placeholder="MyUniqueHandle" {...field}
                                                defaultValue={form.formState.defaultValues?.handle}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    // Reset previous fetch status and validity
                                                    setFetchedHandle(false);
                                                    setHandleValidity(false);
                                                }
                                                }
                                            />
                                        </FormControl>
                                        <div className="flex gap-3 items-center">
                                            <Button
                                                disabled={
                                                    isFetchingHandle || hasFetchedHandle ||
                                                    form.formState.defaultValues?.handle == form.getValues("handle") ||
                                                    form.formState.errors.handle
                                                }
                                                onClick={fetchHandle}>Check Availability
                                            </Button>
                                            {isFetchingHandle && (
                                                <>
                                                    <Loader2 className="animate-spin" />
                                                    <FormDescription>Checking handle...</FormDescription>
                                                </>
                                            )}
                                            {(hasFetchedHandle && handleValidity) &&
                                                <>
                                                    <CheckCircle2 stroke="green" />
                                                    <FormDescription className="text-green-700">Handle is available!</FormDescription>
                                                </>
                                            }
                                            {(hasFetchedHandle && !handleValidity) &&
                                                <>
                                                    <XCircle stroke="red" />
                                                    <FormDescription className="text-red-700">Handle is already in use!</FormDescription>
                                                </>
                                            }
                                        </div>
                                    </FormItem>
                                )
                                }
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="text-foreground">
                                        <FormLabel>Email</FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Input disabled {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="emailPublic"
                                render={({ field }) => (
                                    <FormItem className="flex items-center text-foreground -mt-4 gap-2">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription className="!mt-0">Publish email address on profile?</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem className="text-foreground">
                                        <FormLabel>First Name</FormLabel>
                                        {form.formState.errors.firstName ?
                                            <FormMessage /> :
                                            <FormDescription>The name that will show up on your profile and on your comments.</FormDescription>
                                        }
                                        <FormControl>
                                            <Input placeholder="First Name" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem className="text-foreground">
                                        <FormLabel>Last Name</FormLabel>
                                        {form.formState.errors.lastName ?
                                            <FormMessage /> :
                                            <FormDescription>The name that will show up on your profile and on your comments.</FormDescription>
                                        }
                                        <FormControl>
                                            <Input placeholder="Last Name" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="headline"
                                render={({ field }) => (
                                    <FormItem className="text-foreground">
                                        <FormLabel>Headline</FormLabel>
                                        {form.formState.errors.headline ?
                                            <FormMessage /> :
                                            <FormDescription>An introduction to your profile in one line.</FormDescription>
                                        }
                                        <FormControl>
                                            <Input placeholder="Headline" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="aboutMe"
                                render={({ field }) => (
                                    <FormItem className="text-foreground">
                                        <FormLabel>About Me</FormLabel>
                                        {form.formState.errors.aboutMe ?
                                            <FormMessage /> :
                                            <FormDescription>Share more about yourself.</FormDescription>
                                        }
                                        <FormControl>
                                            <Textarea placeholder="About Me" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2">
                                <FormLabel>External Links</FormLabel>
                                <FormDescription>Add links to any external platform.</FormDescription>
                                {fields.map((field, index) => (
                                    <FormField
                                        control={form.control}
                                        key={field.id}
                                        name={`externalUrls.${index}.url`}
                                        render={({ field }) => (
                                            <FormItem>
                                                {index === 0 && (<>
                                                </>)}

                                                <div className="flex gap-2">
                                                    <FormControl>
                                                        <Input placeholder="URL" {...field} />
                                                    </FormControl>
                                                    <Button onClick={() => { remove(index);}}><Trash2 width={18} /></Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                            <div>
                                <Button type="button" onClick={() => { append({ url: "" }); }}>
                                    Add External URL
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <FormLabel>Skills</FormLabel>
                                <FormDescription>Display your skills on your profile.</FormDescription>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, index) => (
                                        <FormField
                                            control={form.control}
                                            key={skill}
                                            name={`skills.${index}`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex gap-2">
                                                        <FormControl>
                                                            <Button
                                                                type="button"
                                                                onClick={() => { field.onChange(field.value == "" ? skill : ""); }}
                                                                className={cn(
                                                                    "rounded-md font-extralight text-foreground bg-muted transition-none hover:bg-muted-foreground hover:text-background",
                                                                    form.getValues("skills")[index] != "" && "text-background bg-muted-foreground")}
                                                            >
                                                                {skill}
                                                            </Button>
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>


                            <div className="flex gap-2 *:flex-grow">
                                <Button
                                    type="button"
                                    variant={"secondary"}
                                    onClick={() => {
                                        form.reset(user);
                                        setFetchedHandle(false);
                                    }
                                    }
                                >Reset</Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        // If form values did not change, disable button
                                        JSON.stringify(form.formState.defaultValues) == JSON.stringify(form.getValues()) ||

                                        // If form is being submitted / loading / has validation errors, disable button
                                        form.formState.isSubmitting ||
                                        form.formState.isLoading ||
                                        !form.formState.isValid ||

                                        // If handle field fetch has not been validated AND value is not the same as the original, disable
                                        (form.getValues("handle") != form.formState.defaultValues?.handle && !handleValidity)
                                    }
                                >
                                    Save
                                </Button>
                                {(!form.formState.isValid)}
                                {/* I don't know why but I have to render this property in order to make the damn save button reflect the first change but it works so I'm leaving it in */}
                            </div>
                        </form>
                    </Form >
            }
        </>
    );
}