import React, { useState } from 'react'
import { Clipboard, Check } from 'lucide-react'
import { Button } from './Button'

interface PasteButtonProps {
  onPaste: (text: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export function PasteButton({ onPaste, className = '', size = 'sm', disabled = false }: PasteButtonProps) {
  const [justPasted, setJustPasted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePaste = async () => {
    try {
      setError(null)
      const text = await navigator.clipboard.readText()
      if (text.trim()) {
        onPaste(text.trim())
        setJustPasted(true)
        setTimeout(() => setJustPasted(false), 2000)
      }
    } catch (err) {
      setError('No se pudo acceder al portapapeles')
      setTimeout(() => setError(null), 3000)
    }
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size={size}
        onClick={handlePaste}
        disabled={disabled}
        className={`${className} ${justPasted ? 'text-green-600 border-green-600 bg-green-50' : ''}`}
        title="Pegar desde el portapapeles"
      >
        {justPasted ? (
          <>
            <Check className="w-4 h-4 mr-1" />
            Pegado
          </>
        ) : (
          <>
            <Clipboard className="w-4 h-4 mr-1" />
            Pegar
          </>
        )}
      </Button>
      {error && (
        <div className="absolute top-full left-0 mt-1 text-xs text-red-600 bg-white border border-red-200 rounded px-2 py-1 shadow-sm z-10">
          {error}
        </div>
      )}
    </div>
  )
}
