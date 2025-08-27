import { useData } from './useData'
import { servicesApi } from '../api/services'
import type { Service } from '../types'

export function useServices() {
  const { data: services, loading, error, refresh: refreshServices } = useData<Service>(servicesApi.getAll)
  return { services, loading, error, refreshServices }
}