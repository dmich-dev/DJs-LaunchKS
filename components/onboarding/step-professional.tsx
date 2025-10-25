'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfileInput } from '@/lib/utils/validation';

interface StepProfessionalProps {
  form: UseFormReturn<UserProfileInput>;
}

export function StepProfessional({ form }: StepProfessionalProps) {
  const { register, formState: { errors }, setValue, watch } = form;
  const currentEmploymentStatus = watch('currentEmploymentStatus');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          Tell us about your professional background
        </h2>
        <p className="text-muted-foreground">
          This helps us understand your starting point
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentEmploymentStatus">
          Current Employment Status <span className="text-destructive">*</span>
        </Label>
        <Select
          value={currentEmploymentStatus}
          onValueChange={(value) => setValue('currentEmploymentStatus', value as 'employed' | 'unemployed' | 'student' | 'other')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your status" />
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

      {(currentEmploymentStatus === 'employed' || currentEmploymentStatus === 'unemployed') && (
        <>
          <div className="space-y-2">
            <Label htmlFor="currentJobTitle">
              {currentEmploymentStatus === 'employed' ? 'Current' : 'Most Recent'} Job Title
            </Label>
            <Input
              id="currentJobTitle"
              {...register('currentJobTitle')}
              placeholder="Software Developer, Teacher, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentIndustry">Industry</Label>
            <Input
              id="currentIndustry"
              {...register('currentIndustry')}
              placeholder="Technology, Education, Healthcare, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">Years of Experience</Label>
            <Input
              id="yearsOfExperience"
              {...register('yearsOfExperience', { valueAsNumber: true })}
              type="number"
              min="0"
              max="70"
              placeholder="5"
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="educationLevel">
          Education Level <span className="text-destructive">*</span>
        </Label>
        <Select
          value={watch('educationLevel')}
          onValueChange={(value) => setValue('educationLevel', value as 'high_school' | 'some_college' | 'associates' | 'bachelors' | 'masters' | 'doctorate' | 'other')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your education level" />
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
  );
}
