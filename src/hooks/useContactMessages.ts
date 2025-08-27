import { useState, useEffect } from 'react'
import type { ContactMessage, CreateContactMessageData } from '../types'
import { contactMessagesApi } from '../api/contact-messages'

export const useContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await contactMessagesApi.getAll()
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mensajes')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const updatedMessage = await contactMessagesApi.markAsRead(id)
      setMessages(prev => prev.map(msg => msg.id === id ? updatedMessage : msg))
      return updatedMessage
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar como leído')
      throw err
    }
  }

  const addResponse = async (id: string, response: string) => {
    try {
      const updatedMessage = await contactMessagesApi.addResponse(id, response)
      setMessages(prev => prev.map(msg => msg.id === id ? updatedMessage : msg))
      return updatedMessage
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar respuesta')
      throw err
    }
  }

  const removeMessage = async (id: string) => {
    try {
      await contactMessagesApi.delete(id)
      setMessages(prev => prev.filter(msg => msg.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar mensaje')
      throw err
    }
  }

  const createMessage = async (messageData: CreateContactMessageData) => {
    try {
      const newMessage = await contactMessagesApi.create(messageData)
      setMessages(prev => [newMessage, ...prev])
      return newMessage
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear mensaje')
      throw err
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  return {
    messages,
    loading,
    error,
    fetchMessages,
    markAsRead,
    addResponse,
    removeMessage,
    createMessage
  }
}

export const useUnreadMessages = () => {
  const [unreadMessages, setUnreadMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUnreadMessages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await contactMessagesApi.getUnread()
      setUnreadMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mensajes no leídos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnreadMessages()
  }, [])

  return {
    unreadMessages,
    loading,
    error,
    fetchUnreadMessages
  }
}
