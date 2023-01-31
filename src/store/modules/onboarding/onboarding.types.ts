export interface OnboardingInterface {
  isCompleted: boolean;
  step: string;
  mode: 'demo' | 'manually'
}
