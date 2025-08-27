import { useState } from 'react';
import { supabase } from '../services/supabase';

export interface UseImageUploadOptions {
  bucket?: string;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      setProgress(0);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            resolve(reader.result as string);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress((event.loaded / event.total) * 50); // First 50% for reading
          }
        };
        reader.readAsDataURL(file);
      });

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      setProgress(70); // Progress for upload preparation

      // Upload using edge function
      const { data, error } = await supabase.functions.invoke('image-upload', {
        body: {
          imageData: base64Data,
          fileName,
          bucket: options.bucket || 'blog-images'
        }
      });

      if (error) {
        throw new Error(error.message || 'Upload failed');
      }

      setProgress(100);
      
      const imageUrl = data.data.publicUrl;
      options.onSuccess?.(imageUrl);
      
      return imageUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      options.onError?.(errorMessage);
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000); // Reset progress after delay
    }
  };

  return {
    uploadImage,
    uploading,
    progress
  };
}