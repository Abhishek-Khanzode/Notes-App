import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Note from '@/lib/models/Note';
import { getUser, unauthorized } from '@/lib/auth';
import { z } from 'zod';

const createNoteSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().optional(),
  plainText: z.string().optional(),
  folderId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  wordCount: z.number().optional(),
});

export async function GET(req: Request) {
  try {
    const user = await getUser(req);
    if (!user) return unauthorized();
    
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    
    let query: any = { userId: user._id, isDeleted: false, isArchived: false };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { plainText: { $regex: search, $options: 'i' } },
      ];
    }

    const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });
    return NextResponse.json({ success: true, data: notes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser(req);
    if (!user) return unauthorized();
    
    await connectDB();
    const body = await req.json();
    const validatedData = createNoteSchema.parse(body);
    
    const note = await Note.create({ ...validatedData, userId: user._id });
    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: (error as any).errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
