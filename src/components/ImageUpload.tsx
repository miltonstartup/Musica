import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  className?: string;
  bucket?: string;
}

export function ImageUpload({ 
  onImageUploaded, 
  currentImageUrl, 
  className = '', 
  bucket = 'blog-images' 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, uploading, progress } = useImageUpload({
    bucket,
    onSuccess: (url) => {
      setPreviewUrl(url);
      onImageUploaded(url);
      setError(null);
    },
    onError: (errorMessage) => {
      setError(errorMessage);
    }
  });

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    try {
      await uploadImage(file);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${isDragging ? 'border-amber-500 bg-amber-50' : 'border-slate-300 hover:border-slate-400'}
          ${uploading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={!uploading ? handleBrowseClick : undefined}
      >
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Upload preview"
              className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 p-1 bg-white shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              {uploading ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-slate-600">Uploading... {progress}%</span>
                  {progress > 0 && (
                    <div className="w-48 h-2 bg-slate-200 rounded-full">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-slate-400" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">
                      Drop an image here, or click to browse
                    </p>
                    <p className="text-xs text-slate-400">
                      PNG, JPG, JPEG up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md text-sm">
          <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {!previewUrl && (
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBrowseClick}
            disabled={uploading}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Choose Image
          </Button>
        </div>
      )}
    </div>
  );
}