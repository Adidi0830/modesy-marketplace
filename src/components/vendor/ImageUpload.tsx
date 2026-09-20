"use client";

import React, { useCallback, useRef, useState } from "react";
import { CloudUpload } from "lucide-react";

export interface ImageFile {
  url: string;
  file?: File;
}

interface ImageUploadProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newImages: ImageFile[] = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      onChange([...images, ...newImages]);
    },
    [images, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleSetMain = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const remaining = images.filter((_, i) => i !== index);
    onChange([selected, ...remaining]);
  };

  return (
    <div>
      <div
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-slate-50 p-8 transition-colors cursor-pointer ${
          isDragging
            ? "border-[#00C9A7] bg-teal-50"
            : "border-slate-300 hover:border-slate-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload images"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <CloudUpload className="mb-3 h-10 w-10 text-slate-400" />
        <p className="text-sm font-medium text-slate-600">
          Drag and drop images here or{" "}
          <span className="text-[#00C9A7] hover:underline">Browse files</span>
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {images.map(({ url }, idx) => (
            <div key={`${url}-${idx}`} className="group relative aspect-square">
              <img
                src={url}
                alt={`Upload ${idx + 1}`}
                className="h-full w-full rounded-lg border border-slate-200 object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow transition hover:bg-rose-600"
                aria-label={`Remove image ${idx + 1}`}
              >
                ✕
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSetMain(idx);
                }}
                title={idx === 0 ? "Main image" : "Click to set as main image"}
                className={`absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[9px] font-semibold transition ${
                  idx === 0
                    ? "bg-[#00C9A7] text-white"
                    : "bg-black/60 text-white hover:bg-black/80"
                }`}
              >
                {idx === 0 ? "★ Main" : `Set Main`}
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="mt-2 text-xs text-slate-400">
        You can click on &apos;Set Main&apos; on any image to select the main image of your product.
      </p>
    </div>
  );
}
