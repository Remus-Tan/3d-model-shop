"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/clerk-react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { useToast } from "../ui/use-toast";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

import { ChevronDown } from "lucide-react";

import Searchbar from "./searchbar";
import { revalidatePath } from "next/cache";

export default function Topbar() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [loading, setLoading] = useState(true);
    const { signOut } = useClerk();
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();

    const isSettings = ["/user/settings/profile"].includes(pathname);
    const logoType = isSettings ? "settings" : "regular";

    useEffect(() => {
        if (isLoaded == false) return;

        setLoading(false);

    }, [isLoaded]);

    return (
        <nav className="sticky top-0 left-0 right-0 shadow-sm bg-background z-50">
            <div className="max-w-[2000px] flex items-center pl-10 pr-10 p-2 gap-4 m-auto">
                <Logo type={logoType} />
                {!isSettings && <Searchbar />}

                {loading && (
                    <>
                        <Skeleton className="w-[200px] h-[20px] rounded-full" />
                        <Skeleton className="w-[32px] h-[32px] rounded-full" />
                    </>
                )}

                {!loading && (
                    <div className="gap-4 flex items-center ml-auto">
                        {isSignedIn && <UploadButton />}
                        {/* <ModeToggle /> */}
                        {isSignedIn && <UserDropdown />}
                        {!isSignedIn && <LogInDropdown />}
                    </div>
                )}
            </div>
        </nav >
    );


    function Logo(
        { type }: { type: "regular" | "settings" }
    ) {
        return (
            <Link
                className="flex items-center"
                href={
                    type === "regular" ?
                        "/" :
                        "/user/profile"
                }>
                <Image
                    alt="logo"
                    src="/logo.svg"
                    width={0}
                    height={0}
                    className="w-10"
                />
                <p className="text-foreground text-xl font-semibold">
                    {type === "regular" && <>Blendy</>}
                    {type === "settings" && <>Back to Profile</>}
                </p>
            </Link>
        );
    }

    function UploadButton() {
        return (
            <Link href="/upload">
                <Button>
                    Upload
                </Button>
            </Link>
        );
    }

    function UserDropdown() {
        const hoverCardClass = "flex-col items-start focus:bg-white hover:bg-primary hover:text-white transition-none rounded-none cursor-pointer p-2 text-sm";
        const [hover, setHover] = useState(false);

        return (
            <HoverCard openDelay={0} closeDelay={30} onOpenChange={(open: boolean) => setHover(open)}>
                <HoverCardTrigger className="flex items-baseline">
                    <Image src={user!.imageUrl} alt="Profile picture" width="32" height="32" className="mr-2 rounded-sm" />
                    <ChevronDown width={12} stroke={hover ? "orange" : "grey"} className="dark:outline" />
                </HoverCardTrigger>
                <HoverCardContent className="p-0 pt-2 pb-2 w-32 dark:bg-zinc-700 border-border">
                    <Link href="/user/profile" onClick={() => { revalidatePath('/user/profile'); }}>
                        <div className={hoverCardClass}>
                            Profile
                        </div>
                    </Link>

                    <hr className="my-2" />

                    <Link href={"/user/profile?tab=models"} onClick={() => { revalidatePath('/user/profile?tab=models'); }}>
                        <div className={hoverCardClass}>
                            Models
                        </div>
                    </Link>
                    <Link href={"/user/profile?tab=likes"} onClick={() => { revalidatePath('/user/profile?tab=likes'); }}>
                        <div className={hoverCardClass}>
                            Likes
                        </div>
                    </Link>

                    <hr className="my-2" />

                    <Link href="/user/settings/profile">
                        <div className={hoverCardClass}>
                            Settings
                        </div>
                    </Link>

                    <hr className="my-2" />

                    <div onClick={async () => {
                        await signOut();
                        router.push('/');
                        toast({
                            title: "You're logged out.",
                            description: "See you again! 😋"
                        });
                    }}>
                        <div className={hoverCardClass}>
                            Log Out
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
        );
    }

    function LogInDropdown() {
        return (
            <SignInButton>
                <Button variant={"ghost"}>
                    Log in
                </Button>
            </SignInButton>
        );
    }
}