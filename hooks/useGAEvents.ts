export const useGAEvents = () => {
  const track = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", eventName, params || {});
    }
  };

  return {
    trackGenerateIdeaClick: (data: {}) => {
      track("generate_idea_clicked", data);
    },
    trackIdeaGenerated: (data: {}) => {
      track("idea_generated", data);
    },
    trackPlanDownload: (data: {}) => {
      track("plan_downloaded", data);
    },
    trackPageScrolledToBottom: () => track("page_scrolled_to_bottom"),
  };
};
