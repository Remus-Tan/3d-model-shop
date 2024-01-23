"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

export default function Searchbar() {
    const [inputPresent, setInputPresent] = useState(false);

    return (
        <div className="flex rounded-md flex-grow justify-center">
            <Input
                className="
                    rounded-none rounded-l-md max-w-3xl peer
                    focus:!ring-offset-0 focus:!ring-0 focus:border-amber-400
                    "
                placeholder="Search"
            />
            <Button className="
                bg-white rounded-none rounded-r-md border-r border-b border-t transition-none
                hover:bg-stone-200
                peer-focus:!ring-offset-0 peer-focus:!ring-0 peer-focus:border-amber-400
                dark:bg-amber-400
                ">
                <Search />
            </Button>
        </div>
    );
}