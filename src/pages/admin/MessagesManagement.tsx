import React, { useState } from 'react'
import { useContactMessages } from '../../hooks/useContactMessages'
import { ContactMessage } from '../../types'
import { Card, CardContent, CardHeader } from '../../components/Card'
import { Button } from '../../components/Button'
import { Spinner } from '../../components/Spinner'
import { 
  Mail, 
  Phone, 
  MessageSquare,
  Clock,
  CheckCircle,
  Eye,
  Trash2,
  Filter,
  Search,
  Reply,
  X
} from 'lucide-react'
import { formatDate } from '../../lib/utils'

type FilterType = 'all' | 'unread' | 'general' | 'lessons' | 'events' | 'technical'

export function MessagesManagement() {
  const { messages, loading, error, markAsRead, removeMessage, fetchMessages } = useContactMessages()
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [replyText, setReplyText] = useState('')

  const inquiryTypeLabels = {
    general: 'Consulta General',
    lessons: 'Información sobre Clases',
    events: 'Eventos y Recitales',
    technical: 'Soporte Técnico'
  }

  const filteredMessages = messages.filter(message => {
    // Filter by type
    if (filter === 'unread' && message.is_read) return false
    if (filter !== 'all' && filter !== 'unread' && message.inquiry_type !== filter) return false
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        message.name.toLowerCase().includes(searchLower) ||
        message.email.toLowerCase().includes(searchLower) ||
        message.message.toLowerCase().includes(searchLower)
      )
    }
    
    return true
  })

  const unreadCount = messages.filter(msg => !msg.is_read).length

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message)
    setIsDetailOpen(true)
    
    if (!message.is_read) {
      try {
        await markAsRead(message.id)
      } catch (error) {
        console.error('Error marking message as read:', error)
      }
    }
  }

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      try {
        await removeMessage(id)
        if (selectedMessage?.id === id) {
          setIsDetailOpen(false)
          setSelectedMessage(null)
        }
      } catch (error) {
        console.error('Error deleting message:', error)
      }
    }
  }

  const closeDetail = () => {
    setIsDetailOpen(false)
    setSelectedMessage(null)
    setReplyText('')
  }

  const getInquiryTypeColor = (type: string) => {
    switch (type) {
      case 'general': return 'bg-blue-100 text-blue-800'
      case 'lessons': return 'bg-green-100 text-green-800'
      case 'events': return 'bg-purple-100 text-purple-800'
      case 'technical': return 'bg-red-100 text-red-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Gestión de Mensajes de Contacto</h1>
        <p className="text-slate-600 mt-1">Administra y responde a los mensajes de contacto</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Stats and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
            Total: {messages.length}
          </div>
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            No leídos: {unreadCount}
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-3 py-1 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Todos los mensajes</option>
            <option value="unread">No leídos</option>
            <option value="general">Consulta General</option>
            <option value="lessons">Información sobre Clases</option>
            <option value="events">Eventos y Recitales</option>
            <option value="technical">Soporte Técnico</option>
          </select>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar mensajes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className={`hover:shadow-md transition-shadow ${
            !message.is_read ? 'ring-2 ring-amber-200' : ''
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleViewMessage(message)}>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-800 truncate">{message.name}</h3>
                    {!message.is_read && (
                      <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${getInquiryTypeColor(message.inquiry_type)}`}>
                      {inquiryTypeLabels[message.inquiry_type as keyof typeof inquiryTypeLabels] || message.inquiry_type}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-600 mb-2 gap-4">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{message.email}</span>
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{message.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(message.created_at)}</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 line-clamp-2">{message.message}</p>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation()
                    handleViewMessage(message)
                  }}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteMessage(message.id)
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">
            {searchTerm || filter !== 'all' ? 'No se encontraron mensajes' : 'No hay mensajes de contacto'}
          </h3>
          <p className="text-slate-500">
            {searchTerm || filter !== 'all' 
              ? 'Intenta cambiar los filtros de búsqueda.' 
              : 'Los mensajes de contacto aparecerán aquí cuando los usuarios envíen el formulario.'}
          </p>
        </div>
      )}

      {/* Message Detail Modal */}
      {isDetailOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">{selectedMessage.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${getInquiryTypeColor(selectedMessage.inquiry_type)}`}>
                      {inquiryTypeLabels[selectedMessage.inquiry_type as keyof typeof inquiryTypeLabels] || selectedMessage.inquiry_type}
                    </span>
                    {selectedMessage.is_read ? (
                      <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Leído
                      </span>
                    ) : (
                      <span className="flex items-center text-amber-600 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        Nuevo
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={closeDetail}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Correo Electrónico</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a href={`mailto:${selectedMessage.email}`} className="text-slate-800 hover:text-amber-600">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Teléfono</label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <a href={`tel:${selectedMessage.phone}`} className="text-slate-800 hover:text-amber-600">
                          {selectedMessage.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Fecha de Envío</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-800">{formatDate(selectedMessage.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Mensaje</label>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <p className="text-slate-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Admin Response */}
              {selectedMessage.admin_response && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Respuesta Administrativa</label>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-slate-800 whitespace-pre-wrap">{selectedMessage.admin_response}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.inquiry_type === 'lessons' ? 'Consulta sobre clases' : 'Tu consulta'}&body=Hola ${selectedMessage.name},%0A%0AGracias por contactarnos...`}
                  className="flex-1"
                >
                  <Button className="w-full">
                    <Reply className="w-4 h-4 mr-2" />
                    Responder por Email
                  </Button>
                </a>
                <Button 
                  variant="outline" 
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}