"use client";

import { signIn } from "next-auth/react";

interface SignInButtonProps {
  providerId: string;
  providerName: string;
}

const SignInButton = ({ providerId, providerName }: SignInButtonProps) => {
  console.log(providerName);
  return (
    <button
      onClick={() => signIn(providerId, { callbackUrl: "/" })}
      className="btn btn-secondary btn-sm btn-outline"
      aria-label={`Sign in with ${providerName}`}
      title={`Sign in with ${providerName}`}
    >
      Sign in with {providerName}
      {providerName === "GitHub" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="white"
          viewBox="0 0 24 24"
          stroke="none"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.87 8.14 6.84 9.46.5.09.66-.22.66-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.63.07-.62.07-.62 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.35 1.08 2.92.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.67-.1-.25-.45-1.28.1-2.67 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0112 6.8c.85.004 1.7.114 2.5.336 1.9-1.3 2.74-1.02 2.74-1.02.56 1.39.21 2.42.1 2.67.64.69 1.03 1.58 1.03 2.67 0 3.85-2.34 4.7-4.57 4.95.36.31.68.91.68 1.84v2.73c0 .27.16.58.67.48A10.003 10.003 0 0022 12c0-5.52-4.48-10-10-10z" />
        </svg>
      )}
      {providerName === "Google" && (
        <svg
          className="h-6 w-6"
          viewBox="0 0 29 30"
          fill="currentColor"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16"
            fill="#00ac47"
          />
          <path
            d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16"
            fill="#4285f4"
          />
          <path
            d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z"
            fill="#ffba00"
          />
          <polygon
            fill="#2ab2db"
            points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374"
          />
          <path
            d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z"
            fill="#ea4435"
          />
          <polygon
            fill="#2ab2db"
            points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626"
          />
          <path
            d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z"
            fill="#4285f4"
          />
        </svg>
      )}
    </button>
  );
};

export default SignInButton;
