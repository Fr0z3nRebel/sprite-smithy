import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, secret } = await request.json();

    // Validate secret token
    if (secret !== process.env.ADMIN_SETUP_SECRET) {
      return NextResponse.json(
        { error: 'Invalid setup secret' },
        { status: 403 }
      );
    }

    const supabase = createAdminClient();

    // Check if admin setup has already been completed
    const { data: setupData } = await supabase
      .from('admin_setup')
      .select('is_completed')
      .single();

    if (setupData?.is_completed) {
      return NextResponse.json(
        { error: 'Admin setup has already been completed' },
        { status: 400 }
      );
    }

    // Create the admin user using service role
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
      },
    });

    if (authError) {
      throw authError;
    }

    const userId = authData.user.id;

    // Update profile to set admin role
    await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId);

    // Update purchase to set paid tier (no charge for admin)
    await supabase
      .from('purchases')
      .update({
        tier: 'paid',
        amount_paid: 0,
        purchased_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    // Mark admin setup as completed
    await supabase
      .from('admin_setup')
      .update({
        is_completed: true,
        completed_by: userId,
        completed_at: new Date().toISOString(),
      })
      .eq('is_completed', false);

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
    });
  } catch (error: any) {
    console.error('Admin setup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create admin account' },
      { status: 500 }
    );
  }
}
