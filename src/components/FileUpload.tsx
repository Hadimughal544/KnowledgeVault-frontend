import { useCallback, useState } from 'react';
import { Upload, FileText, X, Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
}

const ACCEPT = '.pdf,.docx,.txt,.md,.markdown';

export default function FileUpload({ onUpload, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setError('');
    setDone(false);
    setSelected(file);
    setUploading(true);
    try {
      await onUpload(file);
      setSelected(null);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        || 'Couldn\'t upload your file. Please try again.';
      setError(msg);
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`upload-dropzone ${dragging ? 'upload-dropzone-active' : ''} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={() => document.getElementById('file-input')?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && document.getElementById('file-input')?.click()}
        aria-label="Upload a file"
      >
        <input
          id="file-input"
          type="file"
          accept={ACCEPT}
          className="hidden"
          disabled={disabled || uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin" />
            <div className="text-center">
              <p className="text-[var(--text-primary)] font-medium text-base">Adding your file…</p>
              <p className="text-sm text-[var(--text-muted)] mt-1 truncate max-w-xs">{selected?.name}</p>
            </div>
          </div>
        ) : done ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <p className="text-emerald-700 dark:text-emerald-400 font-medium">File added!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center transition-transform group-hover:scale-105">
              <Upload className="w-8 h-8 text-[var(--accent)]" />
            </div>
            <div className="text-center max-w-sm">
              <p className="text-[var(--text-primary)] font-semibold text-lg">
                {dragging ? 'Release to upload' : 'Drop your files here or click to upload'}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                PDF, Word, or text files · up to 25 MB
              </p>
            </div>
            <span className="btn-secondary text-sm pointer-events-none min-h-[44px] px-6">
              <FileText className="w-4 h-4" />
              Choose a file
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 animate-fade-in">
          <X className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
