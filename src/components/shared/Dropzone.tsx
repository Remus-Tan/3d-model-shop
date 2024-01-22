"use client";

import { cn } from '@/lib/utils';
import { useUser } from '@clerk/clerk-react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Download, FileBox, Loader2 } from 'lucide-react';
import { useState } from 'react';
import DropzoneComponent, { useDropzone } from 'react-dropzone';
import { Skeleton } from '../ui/skeleton';
import { storage } from '@/firebase';
import { Submission } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { toast } from '../ui/use-toast';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function Dropzone() {
    const [loading, setLoading] = useState(false);
    const [fileLoaded, setFileLoaded] = useState(false);
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    const onDropAccepted = async (files: File[]) => {
        if (loading) return;
        setLoading(true);

        await uploadPost(files[0]);
    };

    const onDropRejected = () => {
        toast({
            title: "Invalid file!"
        });
    };

    const uploadPost = async (selectedFile: File) => {
        if (!isLoaded) return;


        const dbRef = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/models`, {
            method: "POST",
            body: JSON.stringify({
                creatorId: user?.id
            })
        });

        const dbRefObject: Submission = await dbRef.json();
        const modelRef = ref(storage, `models/${dbRefObject.id}`);

        uploadBytes(modelRef, selectedFile).then(async (snapshot) => {
            const downloadUrl = await getDownloadURL(modelRef);

            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/models`, {
                method: "PATCH",
                body: JSON.stringify({
                    id: dbRefObject.id,
                    downloadUrl
                })
            });
        });

        toast({
            title: "Submission created!"
        });

        router.push(`/models/${dbRefObject.id}/settings`);
    };


    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        disabled: loading,
        onDropAccepted,
        onDropRejected,
        maxFiles: 1,
        maxSize: 2000000
    });

    return (
        <section>
            <div {...getRootProps()} className={cn(
                "border-stone-300 border-dashed border-2 flex flex-col items-center bg-white w-fit p-12 pl-24 pr-24 mb-10",
                isDragActive && "bg-stone-500"
            )}>
                {!isDragActive ?
                    !loading &&
                    <FileBox
                        width='200' height='200' strokeWidth='.75'
                        className="m-10 transition-all hover:scale-110 hover:animate-pulse hover:cursor-pointer"
                    />
                    :
                    !loading &&
                    <Download
                        width='200' height='200' strokeWidth='.75'
                        className="m-10 invert brightness-200"
                    />
                }
                {loading && (<Loader2 width='200' height='200' strokeWidth='.75' className='m-10 animate-spin' />)}
                <input {...getInputProps()} className='' />
                <>
                    <div className='text-lg font-semibold m-4'>
                        {!isDragActive ?
                            !loading ?
                                <>
                                    <span>Drag & Drop or </span>
                                    <span className='text-amber-400 hover:text-amber-600 hover:cursor-pointer'>browse</span>
                                </>
                                :
                                <>
                                    <span>Uploading...</span>
                                </>
                            :
                            <>
                                <span className='text-white'>Drop to upload file</span>
                            </>
                        }
                    </div>
                    <div>
                        <span className={
                            isDragActive ? "text-stone-500" :
                                loading ? "text-white" :
                                    ""
                        }>We only support .glb and .gltf files up to 2MB. Don't upload anything else!</span>
                    </div>
                </>
            </div>

            {!loading ?
                <Link href="/" className="self-start">
                    <Button className="w-fit p-6">Cancel</Button>
                </Link>
                :
                <Button className="w-fit p-6" disabled>Cancel</Button>
            }
        </section>
    );
}