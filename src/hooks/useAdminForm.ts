import { useState } from 'react'

interface UseAdminFormOptions<T, CreateData> {
  initialData: CreateData
  createFn: (data: CreateData) => Promise<T>
  updateFn: (id: string, data: Partial<CreateData>) => Promise<T>
  onSuccess: () => void
}

export function useAdminForm<T extends { id: string }, CreateData>({
  initialData,
  createFn,
  updateFn,
  onSuccess
}: UseAdminFormOptions<T, CreateData>) {
  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<CreateData>(initialData)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleEdit = (item: T, mapToFormData: (item: T) => CreateData) => {
    setEditingItem(item)
    setFormData(mapToFormData(item))
    setIsCreating(false)
    setFormError(null)
  }

  const handleCreate = () => {
    setEditingItem(null)
    setFormData(initialData)
    setIsCreating(true)
    setFormError(null)
  }

  const handleCancel = () => {
    setEditingItem(null)
    setIsCreating(false)
    setFormData(initialData)
    setFormError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)

    try {
      if (editingItem) {
        await updateFn(editingItem.id, formData)
      } else {
        await createFn(formData)
      }
      onSuccess()
      handleCancel()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    editingItem,
    isCreating,
    formData,
    setFormData,
    submitting,
    formError,
    handleEdit,
    handleCreate,
    handleCancel,
    handleSubmit
  }
}