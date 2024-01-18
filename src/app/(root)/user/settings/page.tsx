"use client";

import { useAuth } from "@clerk/nextjs";
import useForm from "react-hook-form";
import * as z from "zod";


export default function Settings() {
    const user = useAuth();

    const getUserData = async () => {
        await fetch('');

    };

    return (
        <>
        {user.userId}
        </>
    );
}