import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      businessName,
      businessType,
      industry,
      businessStage,
      monthlyRevenue,
      teamSize,
      primaryGoal,
      challenges,
    } = body;

    // Update user table with business type and industry
    const { error: userError } = await supabase
      .from('users')
      .update({
        business_type: businessType,
        industry: industry,
      })
      .eq('id', user.id);

    if (userError) throw userError;

    // Upsert user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        business_name: businessName,
        business_stage: businessStage.toLowerCase(),
        monthly_revenue: monthlyRevenue,
        team_size: teamSize,
        primary_goal: primaryGoal,
        challenges: challenges,
      });

    if (profileError) throw profileError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
