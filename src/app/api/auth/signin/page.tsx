import { getProviders } from "next-auth/react";
import SignInButton from "@/components/SignInButton";

export default async function SignIn() {
  const providers = await getProviders();

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <p className="text-gray-500 mt-1 text-center">
        By signing in, your progress will be synced with your accounts. This
        means that you can resume your progress from anywhere.
      </p>
      <div className="flex flex-col items-center justify-center mt-2">
        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name} className="mb-2">
              <SignInButton
                providerId={provider.id}
                providerName={provider.name}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
