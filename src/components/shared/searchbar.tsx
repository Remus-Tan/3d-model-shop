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
                    rounded-none rounded-l-md max-w-3xl peer border-border
                    focus:!ring-offset-0 focus:!ring-0 focus:border-primary
                    "
                placeholder="Search"
                type="search"
            />
            <Button className="
                rounded-none rounded-r-md border-r border-b border-t transition-none border-border
                bg-background hover:bg-secondary
                peer-focus:!ring-offset-0 peer-focus:!ring-0 peer-focus:border-primary
                ">
                <Search className="text-foreground" />
            </Button>
        </div>
    );
}