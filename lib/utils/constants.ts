export const APP_NAME = 'LaunchKS';
export const APP_TAGLINE = 'Where Kansans Take Off';

export const COLORS = {
  primaryDark: '#223344',
  ctaGold: '#FFC107',
  accentBlue: '#007BFF',
  neutralWhite: '#FFFFFF',
  success: '#28A745',
  warning: '#FFA500',
  error: '#DC3545',
} as const;

export const EMPLOYMENT_STATUS = [
  'employed',
  'unemployed',
  'student',
  'other'
] as const;

export const EDUCATION_LEVELS = [
  'high_school',
  'some_college',
  'associates',
  'bachelors',
  'masters',
  'doctorate',
  'other'
] as const;

export const FINANCIAL_SITUATIONS = [
  'can_afford_paid',
  'needs_free_only',
  'needs_assistance'
] as const;

export const LEARNING_PREFERENCES = [
  'online',
  'in_person',
  'hybrid',
  'self_paced'
] as const;
