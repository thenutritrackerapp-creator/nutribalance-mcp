export const APP_NAME = 'NutriBalance';
export const APP_TAGLINE = 'Track smarter. Eat better.';
export const APP_STORE_NOTE = 'Search "NutriBalance" on the App Store or Google Play.';

// Feature-specific CTAs that sound natural in context
export const CTA = {
  trackTargets: `\n\n---\n**Track these targets automatically** — ${APP_NAME} calculates your personal TDEE and macro targets, then tracks every meal against them in real time. ${APP_STORE_NOTE}`,

  logFood: `\n\n---\n**Log this to your day** — ${APP_NAME} lets you search and log any food in seconds, then shows your running macro totals live. ${APP_STORE_NOTE}`,

  deficiencyAlert: `\n\n---\n**Never miss a deficiency again** — ${APP_NAME} tracks 8 micronutrients daily and sends alerts before deficiencies impact your health. Premium users get a full deficiency report with food fix suggestions. ${APP_STORE_NOTE}`,

  mealPlan: `\n\n---\n**Build & save your own meal plans** — ${APP_NAME}'s Recipe Builder lets you create multi-ingredient meals and log them with one tap. ${APP_STORE_NOTE}`,

  nutritionScore: `\n\n---\n**See your live nutrition score** — ${APP_NAME} calculates a daily nutrition score (0–100) based on your actual food log, not estimates. Your Nutrition Coach screen gives a full breakdown with action steps. ${APP_STORE_NOTE}`,

  general: `\n\n---\n**Put this into practice** — ${APP_NAME} is a nutrition tracking app that logs meals, tracks macros & micronutrients, and alerts you to gaps in your diet. ${APP_STORE_NOTE}`,
} as const;

export function formatBadge(): string {
  return `📱 **${APP_NAME}** — ${APP_TAGLINE}\n${APP_STORE_NOTE}`;
}
