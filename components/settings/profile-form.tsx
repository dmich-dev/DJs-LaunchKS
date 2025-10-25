'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileSchema, type UserProfileInput } from '@/lib/utils/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/types/db';

interface ProfileFormProps {
  profile: UserProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserProfileInput>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      location: profile.location,
      phoneNumber: profile.phoneNumber || '',
      isKansasResident: profile.isKansasResident,
      currentEmploymentStatus: profile.currentEmploymentStatus,
      currentJobTitle: profile.currentJobTitle || '',
      currentIndustry: profile.currentIndustry || '',
      yearsOfExperience: profile.yearsOfExperience || undefined,
      educationLevel: profile.educationLevel,
      availableHoursPerWeek: profile.availableHoursPerWeek,
      willingToRelocate: profile.willingToRelocate,
      hasTransportation: profile.hasTransportation,
      financialSituation: profile.financialSituation,
      learningPreference: profile.learningPreference,
      barriers: profile.barriers ? JSON.parse(profile.barriers as string) : [],
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  const currentEmploymentStatus = watch('currentEmploymentStatus');
  const financialSituation = watch('financialSituation');
  const learningPreference = watch('learningPreference');
  const willingToRelocate = watch('willingToRelocate');
  const hasTransportation = watch('hasTransportation');

  const onSubmit = async (data: UserProfileInput) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Basic Information
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input id="firstName" {...register('firstName')} />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input id="lastName" {...register('lastName')} />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-destructive">*</span>
            </Label>
            <Input id="location" {...register('location')} placeholder="Wichita, KS" />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" {...register('phoneNumber')} placeholder="(316) 555-0123" />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Professional Background */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Professional Background
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentEmploymentStatus">
              Employment Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={currentEmploymentStatus}
              onValueChange={(value) => setValue('currentEmploymentStatus', value as 'employed' | 'unemployed' | 'student' | 'other')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.currentEmploymentStatus && (
              <p className="text-sm text-destructive">{errors.currentEmploymentStatus.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="educationLevel">
              Education Level <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch('educationLevel')}
              onValueChange={(value) => setValue('educationLevel', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high_school">High School</SelectItem>
                <SelectItem value="some_college">Some College</SelectItem>
                <SelectItem value="associates">Associate's Degree</SelectItem>
                <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                <SelectItem value="masters">Master's Degree</SelectItem>
                <SelectItem value="doctorate">Doctorate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.educationLevel && (
              <p className="text-sm text-destructive">{errors.educationLevel.message}</p>
            )}
          </div>
        </div>

        {(currentEmploymentStatus === 'employed' || currentEmploymentStatus === 'unemployed') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentJobTitle">
                {currentEmploymentStatus === 'employed' ? 'Current' : 'Most Recent'} Job Title
              </Label>
              <Input id="currentJobTitle" {...register('currentJobTitle')} />
              {errors.currentJobTitle && (
                <p className="text-sm text-destructive">{errors.currentJobTitle.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentIndustry">Industry</Label>
              <Input id="currentIndustry" {...register('currentIndustry')} />
              {errors.currentIndustry && (
                <p className="text-sm text-destructive">{errors.currentIndustry.message}</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="yearsOfExperience">Years of Work Experience</Label>
          <Input
            id="yearsOfExperience"
            {...register('yearsOfExperience', { valueAsNumber: true })}
            type="number"
            min="0"
            placeholder="5"
          />
          {errors.yearsOfExperience && (
            <p className="text-sm text-destructive">{errors.yearsOfExperience.message}</p>
          )}
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Goals & Preferences
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="availableHoursPerWeek">
              Available Hours Per Week <span className="text-destructive">*</span>
            </Label>
            <Input
              id="availableHoursPerWeek"
              {...register('availableHoursPerWeek', { valueAsNumber: true })}
              type="number"
              min="0"
              max="168"
            />
            {errors.availableHoursPerWeek && (
              <p className="text-sm text-destructive">{errors.availableHoursPerWeek.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="financialSituation">
              Financial Situation <span className="text-destructive">*</span>
            </Label>
            <Select
              value={financialSituation}
              onValueChange={(value) => setValue('financialSituation', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="can_afford_paid">Can Afford Paid Programs</SelectItem>
                <SelectItem value="needs_free_only">Needs Free Resources Only</SelectItem>
                <SelectItem value="needs_assistance">Needs Financial Assistance</SelectItem>
              </SelectContent>
            </Select>
            {errors.financialSituation && (
              <p className="text-sm text-destructive">{errors.financialSituation.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="learningPreference">
            Learning Preference <span className="text-destructive">*</span>
          </Label>
          <Select
            value={learningPreference}
            onValueChange={(value) => setValue('learningPreference', value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="in_person">In-Person</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="self_paced">Self-Paced</SelectItem>
            </SelectContent>
          </Select>
          {errors.learningPreference && (
            <p className="text-sm text-destructive">{errors.learningPreference.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="willingToRelocate"
              checked={willingToRelocate}
              onCheckedChange={(checked) => setValue('willingToRelocate', checked === true)}
            />
            <Label
              htmlFor="willingToRelocate"
              className="text-sm font-normal cursor-pointer"
            >
              I am willing to relocate for job opportunities
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasTransportation"
              checked={hasTransportation}
              onCheckedChange={(checked) => setValue('hasTransportation', checked === true)}
            />
            <Label
              htmlFor="hasTransportation"
              className="text-sm font-normal cursor-pointer"
            >
              I have reliable transportation
            </Label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
