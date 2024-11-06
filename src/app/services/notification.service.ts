import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string
  type: 'success' | 'error'
  duration?: number
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastSubject = new Subject<Toast>()
  toast$ = this.toastSubject.asObservable()

  constructor() { }

  showToast(message: string, type: 'success' | 'error', duration: number = 3000) {
    const toast: Toast = { message, type, duration }
    this.toastSubject.next(toast)
  }
}
