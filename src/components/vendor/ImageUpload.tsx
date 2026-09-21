"use client";

import React, { useCallback, useRef, useState } from "react";
import { CloudUpload, Plus, X, Star } from "lucide-react";

export interface ImageFile {
  url: string;
  file?: File;
}

interface ImageUploadProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const addInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleAddFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const newImages: ImageFile[] = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      onChange([...images, ...newImages]);
    },
    [images, onChange]
  );

  const handleReplaceFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0 || replacingIndex === null) return;
      const file = files[0];
      const newImg: ImageFile = {
        url: URL.createObjectURL(file),
        file,
      };
      const updated = [...images];
      updated[replacingIndex] = newImg;
      onChange(updated);
      setReplacingIndex(null);
    },
    [images, onChange, replacingIndex]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleAddFiles(e.dataTransfer.files);
    },
    [handleAddFiles]
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

  const triggerReplace = (index: number) => {
    setReplacingIndex(index);
    if (replaceInputRef.current) {
      replaceInputRef.current.value = "";
      replaceInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {/* Hidden file inputs */}
      <input
        ref={addInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleAddFiles(e.target.files)}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleReplaceFiles(e.target.files)}
      />

      {/* Dashed Box Container */}
      <div
        className={`w-full rounded-xl border-2 border-dashed transition-all duration-200 ${
          isDragging
            ? "border-[#00C9A7] bg-[#f0fdfa]"
            : "border-[#00C9A7]/80 bg-[#f4fbf9]/60 hover:bg-[#f0fdfa]/80"
        } ${
          images.length === 0
            ? "flex min-h-[190px] cursor-pointer flex-col items-center justify-center p-6 text-center"
            : "flex min-h-[220px] flex-col items-center justify-center p-6"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {images.length === 0 ? (
          /* Empty state */
          <div
            onClick={() => addInputRef.current?.click()}
            className="flex flex-col items-center justify-center"
            role="button"
            tabIndex={0}
            aria-label="Upload images"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") addInputRef.current?.click();
            }}
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-[#00C9A7]">
              <CloudUpload className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Drag and drop images here or{" "}
              <span className="font-semibold text-[#00C9A7] hover:underline">
                Browse files
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              PNG, JPG, WEBP up to 5MB
            </p>
          </div>
        ) : (
          /* Uploaded images inside the dashed box */
          <div className="flex w-full flex-wrap items-center justify-center gap-6">
            {images.map(({ url }, idx) => (
              <div
                key={`${url}-${idx}`}
                className="group flex flex-col items-center"
              >
                {/* Image card */}
                <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-slate-200/90 bg-white p-1 shadow-sm transition-all group-hover:shadow-md sm:h-32 sm:w-32">
                  <img
                    src={url}
                    alt={`Upload ${idx + 1}`}
                    className="h-full w-full rounded-lg object-cover"
                  />

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(idx);
                    }}
                    className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow transition hover:bg-rose-600 focus:outline-none"
                    aria-label={`Remove image ${idx + 1}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {/* Main / Set Main button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetMain(idx);
                    }}
                    title={idx === 0 ? "Main image" : "Click to set as main image"}
                    className={`absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold transition ${
                      idx === 0
                        ? "bg-[#00C9A7] text-white shadow-sm"
                        : "bg-black/65 text-white hover:bg-black/85"
                    }`}
                  >
                    <Star className="h-2.5 w-2.5 fill-current" />
                    {idx === 0 ? "Main" : "Set Main"}
                  </button>
                </div>

                {/* Klik untuk mengganti gambar text */}
                <button
                  type="button"
                  onClick={() => triggerReplace(idx)}
                  className="mt-2.5 text-xs font-semibold text-[#00C9A7] transition hover:text-teal-700 hover:underline"
                >
                  Klik untuk mengganti gambar
                </button>
              </div>
            ))}

            {/* Add More slot if images already exist */}
            <button
              type="button"
              onClick={() => addInputRef.current?.click()}
              className="flex h-28 w-28 flex-col items-center justify-center rounded-xl border border-dashed border-teal-300 bg-white/70 text-slate-500 transition hover:border-[#00C9A7] hover:bg-white hover:text-[#00C9A7] sm:h-32 sm:w-32"
            >
              <Plus className="h-6 w-6" />
              <span className="mt-1 text-xs font-medium">Tambah Foto</span>
            </button>
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="mt-2.5 text-xs text-slate-500">
        You can click on the &apos;Main&apos; button on the images to select the main image of your product
      </p>
    </div>
  );
}

