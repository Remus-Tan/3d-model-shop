import { currentUser } from "@clerk/nextjs"

export default async function Profile() {
    const user = await currentUser();
    
    return (
        <>
        {JSON.stringify(user)}
        </>
    )
}