import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  plainText: string;
  folderId?: mongoose.Types.ObjectId;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: '', index: true },
    content: { type: String, default: '' },
    plainText: { type: String, default: '' },
    folderId: { type: Schema.Types.ObjectId, ref: 'Folder' },
    tags: [{ type: String, index: true }],
    isPinned: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

NoteSchema.index({ updatedAt: -1 });

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
