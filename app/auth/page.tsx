"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Users, Award, Target, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check for error in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "callback_error":
          setError(
            "There was an error completing your sign-in. Please try again."
          );
          break;
        case "unexpected_error":
          setError("An unexpected error occurred. Please try again.");
          break;
        default:
          setError("An error occurred during sign-in.");
      }
    }

    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Don't auto-redirect here, let the callback handle it
      }
    };
    checkUser();
  }, [supabase.auth]);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("Error signing in:", error);
        alert("Error signing in with Google. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">negosyo.ai</span>
          </Link>
          <p className="text-gray-600 mt-2">
            Join the future of AI-powered business planning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sign In Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Get Started for Free
              </CardTitle>
              <p className="text-gray-600">
                Sign in with Google to access your personalized business
                recommendations
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              <Button
                onClick={signInWithGoogle}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm text-lg py-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Signing you in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-gray-500">
                By continuing, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Privacy Policy
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Card */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-600 to-teal-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                🚀 What You'll Get
              </CardTitle>
              <p className="text-blue-100">
                Join thousands of Filipino entrepreneurs already using
                negosyo.ai
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Personalized Business Matching
                    </h3>
                    <p className="text-blue-100 text-sm">
                      AI analyzes your capital, experience, and profile to find
                      perfect business opportunities
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Complete Scaling Roadmaps
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Step-by-step plans to grow from startup to established
                      business
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      24/7 AI Business Coach
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Get instant answers, tips, and guidance whenever you need
                      it
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Exclusive Beta Access
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Be among the first to experience cutting-edge AI business
                      planning
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h4 className="font-bold mb-2">🎉 Early Access Benefits</h4>
                <ul className="text-blue-100 text-sm space-y-1">
                  <li>• Lifetime free access to all features</li>
                  <li>• Direct input on platform development</li>
                  <li>• Exclusive founding member community</li>
                  <li>• Priority support and feature requests</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          Built by BPxAI - Empowering Filipino Entrepreneurs with AI
        </div>
      </div>
    </div>
  );
}
