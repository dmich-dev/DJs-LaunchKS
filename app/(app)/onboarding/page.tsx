'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProgressIndicator } from '@/components/onboarding/progress-indicator';
import { StepBasicInfo } from '@/components/onboarding/step-basic-info';
import { StepProfessional } from '@/components/onboarding/step-professional';
import { StepGoals } from '@/components/onboarding/step-goals';
import { userProfileSchema, type UserProfileInput } from '@/lib/utils/validation';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const STEPS = ['Basic Info', 'Professional', 'Goals'];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<UserProfileInput>({
    resolver: zodResolver(userProfileSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      location: '',
      phoneNumber: '',
      isKansasResident: true,
      currentEmploymentStatus: 'unemployed',
      currentJobTitle: '',
      currentIndustry: '',
      yearsOfExperience: undefined,
      educationLevel: 'high_school',
      availableHoursPerWeek: 10,
      willingToRelocate: false,
      hasTransportation: true,
      financialSituation: 'needs_free_only',
      learningPreference: 'online',
      barriers: [],
    },
  });

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof UserProfileInput)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['firstName', 'lastName', 'location'];
        break;
      case 2:
        fieldsToValidate = ['currentEmploymentStatus', 'educationLevel'];
        break;
      case 3:
        fieldsToValidate = ['availableHoursPerWeek', 'financialSituation', 'learningPreference', 'willingToRelocate', 'hasTransportation'];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: UserProfileInput) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save profile');
      }

      toast.success('Profile created successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome to LaunchKS!</h1>
          <p className="text-muted-foreground">
            Let's get to know you so we can create your personalized career plan
          </p>
        </div>

        <div className="mb-8">
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={STEPS.length}
            steps={STEPS}
          />
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
          <form>
            {currentStep === 1 && <StepBasicInfo form={form} />}
            {currentStep === 2 && <StepProfessional form={form} />}
            {currentStep === 3 && <StepGoals form={form} />}
          </form>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < STEPS.length ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  Complete
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
