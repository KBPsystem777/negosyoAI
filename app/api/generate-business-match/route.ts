import { type NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

function cleanJson(raw: string) {
  let txt = raw.trim();
  txt = txt
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return txt;
}

export async function POST(request: NextRequest) {
  try {
    const { capital, experience, location, age, interests, goals } =
      await request.json();

    const prompt = `
    You are an expert business consultant and AI coach specializing in capital-based business matching for Filipino entrepreneurs. Based on the user's profile, recommend 3 perfect business matches with complete scaling roadmaps and coaching materials.

    User Profile:
    - Available Capital: PHP ${capital}
    - Experience Level: ${experience}
    - Location: ${location}
    - Age: ${age}
    - Business Interests: ${interests}
    - Primary Goal: ${goals}

    Generate a comprehensive business matching report in JSON format with the following structure:

    {
      "userProfile": {
        "capital": ${capital},
        "experience": "${experience}",
        "location": "${location}",
        "age": "${age}",
        "interests": ["${interests}"],
        "goals": "${goals}"
      },
      "recommendations": [
        {
          "businessName": "Catchy business name",
          "businessType": "Type of business",
          "description": "Detailed description of the business and why it's perfect for this capital range. Make it realistic and achievable.",
          "whyRecommended": ["Array of 4-5 specific reasons why this business matches the user's profile"],
          "capitalBreakdown": {
            "equipment": amount_number,
            "inventory": amount_number,
            "marketing": amount_number,
            "workingCapital": amount_number,
            "contingency": amount_number
          },
          "projectedReturns": {
            "monthlyRevenue": estimated_monthly_revenue,
            "monthlyExpenses": estimated_monthly_expenses,
            "monthlyProfit": calculated_monthly_profit,
            "breakEvenMonth": break_even_month_number,
            "roi": roi_percentage
          },
          "scalingRoadmap": [
            {
              "phase": "Phase name (e.g., Launch Phase, Growth Phase, Expansion Phase)",
              "timeline": "Timeline (e.g., Month 1-3, Month 4-8, etc.)",
              "goals": ["Array of 3-4 specific goals for this phase"],
              "investments": ["Array of 3-4 investment areas for this phase"],
              "expectedRevenue": expected_monthly_revenue_for_phase
            }
          ],
          "coachingMaterials": [
            {
              "category": "Category name (e.g., Getting Started, Marketing, Operations, Scaling)",
              "materials": ["Array of 4-5 specific coaching materials, guides, or resources. Make it realistic and descriptive."]
            }
          ],
          "investmentAreas": [
            {
              "area": "Investment area name",
              "allocation": amount_to_allocate,
              "reasoning": "Why this allocation is recommended",
              "priority": "High/Medium/Low"
            }
          ],
          "riskFactors": ["Array of 3-4 potential risks and challenges"],
          "successTips": ["Array of 5-6 specific success tips for this business"]
        }
      ],
      "overallStrategy": "Overall strategic recommendation based on the user's profile and capital",
      "nextSteps": ["Array of 5-7 immediate next steps the user should take"]
    }

    Requirements:
    - Recommend businesses that are realistic for the given capital amount
    - Consider the user's experience level (beginners get simpler businesses)
    - Factor in location-specific opportunities and challenges
    - Age-appropriate business recommendations
    - Align with stated interests and goals
    - Provide detailed capital allocation that adds up to the available capital
    - Include 3-4 scaling phases with specific timelines and revenue projections
    - Provide comprehensive coaching materials for each business type
    - Suggest specific investment areas with reasoning
    - Include realistic financial projections based on Philippine market conditions
    - All amounts should be in Philippine Peso
    - Focus on businesses suitable for Filipino market and culture
    - Provide actionable, step-by-step guidance
    - Include both opportunities and risks
    - Make examples relatable to Filipino entrepreneurs
    - Include specific peso amounts based on current Philippine market rates
    - Add success stories or examples of similar businesses in the Philippines

    Return ONLY the raw JSON object – no markdown, no triple-backticks, no additional text.
    `;

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 4000,
    });

    const businessMatch = JSON.parse(cleanJson(text));
    return NextResponse.json(businessMatch);
  } catch (error) {
    console.error("Error generating business match:", error);
    return NextResponse.json(
      { error: "Failed to generate business recommendations" },
      { status: 500 }
    );
  }
}
