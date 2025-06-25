"use client";

import {
  Sparkles,
  CheckCircle,
  ArrowRight,
  Award,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Play,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { siteConfig } from "@/lib/config";
import {
  EMAIL_ADDRESS,
  PHONE_NUMBER,
  CONTACT_FORM,
  FB_PAGE_URL,
  BPXAI_WEBSITE,
} from "@/constants";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                negosyo.ai
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Features
              </a>

              <a
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  Sign up for free!
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-full mb-8">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">🚀 Be Among the First to Try!</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            The Future of Pinoy Business Planning
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              {" "}
              is Here
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revolutionary AI-powered platform that matches your capital with
            perfect business opportunities. Get personalized recommendations,
            complete scaling roadmaps, and 24/7 AI coaching (Soon!) - all
            designed specifically for Filipino entrepreneurs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-lg px-8 py-4"
              >
                Get me my FREE business idea
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            {/* <Button
              size="lg"
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 text-lg px-8 py-4"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Live Demo
            </Button> */}
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>100% Free Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Instant Access. Login with Google now.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access Benefits */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              🎉 Early Access Benefits
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Be among the first aspiring entrepreneurs to experience the future
              of AI-powered business planning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Lifetime Free Access</h3>
              <p className="text-blue-100">
                Early users get permanent free access to all premium features
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Exclusive Community</h3>
              <p className="text-blue-100">
                Join our founding members community with direct access to
                creators
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Shape the Platform</h3>
              <p className="text-blue-100">
                Your feedback directly influences new features and improvements
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Priority Support</h3>
              <p className="text-blue-100">
                Get direct support from our team and priority feature requests
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How negosyo.ai Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our revolutionary AI analyzes your unique situation to find
              perfect business matches
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                1. Share Your Capital
              </h3>
              <p className="text-gray-600">
                Tell us your available capital and we'll show you exactly what's
                possible within your budget.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                2. AI Analyzes Your Profile
              </h3>
              <p className="text-gray-600">
                Our AI considers your experience, location, age, and interests
                for personalized matching.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                3. Get Perfect Matches
              </h3>
              <p className="text-gray-600">
                Receive 3-5 tailored business recommendations with complete
                analysis and projections.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                4. Scale with AI Coach
              </h3>
              <p className="text-gray-600">
                Follow step-by-step scaling roadmaps with 24/7 AI coaching
                support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      {/* <section id="demo" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See negosyo.ai in Action
            </h2>
            <p className="text-xl text-gray-600">
              Watch how our AI finds perfect business matches in under 60
              seconds
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Interactive Demo
                </h3>
                <p className="text-gray-600 mb-4">
                  See how ₱50,000 capital becomes a thriving business
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  Play Demo Video
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section> */}

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Revolutionary Features Built for Filipino Entrepreneurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology meets deep understanding of the Philippine
              business landscape
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteConfig.features.map((feature, index) => (
              <Card
                key={index}
                className="shadow-lg border-0 bg-teal-100 backdrop-blur-sm hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose negosyo.ai?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built by Filipino entrepreneurs, for Filipino entrepreneurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  100% Free Forever
                </h3>
                <p className="text-gray-600">
                  No hidden fees, no premium tiers. Our mission is to
                  democratize business planning for all Filipino entrepreneurs.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Cutting-Edge AI
                </h3>
                <p className="text-gray-600">
                  Powered by advanced AI models specifically trained on
                  Philippine business data and market conditions.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Instant Results
                </h3>
                <p className="text-gray-600">
                  Get comprehensive business recommendations and scaling
                  roadmaps in under 60 seconds.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Beta Tester Program */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🚀 Join Our Beta Tester Program
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Help us build the perfect platform for Filipino entrepreneurs. Get
            exclusive access, direct input on features, and lifetime benefits.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold text-white mb-2">
                🎯 Test New Features First
              </h3>
              <p className="text-purple-100 text-sm">
                Get early access to new AI models and features before public
                release
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold text-white mb-2">
                💬 Direct Feedback Channel
              </h3>
              <p className="text-purple-100 text-sm">
                Your suggestions directly influence platform development
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold text-white mb-2">
                🏆 Exclusive Recognition
              </h3>
              <p className="text-purple-100 text-sm">
                Be recognized as a founding member of the negosyo.ai community
              </p>
            </div>
          </div>

          <Link href="/auth">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4"
            >
              Access the platform - Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">negosyo.ai</span>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 text-xs"
                >
                  BETA
                </Badge>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The revolutionary AI-powered business matching platform designed
                specifically for Filipino entrepreneurs. Join our beta program
                and help shape the future of business planning.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  <strong className="text-white">Built by:</strong> BPxAI -
                  Making AI Accessible for All
                </p>
                <p className="text-sm text-gray-400">
                  <strong className="text-white">Email:</strong> {EMAIL_ADDRESS}
                </p>
                <p className="text-sm text-gray-400">
                  <strong className="text-white">Phone:</strong> {PHONE_NUMBER}
                </p>
                <p className="text-sm text-gray-400">
                  <strong className="text-white">Address:</strong> San Juan
                  City, Metro Manila, Philippines 1500
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>

                <li>
                  <Link
                    href="/beta"
                    className="hover:text-white transition-colors"
                  >
                    Beta Program
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href={`${BPXAI_WEBSITE}`}
                    className="hover:text-white transition-colors"
                  >
                    BPxAI
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${CONTACT_FORM}`}
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${CONTACT_FORM}`}
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${CONTACT_FORM}`}
                    className="hover:text-white transition-colors"
                  >
                    Send Feedback
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${FB_PAGE_URL}`}
                    className="hover:text-white transition-colors"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 negosyo.ai by{" "}
                <a
                  href={BPXAI_WEBSITE}
                  className="hover:text-white transition-colors"
                >
                  BPxAI
                </a>
                . All rights reserved. Empowering Filipino Entrepreneurs with
                AI.
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <Link
                  href="https://bpxai.com"
                  className="hover:text-white transition-colors"
                >
                  BPxAI
                </Link>
                <Link href="/" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="/" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
