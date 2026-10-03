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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params;
    const user = await getUser(req);
    if (!user) return unauthorized();
    
    await connectDB();
    const note = await Note.findOne({ _id: unwrappedParams.id, userId: user._id });
    if (!note) return NextResponse.json({ success: false, message: 'Note not found' }, { status: 404 });
    
    return NextResponse.json({ success: true, data: note }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params;
    const user = await getUser(req);
    if (!user) return unauthorized();
    
    await connectDB();
    const body = await req.json();
    const validatedData = createNoteSchema.parse(body);
    
    const note = await Note.findOneAndUpdate(
      { _id: unwrappedParams.id, userId: user._id },
      validatedData,
      { new: true, runValidators: true }
    );
    if (!note) return NextResponse.json({ success: false, message: 'Note not found' }, { status: 404 });
    
    return NextResponse.json({ success: true, data: note }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: (error as any).errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params;
    const user = await getUser(req);
    if (!user) return unauthorized();
    
    await connectDB();
    const note = await Note.findOneAndUpdate(
      { _id: unwrappedParams.id, userId: user._id },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!note) return NextResponse.json({ success: false, message: 'Note not found' }, { status: 404 });
    
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
