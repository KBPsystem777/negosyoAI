"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Plus,
  FileText,
  Calendar,
  Download,
  Edit,
  Trash2,
  LogOut,
  User,
  BarChart3,
} from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { createClient } from "@/lib/supabase/client";
import { trackingService } from "@/lib/tracking";

import { FB_PAGE_URL, CONTACT_FORM } from "@/constants";

export default function Dashboard() {
  const [user, setUser] = useState<{} | null>(null);
  const [businessPlans, setBusinessPlans] = useState([]);
  const [userStats, setUserStats] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      setUser(user);
      // Track user activity

      await trackUserActivity(user.id, "dashboard_visit");

      // Load user's business plans and statistics
      await Promise.all([loadBusinessPlans(user.id), loadUserStats(user.id)]);

      // Load user's business plans
      await loadBusinessPlans(user.id);
      setIsLoading(false);
    };

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
        await trackUserActivity(session.user.id, "dashboard_visit");
        await loadBusinessPlans(session.user.id);
        setIsLoading(false);
      } else if (event === "SIGNED_OUT") {
        setIsLoading(false);
        setUser(null);
        router.push("/auth");
      }
    });

    checkUser();

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  const trackUserActivity = async (userId: string, activity: string) => {
    try {
      await supabase.from("user_activities").insert({
        user_id: userId,
        activity_type: activity,
        timestamp: new Date().toISOString(),
        metadata: {
          page: "dashboard",
          user_agent: navigator.userAgent,
        },
      });
    } catch (error) {
      console.error("Error tracking activity:", error);
    }
  };

  const loadBusinessPlans = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("business_plans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBusinessPlans(data || []);
    } catch (error) {
      console.error("Error loading business plans:", error);
    }
  };

  const loadUserStats = async (userId: string) => {
    try {
      const stats = await trackingService.getUserStats(userId);
      setUserStats(stats);
    } catch (error) {
      console.error("Error loading user stats:", error);
    }
  };

  const handleDownload = async (businessPlan: any, reportType: string) => {
    try {
      // Track download before initiating
      await trackingService.trackDownload({
        userId: user.id,
        businessPlanId: businessPlan.id,
        downloadType: "txt", // You can make this dynamic
      });

      // Proceed with download
      const response = await fetch("/api/download-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessPlan: businessPlan.recommendations?.[0] || businessPlan,
          reportType,
          businessPlanId: businessPlan.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to download report");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}-${businessPlan.business_name}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Refresh stats after download
      await loadUserStats(user.id);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    }
  };

  const signOut = async () => {
    await trackUserActivity(user?.id, "sign_out");
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                negosyo.ai
              </span>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 text-xs"
              >
                BETA
              </Badge>
            </Link>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{user.email}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to negosyo.ai! 🎉
          </h1>
          <p className="text-gray-600">
            You're now part of our exclusive beta program. Start by creating
            your first AI-powered business plan.
          </p>
        </div>

        {/* Quick Start Card */}
        <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">
                  Ready to Find Your Perfect Business?
                </h2>
                <p className="text-blue-100 mb-4">
                  Tell us your capital and profile, and our AI will recommend
                  the perfect business opportunities for you.
                </p>
                <div className="flex items-center gap-4 text-sm text-blue-100">
                  <span>✨ AI-Powered Matching</span>
                  <span>📊 Complete Analysis</span>
                  <span>🚀 Scaling Roadmaps</span>
                </div>
              </div>
              <Link href="/planner">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Plan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Business Plans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userStats?.total_plans_generated || businessPlans.length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Generations
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {userStats?.total_generations || 0}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Downloads</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {userStats?.total_downloads || 0}
                  </p>
                </div>
                <Download className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="text-sm font-bold text-gray-900">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "Today"}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Plans List */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Your Business Plans
              </div>
              <Link href="/planner">
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Plan
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {businessPlans.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Business Plans Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first AI-powered business plan to get personalized
                  recommendations and scaling roadmaps.
                </p>
                <Link href="/planner">
                  <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Plan
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {businessPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {plan.business_name}
                          </h3>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {plan.status || "Completed"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>Type: {plan.business_type}</span>
                          <span>
                            Capital: ₱{plan.capital?.toLocaleString()}
                          </span>
                          <span>
                            Created:{" "}
                            {new Date(plan.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Statistics Card */}
        {userStats && (
          <Card className="mt-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Your Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {userStats.total_plans_generated || 0}
                  </p>
                  <p className="text-sm text-gray-600">Plans Generated</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {userStats.total_generations || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Generations</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {userStats.total_downloads || 0}
                  </p>
                  <p className="text-sm text-gray-600">Downloads</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {userStats.last_generation_at
                      ? new Date(
                          userStats.last_generation_at
                        ).toLocaleDateString()
                      : "Never"}
                  </p>
                  <p className="text-sm text-gray-600">Last Generation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Beta Feedback Card */}
        <Card className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-0">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">🚀 Help Us Improve!</h3>
            <p className="text-purple-100 mb-4">
              As a beta tester, your feedback is invaluable. Share your thoughts
              and help us build the perfect platform for Filipino entrepreneurs.
            </p>
            <div className="flex gap-3">
              <Button
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => {
                  window.open(CONTACT_FORM, "_blank");
                }}
              >
                Send Feedback
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-black hover:bg-white/10"
                onClick={() => window.open(FB_PAGE_URL, "_blank")}
              >
                Join Community
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
