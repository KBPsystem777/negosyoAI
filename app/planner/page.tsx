"use client";

import { useState } from "react";
import {
  Loader2,
  Sparkles,
  Target,
  BookOpen,
  ArrowLeft,
  Award,
  Users,
  Lightbulb,
  CheckCircle,
  Download,
} from "lucide-react";

import Link from "next/link";

import { useGAEvents } from "@/hooks/useGAEvents";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { provinces } from "@/lib/provinces/PhProvinces";

import { siteConfig } from "@/lib/config";

interface BusinessRecommendation {
  businessName: string;
  businessType: string;
  description: string;
  whyRecommended: string[];
  capitalBreakdown: {
    equipment: number;
    inventory: number;
    marketing: number;
    workingCapital: number;
    contingency: number;
  };
  projectedReturns: {
    monthlyRevenue: number;
    monthlyExpenses: number;
    monthlyProfit: number;
    breakEvenMonth: number;
    roi: number;
  };
  scalingRoadmap: {
    phase: string;
    timeline: string;
    goals: string[];
    investments: string[];
    expectedRevenue: number;
  }[];
  coachingMaterials: {
    category: string;
    materials: string[];
  }[];
  investmentAreas: {
    area: string;
    allocation: number;
    reasoning: string;
    priority: "High" | "Medium" | "Low";
  }[];
  riskFactors: string[];
  successTips: string[];
}

interface BusinessMatchResult {
  userProfile: {
    capital: number;
    experience: string;
    location: string;
    age: string;
    interests: string[];
    goals: string;
  };
  recommendations: BusinessRecommendation[];
  overallStrategy: string;
  nextSteps: string[];
}

