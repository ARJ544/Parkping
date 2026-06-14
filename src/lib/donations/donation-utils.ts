export interface DonationData {
  current: number;
  target: number;
}

export function getDonationMessage(percentage: number): string {
  if (percentage >= 100) return "🏆 Goal reached! Thank you everyone!";
  if (percentage >= 90) return "🎯 Just a little more to go!";
  if (percentage >= 80) return "🌟 Almost there!";
  if (percentage >= 70) return "🚀 The goal is getting closer!";
  if (percentage >= 60) return "❤️ Incredible support this month!";
  if (percentage >= 50) return "⚡ Halfway there!";
  if (percentage >= 40) return "🔥 Community support is growing!";
  if (percentage >= 30) return "🎉 Almost one-third funded!";
  if (percentage >= 20) return "💪 Momentum is building!";
  if (percentage >= 10) return "🌱 We're getting started this month!";
  return "🚀 First supporter of this month?";
}