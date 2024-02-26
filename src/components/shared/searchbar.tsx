"use client";

import { FormEvent, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Searchbar() {
    const [inputValue, setInputValue] = useState("");
    const router = useRouter();

    const formSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push("/search/" + inputValue);
    };

    return (
        // <div className="flex rounded-md flex-grow justify-center">
        <form
            className="hidden md:flex rounded-md flex-grow justify-center"
            onSubmit={formSubmit}
        >

            <Input
                className="
                    rounded-none rounded-l-md max-w-3xl peer border-border
                    focus:!ring-offset-0 focus:!ring-0 focus:border-primary
                    "
                placeholder="Search"
                type="search"
                onChange={e => setInputValue(e.target.value)}
            />
            <Button className="
                rounded-none rounded-r-md border-r border-b border-t transition-none border-border
                bg-background hover:bg-secondary
                peer-focus:!ring-offset-0 peer-focus:!ring-0 peer-focus:border-primary
                "
                type="submit"

            >
                <Search className="text-foreground" />
            </Button>
        </form >
        // </div>
    );
}