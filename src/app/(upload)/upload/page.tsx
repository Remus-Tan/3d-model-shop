import Dropzone from "@/components/shared/Dropzone";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UploadModel() {
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl h-36 flex justify-center items-center">Upload a new model</h1>
            <Dropzone />
        </div>
    );
}