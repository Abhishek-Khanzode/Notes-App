'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../../lib/api';
import { Plus, Pin, Star, Search, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function AllNotes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [search]);

  const fetchNotes = async () => {
    try {
      const { data } = await api.get(`/notes${search ? `?search=${search}` : ''}`);
      setNotes(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Notes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and organize all your notes.</p>
        </div>
        <Link 
          href="/dashboard/notes/new"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          New Note
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search notes by title, content, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 border-dashed h-64 flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notes found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {search ? 'Try adjusting your search query.' : 'Get started by creating your first note.'}
            </p>
            {!search && (
              <Link 
                href="/dashboard/notes/new"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus size={18} />
                Create Note
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
