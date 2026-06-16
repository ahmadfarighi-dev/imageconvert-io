'use client';

import { useCallback, useRef, useState } from 'react';
import { zipSync } from 'fflate';
import { convertImage } from '@/engine';
import type { ToolConfig } from '@/tools/tools.config';
import type { ConvertResult } from '@/engine';

const FREE_BATCH_LIMIT = 10;
const FREE_SIZE_LIMIT_MB = 25;

type FileStatus = 'processing' | 'done' | 'error';

interface FileState {
  id: string;
  name: string;
  originalBytes: number;
  status: FileStatus;
  result?: ConvertResult;
  objectUrl?: string;
  error?: string;
}

type Phase = 'idle' | 'converting' | 'results';

// ── Icons ────────────────────────────────────────────────────────────────────

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3v12m0-12-4 4m4-4 4 4" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 17v1a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-1" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DownloadIcon = ({ color = 'white', size = 16 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2v8M5 8l3 3 3-3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 13h12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CheckIcon = ({ size = 10 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M2 5l2.5 2.5L8 2.5" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ImageThumb = () => (
  <div className="w-9 h-9 bg-ic-teal-50 border border-ic-teal-100 rounded-ic-sm
                  flex items-center justify-center flex-shrink-0">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="14" height="14" rx="3" fill="#CCFBF1" />
      <circle cx="6.5" cy="6.5" r="1.5" fill="#0D9488" />
      <path d="M2 12l4-4 3 3 2-2 5 5" stroke="#0D9488" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const Spinner = () => (
  <div className="w-9 h-9 bg-ic-teal-50 border border-ic-teal-100 rounded-ic-sm
                  flex items-center justify-center flex-shrink-0">
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="#CCFBF1" strokeWidth="2" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function outputFilename(original: string, toLabel: string): string {
  const base = original.replace(/\.[^.]+$/, '');
  const ext = toLabel.toLowerCase() === 'jpg' ? 'jpg' : toLabel.toLowerCase();
  return `${base}.${ext}`;
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ConverterSection({ config }: { config: ToolConfig }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [files, setFiles] = useState<FileState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [limitToast, setLimitToast] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (picked: File[]) => {
      // Enforce free batch limit
      if (picked.length > FREE_BATCH_LIMIT) {
        setLimitToast(true);
        setTimeout(() => setLimitToast(false), 5000);
        picked = picked.slice(0, FREE_BATCH_LIMIT);
      }

      // Filter by size limit
      const valid = picked.filter((f) => f.size <= FREE_SIZE_LIMIT_MB * 1024 * 1024);

      if (valid.length === 0) return;

      const initial: FileState[] = valid.map((f) => ({
        id: `${f.name}-${f.size}-${Date.now()}`,
        name: f.name,
        originalBytes: f.size,
        status: 'processing',
      }));

      setFiles(initial);
      setPhase('converting');

      // Convert each file and update state as results arrive
      const results = await Promise.allSettled(
        valid.map((f) =>
          convertImage(f, { to: config.outputFormat, quality: 0.9 })
        )
      );

      setFiles((prev) =>
        prev.map((fs, i) => {
          const r = results[i];
          if (r.status === 'fulfilled') {
            const blob = r.value.blob;
            const objectUrl = URL.createObjectURL(blob);
            return { ...fs, status: 'done', result: r.value, objectUrl };
          } else {
            return { ...fs, status: 'error', error: 'Conversion failed — format may be unsupported' };
          }
        })
      );

      setPhase('results');
    },
    [config.outputFormat]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      if (dropped.length > 0) processFiles(dropped);
    },
    [processFiles]
  );

  const handlePick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const picked = Array.from(e.target.files ?? []);
      if (picked.length > 0) processFiles(picked);
      // Reset input so same files can be picked again
      e.target.value = '';
    },
    [processFiles]
  );

  const handleDownloadAll = useCallback(() => {
    const doneFiles = files.filter((f) => f.status === 'done' && f.result);
    if (doneFiles.length === 1 && doneFiles[0].objectUrl) {
      triggerDownload(
        doneFiles[0].objectUrl,
        outputFilename(doneFiles[0].name, config.toLabel)
      );
      return;
    }

    // ZIP multiple files using fflate
    const zipEntries: Record<string, Uint8Array> = {};
    const pending = doneFiles.map(async (fs) => {
      if (!fs.result) return;
      const buf = await fs.result.blob.arrayBuffer();
      zipEntries[outputFilename(fs.name, config.toLabel)] = new Uint8Array(buf);
    });

    Promise.all(pending).then(() => {
      const zipped = zipSync(zipEntries);
      const blob = new Blob([zipped], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `converted-${config.toLabel.toLowerCase()}.zip`);
      // Clean up the ZIP URL after download
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    });
  }, [files, config.toLabel]);

  const handleReset = useCallback(() => {
    // Revoke object URLs to free memory
    files.forEach((f) => { if (f.objectUrl) URL.revokeObjectURL(f.objectUrl); });
    setFiles([]);
    setPhase('idle');
  }, [files]);

  const totalSaved = files
    .filter((f) => f.status === 'done' && f.result)
    .reduce((acc, f) => acc + Math.max(0, f.originalBytes - (f.result?.bytes ?? 0)), 0);

  const doneCount = files.filter((f) => f.status === 'done').length;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section className="px-6 pb-8" aria-label="File converter">

      {/* Limit toast */}
      {limitToast && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-3 text-[12px] font-medium text-ic-teal-700 bg-ic-teal-50
                     border border-ic-teal-100 rounded-ic-md px-4 py-2.5"
        >
          Free batch limited to 10 files — converting the first 10.{' '}
          <span className="font-bold">Pro</span> removes the limit.
        </div>
      )}

      {/* Drop zone — shown in idle and converting phases */}
      {phase !== 'results' && (
        <div
          role="button"
          tabIndex={0}
          aria-label={`Drop ${config.fromLabel} files here or click to choose files`}
          className={`border-2 border-dashed rounded-ic-lg text-center cursor-pointer
                      transition-all duration-200 select-none
                      ${isDragging
                        ? 'border-ic-teal-600 bg-ic-teal-100 shadow-ic-teal'
                        : 'border-ic-teal-300 bg-ic-teal-50 hover:border-ic-teal-600 hover:bg-ic-teal-100 hover:shadow-ic-teal'
                      }
                      ${phase === 'converting' ? 'opacity-50 pointer-events-none' : ''}
                      p-9`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        >
          <div className="w-12 h-12 bg-white rounded-[14px] shadow-ic-md mx-auto mb-3.5
                          flex items-center justify-center">
            <UploadIcon />
          </div>
          <p className="text-base font-bold text-ic-text-900 mb-1.5">
            {isDragging ? `Drop ${config.fromLabel} files` : `Drop ${config.fromLabel} files here`}
          </p>
          <p className="text-[13px] text-ic-text-600 mb-4">or tap to browse from your device</p>
          <button
            type="button"
            className="ic-btn-primary mx-auto"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            tabIndex={-1}
          >
            <DownloadIcon />
            {config.chooseLabel}
          </button>
          <p className="text-[11px] text-ic-text-400 mt-4">{config.acceptsNote}</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        accept={config.acceptedExtensions.join(',')}
        aria-label="File input"
        onChange={handlePick}
      />

      {/* File rows — shown during converting and results phases */}
      {phase !== 'idle' && files.length > 0 && (
        <div className={`${phase === 'results' ? '' : 'mt-4'}`}>
          {phase === 'results' && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-bold text-ic-text-900">
                Converted — {doneCount} file{doneCount !== 1 ? 's' : ''} ready
              </span>
              {totalSaved > 0 && (
                <span className="text-[12px] text-ic-text-400">
                  saved {formatBytes(totalSaved)} total
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2 mb-3.5">
            {files.map((fs) => (
              <div
                key={fs.id}
                className={`flex items-center gap-3 ic-card px-3.5 py-2.5
                            ${fs.status === 'error' ? 'border-red-200 bg-red-50' : ''}`}
              >
                {fs.status === 'processing' ? <Spinner /> : <ImageThumb />}

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-ic-text-900 truncate">{fs.name}</p>
                  {fs.status === 'processing' && (
                    <p className="text-[11px] text-ic-text-400 mt-0.5">Converting…</p>
                  )}
                  {fs.status === 'done' && fs.result && (
                    <p className="text-[11px] text-ic-text-400 mt-0.5">
                      {formatBytes(fs.originalBytes)} → {formatBytes(fs.result.bytes)} ·{' '}
                      {fs.result.width}×{fs.result.height}
                    </p>
                  )}
                  {fs.status === 'error' && (
                    <p className="text-[11px] text-red-500 mt-0.5">{fs.error}</p>
                  )}
                </div>

                {fs.status === 'done' && fs.objectUrl && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-ic-teal-700
                                    bg-ic-teal-50 border border-ic-teal-100 rounded-full px-2.5 py-0.5">
                      <CheckIcon />
                      {config.toLabel}
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-[12px] font-semibold text-ic-teal-600
                                 border border-ic-teal-300 rounded-ic-sm px-3 py-1.5
                                 hover:bg-ic-teal-50 transition-colors"
                      onClick={() =>
                        triggerDownload(fs.objectUrl!, outputFilename(fs.name, config.toLabel))
                      }
                      aria-label={`Download ${fs.name} as ${config.toLabel}`}
                    >
                      <DownloadIcon color="#0D9488" size={12} />
                      Save
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action row */}
          {phase === 'results' && (
            <>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  className="ic-btn-primary flex-1 justify-center"
                  onClick={handleDownloadAll}
                  aria-label={`Download all ${doneCount} converted files as ZIP`}
                >
                  <DownloadIcon />
                  {doneCount === 1 ? `Download ${config.toLabel}` : 'Download All as ZIP'}
                </button>
                <button
                  type="button"
                  className="ic-btn-secondary"
                  onClick={handleReset}
                  aria-label="Convert more files"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M7 2v10M2 7h10" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  More files
                </button>
              </div>
              <p className="text-center text-[11px] text-ic-text-400 mt-2.5">
                {totalSaved > 0 && <>Saved {formatBytes(totalSaved)} total · </>}
                <span className="text-ic-teal-600 font-semibold">Pro</span> removes the 10-file limit
              </p>
            </>
          )}
        </div>
      )}
    </section>
  );
}
