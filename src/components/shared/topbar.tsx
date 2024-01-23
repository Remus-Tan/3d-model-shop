"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    SignInButton,
    SignUpButton,
    useUser,
} from "@clerk/nextjs";

import { useClerk } from "@clerk/clerk-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from "../ui/hover-card";
import { useToast } from "../ui/use-toast";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

import { ChevronDown } from "lucide-react";

import ModeToggle from "../mode-toggle";
import Searchbar from "./Searchbar";

export default function Topbar() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [loading, setLoading] = useState(true);
    const { signOut } = useClerk();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded == false) return;

        setLoading(false);

    }, [isLoaded]);



    return (
        <nav className="sticky top-0 left-0 right-0 shadow-sm">
            <div className="max-w-[2000px] flex items-center pl-10 pr-10 p-2 h-18 z-50 gap-4 m-auto">
                <Link href="/" className="flex items-center">
                    <Image
                        alt="logo"
                        src="/logo.svg"
                        width={64}
                        height={64}
                    />
                    <p className="text-stone-800 font-semibold">
                        3D Shop
                    </p>
                </Link>
                <Searchbar />

                {loading && (
                    <>
                        <Skeleton className="w-[200px] h-[20px] rounded-full" />
                        <Skeleton className="w-[32px] h-[32px] rounded-full" />
                    </>
                )}

                {!loading && (
                    <>
                        {isSignedIn &&
                            <Link href="/upload">
                                <Button>
                                    Upload
                                </Button>
                            </Link>
                        }

                        <ModeToggle />

                        {isSignedIn && <UserDropdown />}
                        {!isSignedIn && <LogInDropdown />}
                    </>
                )}
            </div>
        </nav >
    );

    function UserDropdown() {
        const hoverCardClass = "flex-col items-start focus:bg-white hover:!bg-amber-400 transition-none rounded-none cursor-pointer p-2 text-sm";
        const [hover, setHover] = useState(false);

        const hoveredColor = "#e6cf00";
        const defaultColor = "#424242";

        return (
            <HoverCard openDelay={0} closeDelay={10} onOpenChange={(open: boolean) => setHover(open)}>
                <HoverCardTrigger className="flex items-baseline">
                    <Link href="/user/profile">
                        <Image src={user!.imageUrl} alt="Profile picture" width="32" height="32" className="mr-2 cursor-pointer" />
                    </Link>
                    <ChevronDown width={12} stroke={hover ? hoveredColor : defaultColor} />
                </HoverCardTrigger>
                <HoverCardContent className="p-0 pt-2 pb-2 w-32">
                    <Link href="/user/profile">
                        <div className={hoverCardClass}>
                            Profile
                        </div>
                    </Link>

                    <hr className="mt-2 mb-2" />

                    <Link href="/modelview">
                        <div className={hoverCardClass}>
                            Models
                        </div>
                    </Link>
                    <Link href="/">
                        <div className={hoverCardClass}>
                            Likes
                        </div>
                    </Link>

                    <hr className="mt-2 mb-2" />

                    <Link href="/user/settings">
                        <div className={hoverCardClass}>
                            Settings
                        </div>
                    </Link>

                    <hr className="mt-2 mb-2" />

                    <div onClick={async () => {
                        await signOut();
                        toast({
                            title: "Logged out successfully.",
                            description: "See you again! 😋"
                        });
                        router.push('/');
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
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant={"ghost"} className="dark:">
                        Log in
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0 pt-2 pb-2 mr-14">
                    <DropdownMenuItem className="flex-col items-start focus:bg-white">
                        <p>
                            Don&apos;t have an account?
                        </p>
                        <SignUpButton mode="modal">
                            <p className="cursor-pointer">
                                Click here to sign up!
                            </p>
                        </SignUpButton>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="focus:bg-white">
                        <SignInButton mode="modal">
                            <Button className="w-full">
                                Log In
                            </Button>
                        </SignInButton>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
}