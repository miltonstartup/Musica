import React, { useState } from 'react'
import { Mail, User, Phone, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Reply, Send, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/Card'
import { Button } from '../../components/Button'
import { Spinner } from '../../components/Spinner'
import { formatDate } from '../../lib/utils'
import { useContactMessages } from '../../hooks/useContactMessages'
import type { ContactMessage } from '../../types'

type FilterStatus = 'all' | 'read' | 'unread'

export { MessagesManagement }

function MessagesManagement() {
  const { messages, loading, error, fetchMessages, markAsRead, addResponse, removeMessage } = useContactMessages()
  const [filter, setFilter] = useState<FilterStatus>('unread')
  const [respondingTo, setRespondingTo] = useState<ContactMessage | null>(null)
  const [adminResponseText, setAdminResponseText] = useState('')
  const [submittingResponse, setSubmittingResponse] = useState(false)
  const [deletingMessage, setDeletingMessage] = useState<string | null>(null)

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true
    return filter === 'read' ? message.is_read : !message.is_read
  })

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id)
    } catch (err) {
      alert('Error al marcar mensaje como leído: ' + (err instanceof Error ? err.message : 'Error desconocido'))
    }
  }

  const handleRespondClick = (message: ContactMessage) => {
    setRespondingTo(message)
    setAdminResponseText(message.admin_response || '')
  }

  const handleSendResponse = async () => {
    if (!respondingTo || !adminResponseText.trim()) return

    setSubmittingResponse(true)
    try {
      await addResponse(respondingTo.id, adminResponseText.trim())
      setRespondingTo(null)
      setAdminResponseText('')
    } catch (err) {
      alert('Error al enviar respuesta: ' + (err instanceof Error ? err.message : 'Error desconocido'))
    } finally {
      setSubmittingResponse(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) return
    
    setDeletingMessage(id)
    try {
      await removeMessage(id)
    } catch (err) {
      alert('Error al eliminar mensaje: ' + (err instanceof Error ? err.message : 'Error desconocido'))
    } finally {
      setDeletingMessage(null)
    }
  }

  const getInquiryTypeColor = (type: string) => {
    switch (type) {
      case 'lessons': return 'bg-blue-100 text-blue-800'
      case 'events': return 'bg-purple-100 text-purple-800'
      case 'technical': return 'bg-red-100 text-red-800'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Error al cargar los mensajes</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={fetchMessages}>Intentar de nuevo</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Mensajes de Contacto</h2>
          <p className="text-slate-600 mt-1">Revisa y responde a los mensajes enviados a través del formulario de contacto</p>
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-600" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterStatus)}
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="unread">No Leídos</option>
            <option value="read">Leídos</option>
            <option value="all">Todos los Mensajes</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">
              {messages.length}
            </div>
            <div className="text-sm text-slate-600">Total de Mensajes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {messages.filter(m => !m.is_read).length}
            </div>
            <div className="text-sm text-slate-600">Mensajes No Leídos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {messages.filter(m => m.is_read).length}
            </div>
            <div className="text-sm text-slate-600">Mensajes Leídos</div>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      <div className="grid gap-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {filter === 'all' ? 'No se encontraron mensajes' : `No hay mensajes ${filter === 'read' ? 'leídos' : 'no leídos'}`}
              </h3>
              <p className="text-slate-600">
                {filter === 'all' 
                  ? 'Los mensajes de contacto aparecerán aquí.'
                  : `No se encontraron mensajes con estado "${filter === 'read' ? 'leído' : 'no leído'}".`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {message.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInquiryTypeColor(message.inquiry_type)}`}>
                        {message.inquiry_type.charAt(0).toUpperCase() + message.inquiry_type.slice(1)}
                      </span>
                      {message.is_read ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" /> Leído
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" /> No Leído
                        </span>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-slate-400" />
                          <span>{message.email}</span>
                        </div>
                        {message.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-slate-400" />
                            <span>{message.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-slate-400" />
                          <span>Recibido: {formatDate(message.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-slate-50 rounded-md">
                      <p className="text-sm text-slate-800">
                        <strong>Mensaje:</strong> {message.message}
                      </p>
                    </div>

                    {message.admin_response && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-800">
                          <strong>Tu Respuesta:</strong> {message.admin_response}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-4">
                    {!message.is_read && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsRead(message.id)}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Marcar como Leído
                      </Button>
                    )}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRespondClick(message)}
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      Responder
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(message.id)}
                      disabled={deletingMessage === message.id}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      {deletingMessage === message.id ? (
                        <Spinner size="sm" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Response Modal */}
      {respondingTo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-800">Responder Mensaje de {respondingTo.name}</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Mensaje Original</label>
                <p className="text-slate-800 p-2 bg-slate-50 rounded-md">{respondingTo.message}</p>
              </div>
              <div>
                <label htmlFor="adminResponse" className="block text-sm font-medium text-slate-700 mb-2">
                  Tu Respuesta
                </label>
                <textarea
                  id="adminResponse"
                  rows={5}
                  value={adminResponseText}
                  onChange={(e) => setAdminResponseText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Escribe tu respuesta aquí..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSendResponse} disabled={submittingResponse || !adminResponseText.trim()}>
                  {submittingResponse ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-1" />
                      Enviar Respuesta
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => { setRespondingTo(null); setAdminResponseText(''); }}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}