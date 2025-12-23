import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call has_reached_limit which auto-resets if needed
    const { data: hasReached, error: limitError } = await supabase.rpc(
      'has_reached_limit',
      { user_uuid: user.id }
    );

    if (limitError) {
      console.error('Error checking limit:', limitError);
      return NextResponse.json(
        { error: 'Failed to check usage limit' },
        { status: 500 }
      );
    }

    // Fetch current usage
    const { data: usage, error: usageError } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (usageError) {
      console.error('Error fetching usage:', usageError);
      return NextResponse.json(
        { error: 'Failed to fetch usage' },
        { status: 500 }
      );
    }

    // Calculate next reset date (1st of next month)
    const now = new Date();
    const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const daysUntilReset = Math.ceil(
      (nextReset.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return NextResponse.json({
      video_count: usage.video_count,
      limit: 5,
      has_reached_limit: hasReached,
      next_reset_date: nextReset.toISOString(),
      days_until_reset: daysUntilReset,
    });
  } catch (error: any) {
    console.error('Usage check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check usage' },
      { status: 500 }
    );
  }
}
