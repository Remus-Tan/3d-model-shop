import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (<div className="flex justify-center mt-20">
    <SignIn
      appearance={{
        variables: {
          colorPrimary: "#ff870f",
          borderRadius: "0.1rem",
          fontSize: "1.2"
        }
      }}/>
  </div>
  );
}