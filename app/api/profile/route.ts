import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { userProfile, notificationPreference } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { userProfileSchema } from '@/lib/utils/validation';

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate the request body
    const validationResult = userProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if profile already exists
    const existingProfile = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, session.user.id))
      .limit(1);

    if (existingProfile.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Profile already exists' },
        { status: 400 }
      );
    }

    // Create the user profile
    await db.insert(userProfile).values({
      userId: session.user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      location: data.location,
      phoneNumber: data.phoneNumber || null,
      isKansasResident: data.isKansasResident,
      currentEmploymentStatus: data.currentEmploymentStatus,
      currentJobTitle: data.currentJobTitle || null,
      currentIndustry: data.currentIndustry || null,
      yearsOfExperience: data.yearsOfExperience || null,
      educationLevel: data.educationLevel,
      availableHoursPerWeek: data.availableHoursPerWeek,
      willingToRelocate: data.willingToRelocate,
      hasTransportation: data.hasTransportation,
      financialSituation: data.financialSituation,
      learningPreference: data.learningPreference,
      barriers: JSON.stringify(data.barriers),
    });

    // Create default notification preferences
    await db.insert(notificationPreference).values({
      userId: session.user.id,
      emailReminders: true,
      reminderFrequency: 'weekly',
      milestoneEmails: true,
      phaseCompletionEmails: true,
      marketingEmails: false,
    });

    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create profile',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user profile
    const profile = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, session.user.id))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Profile not found' },
        { status: 404 }
      );
    }

    // Parse the barriers JSON
    const profileData = {
      ...profile[0],
      barriers: profile[0].barriers ? JSON.parse(profile[0].barriers) : [],
    };

    return NextResponse.json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch profile',
      },
      { status: 500 }
    );
  }
}
