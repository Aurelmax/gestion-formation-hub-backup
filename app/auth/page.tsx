"use client";

import { SignIn } from '@clerk/nextjs';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <SignIn
          routing="hash"
          signUpUrl="/auth/sign-up"
        />
      </div>
    </div>
  );
}