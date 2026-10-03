'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../lib/api';
import Editor from '../../../../components/Editor';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function EditNote({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const noteId = unwrappedParams.id;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [plainText, setPlainText] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'loading'>('loading');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await api.get(`/notes/${noteId}`);
        setTitle(data.data.title || '');
        setContent(data.data.content || '');
        setPlainText(data.data.plainText || '');
        setStatus('saved');
      } catch (error) {
        console.error(error);
        router.push('/dashboard');
      }
    };
    fetchNote();
  }, [noteId, router]);

  const saveNote = useCallback(async (currentTitle: string, currentContent: string, currentText: string) => {
    setStatus('saving');
    try {
      await api.put(`/notes/${noteId}`, {
        title: currentTitle,
        content: currentContent,
        plainText: currentText,
      });
      setStatus('saved');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }, [noteId]);

  const handleChange = (newContent: string, newText: string) => {
    setContent(newContent);
    setPlainText(newText);
    setStatus('idle');
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      saveNote(title, newContent, newText);
    }, 1000);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setStatus('idle');
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      saveNote(newTitle, content, plainText);
    }, 1000);
  };

  if (status === 'loading') {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6366F1]" size={32} />
      </div>
    );
  }

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
            {status === 'idle' && <span>Unsaved changes</span>}
          </div>
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
