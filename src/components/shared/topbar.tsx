"use client";

import Image from "next/image";
import Link from "next/link";
import SearchBar from "./Searchbar";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";

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
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export default function Topbar() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [loading, setLoading] = useState(true);
    const { signOut } = useClerk();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded == false) return;
        
        setLoading(false);

    }, [isSignedIn]);

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
                <SearchBar />

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

                        {isSignedIn && (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Image src={user.imageUrl} alt="Profile picture" width={32} height={32} className="rounded-full" />
                                    </DropdownMenuTrigger>
                                    < DropdownMenuContent className="p-0 pt-2 pb-2 mt-2 mr-14">
                                        <Link href={"/modelview"}>
                                            <DropdownMenuItem className="flex-col items-start focus:bg-white hover:!bg-amber-400 transition-none rounded-none cursor-pointer">
                                                Models
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuItem className="flex-col items-start focus:bg-white hover:!bg-amber-400 transition-none rounded-none cursor-pointer">
                                            <Link href={"/"}>
                                                Likes
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="pt-1 bg-stone-300" />
                                        <Link href={"/user/profile"}>
                                            <DropdownMenuItem className="flex-col items-start focus:bg-white hover:!bg-amber-400 transition-none rounded-none cursor-pointer">
                                                Profile
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link href={"/user/settings"}>
                                            <DropdownMenuItem className="flex-col items-start focus:bg-white hover:!bg-amber-400 transition-none rounded-none cursor-pointer">
                                                Settings
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuSeparator className="pt-1 bg-stone-300" />
                                        <div onClick={async () => {
                                            await signOut();
                                            toast({
                                                title: "Logged out successfully.",
                                                description: "See you again! 😋"
                                            });
                                            router.push('/');
                                        }}>
                                            <DropdownMenuItem className="flex-col items-start focus:bg-white hover:!bg-amber-400 transition-none rounded-none cursor-pointer">
                                                Log Out
                                            </DropdownMenuItem>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}

                        {!isSignedIn && (
                            <>
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
                            </>
                        )}
                    </>
                )}
            </div>
        </nav >
    );
}