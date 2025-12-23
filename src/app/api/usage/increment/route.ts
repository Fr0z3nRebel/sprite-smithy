import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is pro (pro users don't have limits)
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('tier')
      .eq('user_id', user.id)
      .single();

    if (purchaseError) {
      console.error('Error fetching purchase:', purchaseError);
      return NextResponse.json(
        { error: 'Failed to fetch user tier' },
        { status: 500 }
      );
    }

    // Don't increment for pro users
    if (purchase?.tier === 'paid') {
      return NextResponse.json({
        video_count: 0,
        limit: -1, // unlimited
        has_reached_limit: false,
      });
    }

    // Increment count (auto-resets if needed)
    const { data: newCount, error: incrementError } = await supabase.rpc(
      'increment_video_count',
      { user_uuid: user.id }
    );

    if (incrementError) {
      console.error('Error incrementing usage:', incrementError);
      return NextResponse.json(
        { error: 'Failed to increment usage' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      video_count: newCount,
      limit: 5,
      has_reached_limit: newCount >= 5,
    });
  } catch (error: any) {
    console.error('Usage increment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to increment usage' },
      { status: 500 }
    );
  }
}
