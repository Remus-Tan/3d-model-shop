"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/clerk-react";
import { useToast } from "../ui/use-toast";

import { Github } from "lucide-react";

export default function Footer() {
    const { isLoaded } = useUser();
    const [ setLoading] = useState(true);
    const pathname = usePathname();

    const isSettings = ["/user/settings/profile"].includes(pathname);

    return (
        <nav className="bottom-0 left-0 right-0 bg-primary">
            <div className="max-w-[2000px] flex items-center justify-between pl-10 pr-10 p-2 min-h-max gap-4 m-auto">
                <Logo />
                <p className="text-white">Thank you for visiting Blendy!</p>
                <a href="https://github.com/Remus-Tan/blendy" target="_blank" className="flex gap-2">
                    <Github stroke="white " />
                    <span className="text-white">Github</span>
                </a>
            </div>
        </nav >
    );


    function Logo() {
        return (
            <div className="flex items-center">
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
            </div>
        );
    }
}