export default function PlannerPage() {
  const [formData, setFormData] = useState({
    capital: "",
    experience: "",
    location: "",
    age: "",
    interests: "",
    goals: "",
  });
  const [businessMatch, setBusinessMatch] =
    useState<BusinessMatchResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const {
    trackGenerateIdeaClick,
    trackIdeaGenerated,
    trackPlanDownload,
    trackPageScrolledToBottom,
  } = useGAEvents();

  const sortedProvinces = provinces.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateBusinessMatch = async () => {
    const analyticsData = {
      capital: formData.capital,
      experience: formData.experience,
      location: formData.location,
      age: formData.age,
      interests: formData.interests,
      goals: formData.goals,
    };

    // Record the generate idea click event
    trackGenerateIdeaClick(analyticsData);

    if (!formData.capital || !formData.experience || !formData.location) {
      alert("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-business-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to generate business match");

      const match = await response.json();
      setBusinessMatch(match);
      setActiveTab("overview");

      // Record the idea generated event
      trackIdeaGenerated(match);
    } catch (error) {
      console.error("Error generating business match:", error);
      alert("Failed to generate business recommendations. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async (reportType: string) => {
    if (!businessMatch) {
      alert("No business plan data available for download");
      return;
    }

    try {
      // Convert business match data to the format expected by the download-report API
      const businessPlanData = {
        selectedBusinessName:
          businessMatch.recommendations[0]?.businessName || "Business Plan",
        tagline: `AI-Generated Business Plan for ${businessMatch.userProfile.capital.toLocaleString()} Capital`,
        description: businessMatch.overallStrategy,
        suggestedNames: businessMatch.recommendations.map(
          (rec) => rec.businessName
        ),
        marketResearch: {
          marketSize: "Analyzed based on your location and capital",
          targetMarket:
            businessMatch.recommendations[0]?.scalingRoadmap[0]?.goals || [],
          marketTrends: businessMatch.recommendations[0]?.successTips || [],
          opportunities: businessMatch.nextSteps,
        },
        competitorAnalysis: {
          directCompetitors: businessMatch.recommendations.map((rec) => ({
            name: rec.businessType,
            strengths: rec.successTips.slice(0, 3),
            weaknesses: rec.riskFactors.slice(0, 3),
            pricing: `₱${rec.projectedReturns.monthlyRevenue.toLocaleString()}/month`,
          })),
          competitiveAdvantages:
            businessMatch.recommendations[0]?.successTips || [],
          marketPositioning: businessMatch.overallStrategy,
        },
        dailyOperations: businessMatch.nextSteps,
        financialProjections: {
          startupCosts: Object.entries(
            businessMatch.recommendations[0]?.capitalBreakdown || {}
          ).map(([item, cost]) => ({
            item,
            cost: cost as number,
            category: "Startup",
          })),
          monthlyExpenses:
            businessMatch.recommendations[0]?.investmentAreas.map((area) => ({
              item: area.area,
              cost: area.allocation,
              category: area.priority,
            })) || [],
          revenueProjections:
            businessMatch.recommendations[0]?.scalingRoadmap.map(
              (phase, index) => ({
                month: index + 1,
                revenue: phase.expectedRevenue,
                expenses: Math.round(phase.expectedRevenue * 0.7),
                profit: Math.round(phase.expectedRevenue * 0.3),
              })
            ) || [],
          breakEvenAnalysis: {
            breakEvenMonth:
              businessMatch.recommendations[0]?.projectedReturns
                .breakEvenMonth || 6,
            breakEvenRevenue:
              businessMatch.recommendations[0]?.projectedReturns
                .monthlyRevenue || 0,
            roi: businessMatch.recommendations[0]?.projectedReturns.roi || 0,
          },
        },
        marketingPlan: {
          brandingStrategy:
            businessMatch.recommendations[0]?.coachingMaterials.find((c) =>
              c.category.includes("Brand")
            )?.materials || [],
          digitalMarketing:
            businessMatch.recommendations[0]?.coachingMaterials.find((c) =>
              c.category.includes("Digital")
            )?.materials || [],
          traditionalMarketing:
            businessMatch.recommendations[0]?.coachingMaterials.find((c) =>
              c.category.includes("Marketing")
            )?.materials || [],
          socialMediaStrategy:
            businessMatch.recommendations[0]?.coachingMaterials.find((c) =>
              c.category.includes("Social")
            )?.materials || [],
          contentIdeas: businessMatch.recommendations[0]?.successTips || [],
        },
        customerAcquisition: {
          targetCustomers: [
            {
              segment: businessMatch.userProfile.interests.join(", "),
              demographics: `${businessMatch.userProfile.age}, ${businessMatch.userProfile.location}`,
              needs: businessMatch.recommendations[0]?.whyRecommended || [],
              acquisitionStrategy: businessMatch.nextSteps,
            },
          ],
          salesFunnel: businessMatch.nextSteps,
          retentionStrategies:
            businessMatch.recommendations[0]?.successTips || [],
        },
        manpowerPlan: {
          roles:
            businessMatch.recommendations[0]?.investmentAreas
              .filter(
                (area) =>
                  area.area.toLowerCase().includes("staff") ||
                  area.area.toLowerCase().includes("employee")
              )
              .map((area) => ({
                position: area.area,
                salary: area.allocation,
                when: "Month 1",
                responsibilities: [area.reasoning],
              })) || [],
          totalMonthlySalaries:
            businessMatch.recommendations[0]?.investmentAreas.reduce(
              (sum, area) =>
                area.area.toLowerCase().includes("staff") ||
                area.area.toLowerCase().includes("employee")
                  ? sum + area.allocation
                  : sum,
              0
            ) || 0,
        },
        educationalResources: {
          businessTips: businessMatch.recommendations[0]?.successTips || [],
          governmentPrograms: [
            "DTI Business Registration",
            "SSS Registration",
            "BIR Registration",
          ],
          fundingSources: [
            "Personal Savings",
            "Bank Loans",
            "Government Grants",
            "Angel Investors",
          ],
        },
      };

      const response = await fetch("/api/download-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessPlan: businessPlanData,
          reportType: reportType,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate report");

      // Create a blob from the response and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType.replace("-", "_")}_report.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      trackPlanDownload({ dateDownloaded: new Date().toISOString() });
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                negosyo.ai
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Early User Plan
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI Business Matcher
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tell us your capital and profile, and we'll find the perfect
            business opportunities with complete scaling roadmaps and coaching
            materials.
          </p>
        </div>

        {/* Business Matching Form */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold text-center">
              {siteConfig.form.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="capital"
                  className="text-sm font-semibold text-gray-700"
                >
                  {siteConfig.form.fields.capital}
                </Label>
                <Input
                  id="capital"
                  placeholder="e.g., 1,000"
                  type="number"
                  value={formData.capital}
                  onChange={(e) => handleInputChange("capital", e.target.value)}
                  className="border-gray-300 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500">
                  Enter your total available capital in Philippine Peso
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="experience"
                  className="text-sm font-semibold text-gray-700"
                >
                  {siteConfig.form.fields.experience}
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("experience", value)
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteConfig.form.experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm font-semibold text-gray-700"
                >
                  {siteConfig.form.fields.location}
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("location", value)
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select your province" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedProvinces.map((province) => (
                      <SelectItem key={province.key} value={province.name}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="age"
                  className="text-sm font-semibold text-gray-700"
                >
                  {siteConfig.form.fields.age}
                </Label>
                <Select
                  onValueChange={(value) => handleInputChange("age", value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select your age range" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteConfig.form.ageRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="interests"
                  className="text-sm font-semibold text-gray-700"
                >
                  {siteConfig.form.fields.interests}
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("interests", value)
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select your business interests" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteConfig.form.businessInterests.map((interest) => (
                      <SelectItem key={interest} value={interest}>
                        {interest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="goals"
                  className="text-sm font-semibold text-gray-700"
                >
                  {siteConfig.form.fields.goals}
                </Label>
                <Select
                  onValueChange={(value) => handleInputChange("goals", value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select your primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteConfig.form.goals.map((goal) => (
                      <SelectItem key={goal} value={goal}>
                        {goal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={generateBusinessMatch}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Finding Your Perfect Business Matches...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {siteConfig.form.generateButton}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Business Match Results */}
        {businessMatch ? (
          <div className="space-y-6">
            {/* User Profile Summary */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Your Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Capital</p>
                    <p className="font-bold text-lg text-green-600">
                      ₱{businessMatch.userProfile.capital.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium">
                      {businessMatch.userProfile.experience}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">
                      {businessMatch.userProfile.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-medium">
                      {businessMatch.userProfile.age}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Interests</p>
                    <p className="font-medium">
                      {businessMatch.userProfile.interests.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Goal</p>
                    <p className="font-medium">
                      {businessMatch.userProfile.goals}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Recommendations */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Your Perfect Business Matches
              </h2>

              {businessMatch.recommendations.map((recommendation, index) => (
                <Card
                  key={index}
                  className="shadow-lg border-0 bg-white/80 backdrop-blur-sm"
                >
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        {recommendation.businessName}
                      </div>
                      <Badge className="bg-white/20 text-white">
                        Match #{index + 1}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="capital">Capital</TabsTrigger>
                        <TabsTrigger value="scaling">Scaling</TabsTrigger>
                        <TabsTrigger value="coaching">Coaching</TabsTrigger>
                        <TabsTrigger value="investment">Investment</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 mb-2">
                            {recommendation.businessType}
                          </h4>
                          <p className="text-gray-700 mb-4">
                            {recommendation.description}
                          </p>

                          <h5 className="font-semibold text-gray-900 mb-2">
                            Why This Business is Perfect for You:
                          </h5>
                          <ul className="space-y-1">
                            {recommendation.whyRecommended.map((reason, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">
                              Monthly Revenue
                            </p>
                            <p className="font-bold text-lg text-green-600">
                              ₱
                              {recommendation.projectedReturns.monthlyRevenue.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">
                              Monthly Profit
                            </p>
                            <p className="font-bold text-lg text-blue-600">
                              ₱
                              {recommendation.projectedReturns.monthlyProfit.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Break-even</p>
                            <p className="font-bold text-lg text-purple-600">
                              {recommendation.projectedReturns.breakEvenMonth}{" "}
                              months
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">
                              ROI (Potential)
                            </p>
                            <p className="font-bold text-lg text-orange-600">
                              {recommendation.projectedReturns.roi}%
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="capital" className="space-y-4">
                        <h4 className="font-bold text-lg text-gray-900">
                          Capital Allocation Breakdown
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(recommendation.capitalBreakdown).map(
                            ([category, amount]) => (
                              <div
                                key={category}
                                className="flex justify-between items-center py-2 border-b border-gray-100"
                              >
                                <span className="font-medium text-gray-900 capitalize">
                                  {category.replace(/([A-Z])/g, " $1")}
                                </span>
                                <span className="font-bold text-green-600">
                                  ₱{amount.toLocaleString()}
                                </span>
                              </div>
                            )
                          )}
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-green-900">
                                Total Capital Required:
                              </span>
                              <span className="font-bold text-green-900 text-lg">
                                ₱
                                {Object.values(recommendation.capitalBreakdown)
                                  .reduce((sum, amount) => sum + amount, 0)
                                  .toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="scaling" className="space-y-4">
                        <h4 className="font-bold text-lg text-gray-900">
                          Scaling Roadmap
                        </h4>
                        <div className="space-y-4">
                          {recommendation.scalingRoadmap.map((phase, i) => (
                            <div
                              key={i}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h5 className="font-bold text-gray-900">
                                  {phase.phase}
                                </h5>
                                <Badge variant="outline">
                                  {phase.timeline}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <h6 className="font-semibold text-blue-700 mb-2">
                                    Goals
                                  </h6>
                                  <ul className="text-sm space-y-1">
                                    {phase.goals.map((goal, j) => (
                                      <li key={j} className="text-gray-600">
                                        • {goal}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-semibold text-green-700 mb-2">
                                    Investments
                                  </h6>
                                  <ul className="text-sm space-y-1">
                                    {phase.investments.map((investment, j) => (
                                      <li key={j} className="text-gray-600">
                                        • {investment}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="font-semibold text-purple-700 mb-2">
                                    Expected Revenue
                                  </h6>
                                  <p className="text-lg font-bold text-purple-600">
                                    ₱{phase.expectedRevenue.toLocaleString()}
                                    /month
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="coaching" className="space-y-4">
                        <h4 className="font-bold text-lg text-gray-900">
                          AI Coaching Materials
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {recommendation.coachingMaterials.map(
                            (category, i) => (
                              <div key={i}>
                                <h5 className="font-semibold text-gray-900 mb-3">
                                  {category.category}
                                </h5>
                                <ul className="space-y-2">
                                  {category.materials.map((material, j) => (
                                    <li
                                      key={j}
                                      className="flex items-start gap-2"
                                    >
                                      <BookOpen className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                                      <span className="text-gray-700 text-sm">
                                        {material}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          )}
                        </div>

                        <Separator />

                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3">
                            Success Tips
                          </h5>
                          <ul className="space-y-2">
                            {recommendation.successTips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="investment" className="space-y-4">
                        <h4 className="font-bold text-lg text-gray-900">
                          Investment Area Recommendations
                        </h4>
                        <div className="space-y-4">
                          {recommendation.investmentAreas.map((area, i) => (
                            <div
                              key={i}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-bold text-gray-900">
                                  {area.area}
                                </h5>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={
                                      area.priority === "High"
                                        ? "border-red-200 text-red-700"
                                        : area.priority === "Medium"
                                        ? "border-yellow-200 text-yellow-700"
                                        : "border-green-200 text-green-700"
                                    }
                                  >
                                    {area.priority} Priority
                                  </Badge>
                                  <span className="font-bold text-blue-600">
                                    ₱{area.allocation.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-700 text-sm">
                                {area.reasoning}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-red-900 mb-2">
                            Risk Factors to Consider
                          </h5>
                          <ul className="space-y-1">
                            {recommendation.riskFactors.map((risk, i) => (
                              <li key={i} className="text-red-700 text-sm">
                                • {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Overall Strategy */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Overall Strategy & Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">
                      Recommended Strategy
                    </h4>
                    <p className="text-gray-700">
                      {businessMatch.overallStrategy}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-3">
                      Your Next Steps
                    </h4>
                    <div className="space-y-2">
                      {businessMatch.nextSteps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => handleDownloadReport("business-plan")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Complete Report
              </Button>
              {/* <Button
                disabled
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Start AI Coaching (Coming Soon!)
              </Button> */}
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        ) : (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to Find Your Perfect Business?
              </h4>
              <p className="text-gray-600">
                Share your capital and profile above to get personalized
                business recommendations with complete scaling roadmaps.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
