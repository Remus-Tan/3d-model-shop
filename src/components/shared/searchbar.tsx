"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

export default function SearchBar() {
    const [inputPresent, setInputPresent] = useState(false);

    return (
        <div className="flex rounded-md focus-within:!ring-offset-0 focus-within:!ring-1 focus-within:!ring-amber-400 flex-grow justify-center">
            <Input
                className="
                    rounded-none rounded-l-md
                    focus:!ring-offset-0 focus:!ring-1 focus:!ring-amber-400
                    max-w-3xl
                    "
                placeholder="Search"
            />
            <Button className="rounded-none rounded-r-md">
                <Search />
            </Button>
        </div>
    );
}