'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Search, Plus, Star, Pin, Archive } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await api.get('/notes');
      setNotes(data.data.slice(0, 6)); // Just show recent 6 on dashboard
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Good morning, {user?.name.split(' ')[0]}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here is a summary of your workspace.</p>
        </div>
        <Link 
          href="/dashboard/notes/new"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          New Note
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Total Notes</h3>
            <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <FileText size={16} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{notes.length}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Notes</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-black h-48 rounded-xl border border-gray-200 dark:border-gray-800 animate-pulse"></div>
            ))}
          </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <Link key={note._id} href={`/dashboard/notes/${note._id}`}>
                <div className="bg-white dark:bg-black p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md hover:border-orange-500 dark:hover:border-orange-500 transition-all group h-full flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1 group-hover:text-orange-500 transition-colors">{note.title || 'Untitled Note'}</h3>
                    <div className="flex gap-1">
                      {note.isPinned && <Pin size={16} className="text-orange-500 fill-orange-500" />}
                      {note.isFavorite && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                    {note.plainText || 'No content...'}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span>{format(new Date(note.updatedAt), 'MMM d, yyyy')}</span>
                    {note.tags && note.tags.length > 0 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                        {note.tags[0]}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 border-dashed">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notes yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first note and start capturing your ideas.</p>
            <Link 
              href="/dashboard/notes/new"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />
              Create Note
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Temporary workaround for missing FileText icon
import { FileText } from 'lucide-react';
