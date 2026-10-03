import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  cookieStore.set('token', '', {
    expires: new Date(0),
    httpOnly: true,
    path: '/',
  });

  return NextResponse.json({
    success: true,
    data: {},
  }, { status: 200 });
}
