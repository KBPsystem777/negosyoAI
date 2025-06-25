import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  BookOpen,
} from "lucide-react";

export const siteConfig = {
  header: {
    title: "negosyo.ai - AI Business Matching Platform 🇵🇭",
    subtitle:
      "Revolutionary AI-powered platform that matches your capital with perfect business opportunities.",
  },
  hero: {
    title: "The Future of Business Planning is Here",
    description:
      "Revolutionary AI-powered platform that matches your capital with perfect business opportunities. Get personalized recommendations, complete scaling roadmaps, and 24/7 AI coaching - all designed specifically for Filipino entrepreneurs.",
  },
  features: [
    {
      icon: DollarSign,
      title: "Capital-Based Matching",
      description:
        "Get business recommendations perfectly matched to your available capital and budget constraints.",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      benefits: [
        "Optimal capital allocation strategies",
        "ROI-focused business suggestions",
        "Budget breakdown and planning",
        "Investment area recommendations",
      ],
    },
    {
      icon: Target,
      title: "Profile-Based Recommendations",
      description:
        "AI analyzes your experience, location, age, and interests for personalized business matching.",
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
      benefits: [
        "Experience-level appropriate businesses",
        "Location-specific opportunities",
        "Age and lifestyle considerations",
        "Interest and passion alignment",
      ],
    },
    {
      icon: BarChart3,
      title: "Market Intelligence",
      description:
        "Comprehensive market analysis and competitor insights for your recommended businesses.",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      benefits: [
        "Local market size analysis",
        "Competitor landscape mapping",
        "Demand and supply insights",
        "Growth potential assessment",
      ],
    },
    {
      icon: TrendingUp,
      title: "Scaling Roadmaps",
      description:
        "Step-by-step scaling strategies from startup to established business with milestone tracking.",
      color: "bg-gradient-to-r from-orange-500 to-red-500",
      benefits: [
        "Month-by-month scaling plans",
        "Revenue growth strategies",
        "Expansion timing guidance",
        "Milestone achievement tracking",
      ],
    },
    {
      icon: BookOpen,
      title: "AI Business Coaching",
      description:
        "24/7 AI coach providing personalized guidance, tips, and solutions for your business journey.",
      color: "bg-gradient-to-r from-blue-600 to-blue-500",
      benefits: [
        "Personalized coaching sessions",
        "Problem-solving assistance",
        "Best practice recommendations",
        "Continuous learning materials",
      ],
    },
    {
      icon: Users,
      title: "Investment Area Suggestions",
      description:
        "Smart recommendations on where to allocate your capital for maximum impact and returns.",
      color: "bg-gradient-to-r from-orange-500 to-orange-500",
      benefits: [
        "Equipment vs inventory allocation",
        "Marketing budget optimization",
        "Technology investment priorities",
        "Working capital management",
      ],
    },
  ],
  form: {
    title: "Tell Us About You",
    fields: {
      capital: "Available Capital (PHP) *",
      experience: "Business Experience Level *",
      location: "Your Location or Province *",
      age: "Age Range *",
      interests: "Business Field / Interest *",
      goals: "Primary Goal *",
    },
    experienceLevels: [
      "Complete Beginner (Baguhang negosyante)",
      "Some Experience (Tumulong sa negosyo ng pamilya)",
      "Experienced (Nakapagpatakbo ng negosyo dati)",
      "Expert (Maraming matagumpay na negosyo)",
    ],
    ageRanges: [
      "18-25 taong gulang",
      "26-35 taong gulang",
      "36-45 taong gulang",
      "46-55 taong gulang",
      "56+ taong gulang",
    ],
    businessInterests: [
      "Food & Beverage",
      "Retail & Trading",
      "Services",
      "Technology",
      "Manufacturing",
      "Agriculture",
      "Transportation",
      "Real Estate",
      "Healthcare",
      "Education",
      "Entertainment",
      "Others",
    ],
    goals: [
      "Magkaroon ng Extra Income (Side business)",
      "Replace Full-time Job Income",
      "Build Scalable Business",
      "Serve My Community",
      "Financial Independence",
      "Leave Legacy for Family",
    ],
    generateButton: "Find My Perfect Business Match",
  },
  results: {
    title: "Your AI-Powered Business Matches",
    placeholder: {
      title: "Ready to Find Your Perfect Business?",
      description:
        "Share your capital and profile above to get personalized business recommendations with complete scaling roadmaps and coaching materials.",
    },
  },
  footer: {
    text: "Powered by OpenAI | Built by BPxAI | Empowering Filipino Entrepreneurs",
  },
};
