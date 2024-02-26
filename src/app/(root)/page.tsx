import { auth, currentUser } from "@clerk/nextjs";
import { Metadata } from "next";
import HomeNav from "./_components/home-nav";
import Searchbar from "@/components/shared/searchbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Blendy - Time to Blendy!',
  description: 'This is Blendy',
};

export default function Home() {
  return (
    <>
      <HomeNav />
      <div className="flex flex-col w-full justify-center items-center bg-gradient-to-r from-amber-500 to-pink-500 gap-4 h-[80vh] *:flex-grow-0">
        <p className="text-white text-4xl font-bold">
          Start browsing 3D Models
        </p>
        <Searchbar />
        <p className="text-white text-2xl font-medium">or</p>

        <p className="text-white text-4xl font-bold">Upload your own (for free!)</p>

        <Link href="/upload">
          <Button variant={"secondary"}>
            Upload
          </Button>
        </Link>
      </div>
    </>
  );
}
