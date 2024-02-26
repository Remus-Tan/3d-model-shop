import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeDiff(date: Date) {
    //@ts-ignore typescript hates dates? maybe
    const timeDiff = (new Date() - new Date(date)) / 1000 / 60 / 60;

    if (timeDiff <= 1) {
        const result = Math.floor(timeDiff * 60);
        const plural = result == 1 ? "" : "s";
        return `${result} minute${plural} ago`;
    } else if (timeDiff <= 24) {
        const result = Math.floor(timeDiff);
        const plural = result == 1 ? "" : "s";
        return `${result} hour${plural} ago`;
    } else if (timeDiff > 24 && timeDiff <= 168) {
        const result = Math.floor(timeDiff / 24);
        const plural = result == 1 ? "" : "s";
        return `${result} day${plural} ago`;
    } else if (timeDiff > 168 && timeDiff <= 5208) {
        const result = Math.floor(timeDiff / 24 / 31);
        const plural = result == 1 ? "" : "s";
        return `${result} month${plural} ago`;
    } else if (timeDiff > 5208) {
        const result = Math.floor(timeDiff / 24 / 31 / 365);
        const plural = result == 1 ? "" : "s";
        return `${result} year${plural} ago`;
    }
}