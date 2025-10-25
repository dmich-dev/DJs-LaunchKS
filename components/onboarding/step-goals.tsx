'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { UserProfileInput } from '@/lib/utils/validation';

interface StepGoalsProps {
  form: UseFormReturn<UserProfileInput>;
}

export function StepGoals({ form }: StepGoalsProps) {
  const { register, formState: { errors }, setValue, watch } = form;
  const financialSituation = watch('financialSituation');
  const learningPreference = watch('learningPreference');
  const willingToRelocate = watch('willingToRelocate');
  const hasTransportation = watch('hasTransportation');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          Let's set your goals
        </h2>
        <p className="text-muted-foreground">
          Help us understand your preferences and availability
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="availableHoursPerWeek">
          Available Hours Per Week
        </Label>
        <Input
          id="availableHoursPerWeek"
          {...register('availableHoursPerWeek', { valueAsNumber: true })}
          type="number"
          min="0"
          max="168"
          placeholder="10"
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
          onValueChange={(value) => setValue('financialSituation', value as 'can_afford_paid' | 'needs_free_only' | 'needs_assistance')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your situation" />
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

      <div className="space-y-2">
        <Label htmlFor="learningPreference">
          Learning Preference <span className="text-destructive">*</span>
        </Label>
        <Select
          value={learningPreference}
          onValueChange={(value) => setValue('learningPreference', value as 'online' | 'in_person' | 'hybrid' | 'self_paced')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your preference" />
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
  );
}
