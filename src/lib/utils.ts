import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatTime(timeString: string): string {
  // Handle time string in HH:MM:SS format
  if (typeof timeString === 'string' && timeString.includes(':')) {
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    
    return `${hour12}:${minutes} ${period}`;
  }
  
  // Fallback for date objects
  const d = new Date(timeString);
  if (isNaN(d.getTime())) {
    return 'Invalid time';
  }
  
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

export function generateTimeSlots(date: string): string[] {
  const slots: string[] = []
  const baseDate = new Date(date)
  
  // Generate hourly slots from 9 AM to 6 PM
  for (let hour = 9; hour <= 18; hour++) {
    const slotDate = new Date(baseDate)
    slotDate.setHours(hour, 0, 0, 0)
    slots.push(slotDate.toISOString())
  }
  
  return slots
}