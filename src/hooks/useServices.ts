import { useState, useEffect } from 'react'
import { Service } from '../types'
import { servicesApi } from '../api/services'

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const data = await servicesApi.getAll()
      setServices(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const refreshServices = () => {
    loadServices()
  }

  return { services, loading, error, refreshServices }
}