import { type NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// ────────────────────────────────────────────────────────────────
// Helper: remove \`\`\`json ... \`\`\` fences if the model includes them
// ────────────────────────────────────────────────────────────────
function cleanJson(raw: string) {
  let txt = raw.trim();
  // remove leading & trailing triple-backtick blocks (\`\`\` or \`\`\`json)
  txt = txt
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return txt;
}

export async function POST(request: NextRequest) {
  try {
    const {
      businessName,
      businessType,
      capitalBudget,
      targetLocation,
      operatingHours,
    } = await request.json();

    const prompt = `You are an expert business consultant specializing in Filipino micro-enterprises. Generate a comprehensive business plan for the following business:

    Business Name: ${businessName}
    Business Type: ${businessType}
    Capital Budget: PHP ${capitalBudget}
    Target Location: ${targetLocation}
    Operating Hours: ${operatingHours}

    Please provide a detailed business plan in JSON format with the following structure:
    {
      "businessName": "${businessName}",
      "tagline": "A catchy tagline for the business",
      "description": "A 2-3 sentence description of the business and its value proposition",
      "dailyOperations": ["List of 5-7 specific daily operational tasks"],
      "marketingTips": ["List of 5-7 marketing tips in Taglish (mix of Tagalog and English) suitable for Filipino entrepreneurs"],
      "roiBreakdown": {
        "startupCost": estimated_startup_cost_number,
        "monthlyExpenses": estimated_monthly_expenses_number,
        "estimatedMonthlyRevenue": estimated_monthly_revenue_number,
        "breakEvenMonths": calculated_break_even_months_number
      }
    }

    Make sure the recommendations are:
    - Realistic for the given capital budget
    - Culturally appropriate for Filipino market
    - Practical and actionable
    - Include specific peso amounts based on current Philippine market rates
    - Marketing tips should be in Taglish and relatable to Filipino entrepreneurs
    - Provide a breakdown of startup costs, monthly expenses, estimated revenue, and break-even analysis
    - Make everything actionable and easy to understand for a micro-entrepreneur
    - Make everything realistic and achievable within the given budget and context and target location
    - Include specific peso amounts based on current Philippine market rates
    - Include SWOT analysis for the business
    
    Return ONLY the raw JSON object – no markdown, no triple-backticks.
    `;

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
    });

    // Clean & parse JSON safely
    const businessPlan = JSON.parse(cleanJson(text));

    return NextResponse.json(businessPlan);
  } catch (error) {
    console.error("Error generating business plan:", error);
    return NextResponse.json(
      { error: "Failed to generate business plan" },
      { status: 500 }
    );
  }
}
