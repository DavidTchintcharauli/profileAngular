export interface Toast {
  message: string
  type: 'success' | 'error'
  duration?: number
}