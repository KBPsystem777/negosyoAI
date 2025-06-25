-- Business plan generation tracking
CREATE TABLE IF NOT EXISTS public.business_plan_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_plan_id UUID REFERENCES public.business_plans(id) ON DELETE CASCADE,
  -- Generation details
  generation_type TEXT NOT NULL DEFAULT 'full_plan', -- 'full_plan', 'quick_match', 'regenerate'
  input_data JSONB NOT NULL, -- Store the form data used for generation
  ai_model_used TEXT DEFAULT 'gpt-4o',
  generation_time_ms INTEGER, -- Time taken to generate
  tokens_used INTEGER, -- AI tokens consumed
  -- Status tracking
  status TEXT DEFAULT 'completed', -- 'started', 'completed', 'failed'
  error_message TEXT,
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  session_id TEXT
);

-- Business plan downloads tracking
CREATE TABLE IF NOT EXISTS public.business_plan_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_plan_id UUID REFERENCES public.business_plans(id) ON DELETE CASCADE,
  -- Download details
  download_type TEXT NOT NULL, -- 'pdf', 'docx', 'txt', 'json'
  file_size_bytes INTEGER,
  download_url TEXT,
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  session_id TEXT
);

-- User statistics summary table (for quick analytics)
CREATE TABLE IF NOT EXISTS public.user_statistics (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  -- Generation stats
  total_plans_generated INTEGER DEFAULT 0,
  total_generations INTEGER DEFAULT 0, -- Including regenerations
  last_generation_at TIMESTAMP WITH TIME ZONE,
  -- Download stats
  total_downloads INTEGER DEFAULT 0,
  last_download_at TIMESTAMP WITH TIME ZONE,
  -- Usage patterns
  favorite_business_types TEXT[],
  average_capital_range TEXT,
  most_active_day_of_week INTEGER, -- 0-6 (Sunday-Saturday)
  most_active_hour INTEGER, -- 0-23
  -- Metadata
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform-wide analytics table
CREATE TABLE IF NOT EXISTS public.platform_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  -- Generation metrics
  total_generations INTEGER DEFAULT 0,
  unique_users_generated INTEGER DEFAULT 0,
  avg_generation_time_ms DECIMAL(10,2),
  -- Download metrics
  total_downloads INTEGER DEFAULT 0,
  unique_users_downloaded INTEGER DEFAULT 0,
  downloads_by_type JSONB, -- {"pdf": 100, "docx": 50, etc.}
  -- Popular business types
  popular_business_types JSONB,
  -- Capital ranges
  capital_distribution JSONB,
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.business_plan_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_plan_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_plan_generations
CREATE POLICY "Users can view own generations" ON public.business_plan_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations" ON public.business_plan_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for business_plan_downloads
CREATE POLICY "Users can view own downloads" ON public.business_plan_downloads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own downloads" ON public.business_plan_downloads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_statistics
CREATE POLICY "Users can view own statistics" ON public.user_statistics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own statistics" ON public.user_statistics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own statistics" ON public.user_statistics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_plan_generations_user_id ON public.business_plan_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_business_plan_generations_created_at ON public.business_plan_generations(created_at);
CREATE INDEX IF NOT EXISTS idx_business_plan_generations_status ON public.business_plan_generations(status);

CREATE INDEX IF NOT EXISTS idx_business_plan_downloads_user_id ON public.business_plan_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_business_plan_downloads_created_at ON public.business_plan_downloads(created_at);
CREATE INDEX IF NOT EXISTS idx_business_plan_downloads_type ON public.business_plan_downloads(download_type);

CREATE INDEX IF NOT EXISTS idx_user_statistics_user_id ON public.user_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_metrics_date ON public.platform_metrics(date);

-- Function to update user statistics
CREATE OR REPLACE FUNCTION public.update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user statistics
  INSERT INTO public.user_statistics (user_id, updated_at)
  VALUES (NEW.user_id, NOW())
  ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers to automatically update user statistics
CREATE TRIGGER update_user_stats_on_generation
  AFTER INSERT ON public.business_plan_generations
  FOR EACH ROW EXECUTE FUNCTION public.update_user_statistics();

CREATE TRIGGER update_user_stats_on_download
  AFTER INSERT ON public.business_plan_downloads
  FOR EACH ROW EXECUTE FUNCTION public.update_user_statistics();
