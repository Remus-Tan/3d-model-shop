// Don't use because this causes some issue that makes the styling break (client and server does not match blah blah)
// "use client";

// import * as React from "react";
// import { Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";

// import { Button } from "@/components/ui/button";
// import {
//     Tooltip,
//     TooltipContent,
//     TooltipProvider,
//     TooltipTrigger,
// } from "@/components/ui/tooltip";


// export default function ModeToggle() {
//     const { theme, setTheme } = useTheme();

//     return (
//         <TooltipProvider delayDuration={100}>
//             <Tooltip>
//                 <TooltipTrigger>
//                     <div className="border border-border rounded-md p-2" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
//                         <Sun className="text-foreground h-[1.2rem] w-[1.2rem] transition-all dark:hidden" />
//                         <Moon className="text-foreground h-[1.2rem] w-[1.2rem] transition-all hidden dark:block" />
//                     </div>
//                 </TooltipTrigger>
//                 <TooltipContent className="min-w-max">
//                     Switch between Light and Dark modes.
//                 </TooltipContent>
//             </Tooltip>
//         </TooltipProvider>
//     );
// }
