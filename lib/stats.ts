// Real, sourced influencer-marketing industry statistics — shown on the
// "/for-brands/*" pages to back up why brands should budget for creator
// partnerships. Every figure here is pulled from a named public report, not
// invented — update the source note if a figure is refreshed from a newer
// report so the citation stays accurate.
export interface IndustryStat {
  value: string;
  label: string;
  source: string;
}

export const INFLUENCER_MARKETING_STATS: IndustryStat[] = [
  {
    value: "$5.78",
    label: "average return for every $1 spent on influencer marketing",
    source: "Influencer Marketing Hub, 2026 Benchmark Report",
  },
  {
    value: "86%",
    label: "of consumers make at least one influencer-inspired purchase every year",
    source: "Sprout Social, 2025 Influencer Marketing Report",
  },
  {
    value: "55.5%",
    label: "of consumers say they've bought something because of an influencer's endorsement",
    source: "BBB National Programs, Influencer Index",
  },
  {
    value: "83%",
    label: "of marketers report influencer content drives higher conversions than brand-only content",
    source: "Sprout Social, 2025 Influencer Marketing Report",
  },
];
