"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
            <TooltipTrigger>
                <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="text-white absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button></TooltipTrigger>
            <TooltipContent className="min-w-max">
                Switch between Light and Dark modes.
            </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
