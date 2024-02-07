"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Item } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarNavItems = [
    {
        title: "Profile",
        href: "/user/settings/profile",
    },
    {
        title: "Account",
        href: "/user/settings/account",
    }
];

export default function SidebarNav() {
    const pathname = usePathname();
    return (
        <nav className="flex flex-col">
            {sidebarNavItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        pathname === item.href ?
                            "text-foreground bg-muted hover:bg-muted" : "text-foreground hover:bg-transparent hover:underline"
                    )
                    }
                >
                    {item.title}
                </Link>
            ))}
        </nav>
    );
}