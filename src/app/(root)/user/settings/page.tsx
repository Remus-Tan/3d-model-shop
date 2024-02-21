import { redirect } from "next/navigation";

// Redirect all users trying to access /settings because it doesn't exist
// All settings pages are nested inside /settings e.g. /settings/profile
export default function Page() {
    redirect("/user/profile&tab=models");
}