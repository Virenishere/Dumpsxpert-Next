"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const authError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("Session data:", session.user);
      switch (session.user.role) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "student":
          router.push("/dashboard/student");
          break;
        default:
          router.push("/dashboard/guest");
      }
    }
  }, [session, status, router]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl,
      });
      console.log("signIn result:", result);
      if (result?.error) {
        setError(result.error);
      } else {
        alert("Check your email for the sign-in link!");
      }
    } catch (err) {
      setError("Failed to send sign-in email. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    try {
      await signIn(provider, { callbackUrl });
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
      console.error(err);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center mt-12 justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Login to DumpsXpert
        </h2>

        {(error || authError) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error ||
              (authError === "Callback"
                ? "Authentication failed. Please try again."
                : authError === "OAuthAccountNotLinked"
                ? "This email is registered with another provider. It has now been linked. Please try again."
                : authError?.includes("User validation failed")
                ? "Failed to create user account. Please try again."
                : "An error occurred. Please try again.")}
          </div>
        )}

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Email"
              />
              <HiOutlineMail className="absolute top-2.5 left-3 text-gray-400 text-lg" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {loading ? "Loading..." : "Sign in with Email"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => handleOAuthSignIn("google")}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FcGoogle className="text-xl" />
            <span className="ml-2">Google</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
