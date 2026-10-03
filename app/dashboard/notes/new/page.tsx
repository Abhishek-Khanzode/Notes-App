'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../lib/api';
import Editor from '../../../../components/Editor';
import { ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';

export default function NewNote() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [plainText, setPlainText] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [noteId, setNoteId] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const saveNote = useCallback(async (currentTitle: string, currentContent: string, currentText: string, id: string | null) => {
    if (!currentTitle && !currentText) return;
    
    setStatus('saving');
    try {
      if (id) {
        await api.put(`/notes/${id}`, {
          title: currentTitle,
          content: currentContent,
          plainText: currentText,
        });
        setStatus('saved');
      } else {
        const { data } = await api.post('/notes', {
          title: currentTitle,
          content: currentContent,
          plainText: currentText,
        });
        setNoteId(data.data._id);
        setStatus('saved');
        // Update URL without full reload so back button works better
        window.history.replaceState(null, '', `/dashboard/notes/${data.data._id}`);
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    // Check for temporary note saved from the landing page
    if (typeof window !== 'undefined') {
      const tempTitle = localStorage.getItem('temp_note_title');
      const tempContent = localStorage.getItem('temp_note_content');
      
      if (tempTitle || tempContent) {
        setTitle(tempTitle || '');
        setContent(tempContent || '');
        setPlainText(tempContent ? tempContent.replace(/<[^>]*>?/gm, '') : '');
        setStatus('idle');
        
        // Clear them after loading
        localStorage.removeItem('temp_note_title');
        localStorage.removeItem('temp_note_content');
        
        // Trigger initial save
        saveNote(tempTitle || '', tempContent || '', tempContent ? tempContent.replace(/<[^>]*>?/gm, '') : '', null);
      }
    }
  }, [saveNote]);

  const handleChange = (newContent: string, newText: string) => {
    setContent(newContent);
    setPlainText(newText);
    setStatus('idle');
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      saveNote(title, newContent, newText, noteId);
    }, 1000);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setStatus('idle');
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      saveNote(newTitle, content, plainText, noteId);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {status === 'saving' && <><Loader2 size={14} className="animate-spin" /> Saving...</>}
            {status === 'saved' && <><CheckCircle2 size={14} className="text-green-500" /> Saved just now</>}
            {status === 'error' && <span className="text-red-500">Unable to save. Retrying...</span>}
            {status === 'idle' && (title || plainText) && <span>Unsaved changes</span>}
          </div>
        </div>
        <div className="flex gap-2">
          {/* Add Favorite, Pin, Delete buttons later */}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col p-4 lg:p-8">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={handleTitleChange}
          className="text-4xl lg:text-5xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white mb-6 placeholder-gray-300 dark:placeholder-gray-700 w-full"
        />
        <div className="flex-1 overflow-hidden">
          <Editor content={content} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
}
