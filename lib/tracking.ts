import { createClient } from "@/lib/supabase/client";

interface GenerationTrackingData {
  userId: string;
  businessPlanId?: string;
  generationType: "full_plan" | "quick_match" | "regenerate";
  inputData: any;
  aiModel?: string;
  generationTimeMs?: number;
  tokensUsed?: number;
  status: "started" | "completed" | "failed";
  errorMessage?: string;
}

interface DownloadTrackingData {
  userId: string;
  businessPlanId: string;
  downloadType: "pdf" | "docx" | "txt" | "json";
  fileSizeBytes?: number;
  downloadUrl?: string;
}

class TrackingService {
  private supabase = createClient();

  // Track business plan generation
  async trackGeneration(data: GenerationTrackingData) {
    try {
      const trackingData = {
        user_id: data.userId,
        business_plan_id: data.businessPlanId,
        generation_type: data.generationType,
        input_data: data.inputData,
        ai_model_used: data.aiModel || "gpt-4o",
        generation_time_ms: data.generationTimeMs,
        tokens_used: data.tokensUsed,
        status: data.status,
        error_message: data.errorMessage,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
        session_id: this.getSessionId(),
      };

      const { error } = await this.supabase
        .from("business_plan_generations")
        .insert(trackingData);

      if (error) {
        console.error("Error tracking generation:", error);
      }

      // Update user statistics
      await this.updateUserGenerationStats(data.userId, data.generationType);
    } catch (error) {
      console.error("Error in trackGeneration:", error);
    }
  }

  // Track business plan download
  async trackDownload(data: DownloadTrackingData) {
    try {
      const trackingData = {
        user_id: data.userId,
        business_plan_id: data.businessPlanId,
        download_type: data.downloadType,
        file_size_bytes: data.fileSizeBytes,
        download_url: data.downloadUrl,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
        session_id: this.getSessionId(),
      };

      const { error } = await this.supabase
        .from("business_plan_downloads")
        .insert(trackingData);

      if (error) {
        console.error("Error tracking download:", error);
      }

      // Update user statistics
      await this.updateUserDownloadStats(data.userId);
    } catch (error) {
      console.error("Error in trackDownload:", error);
    }
  }

  // Update user generation statistics
  private async updateUserGenerationStats(
    userId: string,
    generationType: string
  ) {
    try {
      const { data: currentStats } = await this.supabase
        .from("user_statistics")
        .select("*")
        .eq("user_id", userId)
        .single();

      const updates: any = {
        total_generations: (currentStats?.total_generations || 0) + 1,
        last_generation_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Increment total plans if it's a new plan (not regeneration)
      if (generationType === "full_plan") {
        updates.total_plans_generated =
          (currentStats?.total_plans_generated || 0) + 1;
      }

      await this.supabase
        .from("user_statistics")
        .upsert({ user_id: userId, ...updates });
    } catch (error) {
      console.error("Error updating user generation stats:", error);
    }
  }

  // Update user download statistics
  private async updateUserDownloadStats(userId: string) {
    try {
      const { data: currentStats } = await this.supabase
        .from("user_statistics")
        .select("*")
        .eq("user_id", userId)
        .single();

      const updates = {
        total_downloads: (currentStats?.total_downloads || 0) + 1,
        last_download_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await this.supabase
        .from("user_statistics")
        .upsert({ user_id: userId, ...updates });
    } catch (error) {
      console.error("Error updating user download stats:", error);
    }
  }

  // Get user statistics
  async getUserStats(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from("user_statistics")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Error fetching user stats:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getUserStats:", error);
      return null;
    }
  }

  // Get user's generation history
  async getUserGenerations(userId: string, limit = 10) {
    try {
      const { data, error } = await this.supabase
        .from("business_plan_generations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching user generations:", error);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Error in getUserGenerations:", error);
      return [];
    }
  }

  // Get user's download history
  async getUserDownloads(userId: string, limit = 10) {
    try {
      const { data, error } = await this.supabase
        .from("business_plan_downloads")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching user downloads:", error);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Error in getUserDownloads:", error);
      return [];
    }
  }

  // Helper methods
  private async getClientIP(): Promise<string | null> {
    try {
      // In a real app, you might get this from a header or API
      return null; // Will be handled by server-side tracking
    } catch {
      return null;
    }
  }

  private getSessionId(): string {
    // Generate or retrieve session ID
    let sessionId = sessionStorage.getItem("negosyo_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      sessionStorage.setItem("negosyo_session_id", sessionId);
    }
    return sessionId;
  }
}

export const trackingService = new TrackingService();
