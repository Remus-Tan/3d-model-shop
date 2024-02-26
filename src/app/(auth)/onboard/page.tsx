"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Onboard() {
    const { isSignedIn, user } = useUser();
    const { toast } = useToast();


    const [freshlyOnboarded, setOnboard] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        if (!isSignedIn) return;

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user?.id}`)
            .then((res) => {
                if (freshlyOnboarded) {
                    setLoading(false);
                }

                // In case users try to manually come to this page
                // Freshly onboarded check is to prevent re-fetching
                if (res.status === 200 && !freshlyOnboarded) {
                    router.push('/');
                }

                if (res.status === 404 && !freshlyOnboarded) {
                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user?.id}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            id: user.id,
                            email: user.primaryEmailAddress?.emailAddress,
                            firstName: user.firstName,
                            lastName: user.lastName || "",
                            handle: user.id,
                            imageUrl: user.imageUrl,
                            skills: [],
                            externalUrls: []
                        })
                    }).then((res) => setOnboard(true));
                }
            });

    }, [isSignedIn, freshlyOnboarded]);

    return (
        <div className="flex flex-col justify-center m-auto mt-12 w-fit p-8 rounded-lg border-2 gap-4">
            {loading && (
                <>
                    <Skeleton className="w-[64px] h-[64px] rounded-full self-center" />
                    <Skeleton className="w-[420px] h-[40px] rounded-full" />
                    <Skeleton className="w-[320px] h-[20px] rounded-full" />

                    <div className="flex gap-2 justify-end">
                        <Skeleton className="h-[40px] rounded-full w-full" />
                        <Skeleton className="h-[40px] rounded-full w-full" />
                    </div>
                </>
            )}

            {!loading && (
                <>
                    <Image src={user!.imageUrl || ""} alt="Profile picture" width={64} height={64} className="rounded-full self-center" />
                    <h1 className="text-4xl font-medium self-center">😇 Welcome to Blendy! 📦</h1>

                    <p>Would you like to set up your profile now?</p>

                    <div className="flex gap-2 justify-end">
                        <Link href={"/"} className="w-full">
                            <Button variant={"secondary"} className="w-full">
                                I&apos;ll do it later.
                            </Button>
                        </Link>

                        <Link href={"/user/settings/profile"} className="w-full">
                            <Button className="w-full">
                                Yes please!
                            </Button>
                        </Link>
                    </div>
                </>
            )}
        </div >
    );
}
