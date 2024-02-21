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

import { ChevronDown, Github } from "lucide-react";

import Searchbar from "./searchbar";
import { revalidatePath } from "next/cache";

export default function Footer() {
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
        <nav className="bottom-0 left-0 right-0 bg-primary">
            <div className="max-w-[2000px] flex items-center pl-10 pr-10 p-2 min-h-max gap-4 m-auto">
                <Logo />
                <div className="ml-auto flex gap-10">
                    <p className="text-white">Thank you for visiting Blendy!</p>
                    <a href="https://github.com/Remus-Tan/blendy" target="_blank">
                        <Github stroke="white " />

                    </a>
                </div>
            </div>
        </nav >
    );


    function Logo() {
        return (
            <>
                <Image
                    alt="logo"
                    src="/logo_white.svg"
                    width={0}
                    height={0}
                    className="w-10"

                />
                <p className="text-white text-foreground text-xl font-semibold">
                    Blendy
                </p>
            </>
        );
    }
}