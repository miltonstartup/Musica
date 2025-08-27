// Export all API modules
export * from './services'
export * from './testimonials'
export * from './blog'
export * from './appointments'
export * from './payments'
export { mediaGalleryApi } from './media-gallery'
export { contactMessagesApi } from './contact-messages'

// For convenience, create named exports for the new APIs
import { mediaGalleryApi } from './media-gallery'
import { contactMessagesApi } from './contact-messages'

export const getMediaItems = mediaGalleryApi.getAll
export const getFeaturedMediaItems = mediaGalleryApi.getFeatured
export const getMediaItemsByCategory = mediaGalleryApi.getByCategory
export const createMediaItem = mediaGalleryApi.create
export const updateMediaItem = mediaGalleryApi.update
export const deleteMediaItem = mediaGalleryApi.delete

export const getContactMessages = contactMessagesApi.getAll
export const getUnreadContactMessages = contactMessagesApi.getUnread
export const createContactMessage = contactMessagesApi.create
export const markContactMessageAsRead = contactMessagesApi.markAsRead
export const deleteContactMessage = contactMessagesApi.delete