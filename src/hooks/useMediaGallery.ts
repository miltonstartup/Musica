import { useState, useEffect } from 'react';
import type { MediaGallery as MediaItem } from '../types';
import {
  getMediaItems,
  getMediaItemsByCategory,
  getFeaturedMediaItems,
  createMediaItem,
  updateMediaItem,
  deleteMediaItem
} from '../api/index';

export const useMediaGallery = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await getMediaItems();
      setMediaItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los elementos multimedia');
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const items = await getMediaItemsByCategory(category);
      setMediaItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los elementos por categoría');
    } finally {
      setLoading(false);
    }
  };

  const addMediaItem = async (mediaItem: Omit<MediaItem, 'id' | 'created_at'>) => {
    try {
      setError(null);
      const newItem = await createMediaItem(mediaItem);
      setMediaItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el elemento multimedia');
      throw err;
    }
  };

  const editMediaItem = async (id: string, updates: Partial<Omit<MediaItem, 'id' | 'created_at'>>) => {
    try {
      setError(null);
      const updatedItem = await updateMediaItem(id, updates);
      setMediaItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el elemento multimedia');
      throw err;
    }
  };

  const removeMediaItem = async (id: string) => {
    try {
      setError(null);
      await deleteMediaItem(id);
      setMediaItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el elemento multimedia');
      throw err;
    }
  };

  useEffect(() => {
    fetchMediaItems();
  }, []);

  return {
    mediaItems,
    loading,
    error,
    fetchMediaItems,
    fetchMediaByCategory,
    addMediaItem,
    editMediaItem,
    removeMediaItem
  };
};

export const useFeaturedMedia = () => {
  const [featuredItems, setFeaturedItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await getFeaturedMediaItems();
      setFeaturedItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar elementos destacados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  return {
    featuredItems,
    loading,
    error,
    fetchFeaturedItems
  };
};