import { NextResponse } from 'next/server';
import { getUser, unauthorized } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getUser(req);
    if (!user) return unauthorized();

    return NextResponse.json({
      success: true,
      data: user,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
