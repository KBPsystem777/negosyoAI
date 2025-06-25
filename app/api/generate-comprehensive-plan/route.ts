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
    const {
      businessType,
      capitalBudget,
      targetLocation,
      operatingHours,
      experience,
      goals,
    } = await request.json();

    const prompt = `
    You are an expert business consultant and mentor specializing in Filipino micro-enterprises. Generate a comprehensive, detailed business plan that will guide an entrepreneur from zero to hero.

    Business Details:
    - Business Type: ${businessType}
    - Capital Budget: PHP ${capitalBudget}
    - Target Location: ${targetLocation}
    - Operating Hours: ${operatingHours}
    - Experience Level: ${experience}
    - Primary Goal: ${goals}

    Generate a comprehensive business plan in JSON format with the following structure:

    {
      "suggestedNames": ["Array of 5 trendy, catchy, memorable business names suitable for Filipino market. Make the business names appealing and relevant to current trending topics like what the Filipino always wanted. Make the business name always referecing hollywood, K-Pop, or any other social media trending topics in the Philippines."],
      "selectedBusinessName": "The best recommended name from the suggestions",
      "tagline": "A compelling tagline for the recommended business name",
      "description": "A detailed 3-4 sentence description of the business and its unique value proposition",
      
      "marketResearch": {
        "marketSize": "Detailed analysis of the market size and potential in the Philippines",
        "targetMarket": ["Array of 4-5 specific target market segments"],
        "marketTrends": ["Array of 5-6 current market trends affecting this business type"],
        "opportunities": ["Array of 4-5 specific market opportunities to capitalize on"]
      },
      
      "competitorAnalysis": {
        "directCompetitors": [
          {
            "name": "Competitor name",
            "strengths": ["Array of 3-4 competitor strengths"],
            "weaknesses": ["Array of 3-4 competitor weaknesses"],
            "pricing": "Their pricing strategy description"
          }
        ],
        "competitiveAdvantages": ["Array of 5-6 ways this business can differentiate itself"],
        "marketPositioning": "Detailed positioning strategy description"
      },
      
      "dailyOperations": ["Array of 8-10 specific daily operational tasks"],
      
      "manpowerPlan": {
        "roles": [
          {
            "position": "Job title",
            "responsibilities": ["Array of 4-5 key responsibilities"],
            "salary": estimated_monthly_salary_number,
            "when": "When to hire (e.g., Month 1, Month 6, etc.)"
          }
        ],
        "totalMonthlySalaries": total_monthly_salary_cost_number
      },
      
      "marketingPlan": {
        "brandingStrategy": ["Array of 5-6 branding strategies which is realistic and culturally appropriate for Filipino market"],
        "digitalMarketing": ["Array of 6-7 digital realistic marketing tactics"],
        "traditionalMarketing": ["Array of 4-5 traditional marketing methods"],
        "socialMediaStrategy": ["Array of 5-6 social media strategies"],
        "contentIdeas": ["Array of 8-10 content ideas in Taglish for social media"]
      },
      
      "customerAcquisition": {
        "targetCustomers": [
          {
            "segment": "Customer segment name",
            "demographics": "Detailed demographic description",
            "needs": ["Array of 3-4 customer needs"],
            "acquisitionStrategy": ["Array of 4-5 specific acquisition tactics for this segment"]
          }
        ],
        "salesFunnel": ["Array of 6-7 sales funnel steps from awareness to purchase"],
        "retentionStrategies": ["Array of 5-6 customer retention strategies"]
      },
      
      "financialProjections": {
        "startupCosts": [
          {
            "item": "Cost item name",
            "cost": cost_amount_number,
            "category": "Equipment/Inventory/Marketing/Legal/etc."
          }
        ],
        "monthlyExpenses": [
          {
            "item": "Expense item name",
            "cost": monthly_cost_number,
            "category": "Fixed/Variable/Marketing/etc."
          }
        ],
        "revenueProjections": [
          {
            "month": month_number,
            "revenue": projected_revenue_number,
            "expenses": projected_expenses_number,
            "profit": calculated_profit_number
          }
        ],
        "breakEvenAnalysis": {
          "breakEvenMonth": calculated_break_even_month_number,
          "breakEvenRevenue": monthly_revenue_needed_number,
          "roi": expected_roi_percentage_number
        }
      },
      
      "educationalResources": {
        "businessTips": ["Array of 8-10 practical business tips for success"],
        "recommendedReading": ["Array of 5-6 books/resources for Filipino entrepreneurs"],
        "skillsToLearn": ["Array of 6-8 important skills to develop"],
        "governmentPrograms": ["Array of 4-5 Philippine government programs for small businesses"],
        "fundingSources": ["Array of 5-6 funding sources available in the Philippines"]
      }
    }

    Requirements:
    - All suggestions must be realistic for the given capital budget
    - Culturally appropriate for Filipino market and business practices
    - Include specific peso amounts based on current Philippine market rates
    - Business names should be catchy, memorable, and suitable for Filipino customers
    - Marketing content should include Taglish (mix of Tagalog and English)
    - Financial projections should be conservative but optimistic
    - Include both digital and traditional marketing approaches
    - Consider the specific location and target market in the Philippines
    - Provide actionable, step-by-step guidance
    - Include government programs and funding sources specific to the Philippines

    Return ONLY the raw JSON object – no markdown, no triple-backticks, no additional text.
    `;

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 4000,
    });

    const businessPlan = JSON.parse(cleanJson(text));
    return NextResponse.json(businessPlan);
  } catch (error) {
    console.error("Error generating comprehensive business plan:", error);
    return NextResponse.json(
      { error: "Failed to generate comprehensive business plan" },
      { status: 500 }
    );
  }
}
