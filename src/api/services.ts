import { createSupabaseApi } from './baseApi'
import type { Service, CreateServiceData } from '../types'

export const servicesApi = createSupabaseApi<Service>('services')