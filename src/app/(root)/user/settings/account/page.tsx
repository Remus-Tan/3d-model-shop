"use client";

import { Separator } from "@/components/ui/separator";
import { useAuth } from "@clerk/nextjs";
import useForm from "react-hook-form";
import * as z from "zod";
import ProfileForm from "../_components/profile-form";


export default function Settings() {
    const user = useAuth();

    const getUserData = async () => {
        await fetch('');

    };

    return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Profile</h3>
            <p className="text-sm text-muted-foreground">
              This is how others will see you on the site.
            </p>
          </div>
          <Separator />
          <ProfileForm />
        </div>
      );
}