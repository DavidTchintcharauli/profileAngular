import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, timer  } from 'rxjs'
import { Toast } from '../model/toast.model'
import { tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  private toastSubject = new BehaviorSubject<Toast | null>(null)
  toast$: Observable<Toast | null> = this.toastSubject.asObservable()

  showToast(message: string, type: 'success' | 'error', duration: number = 3000): void {
    const toast: Toast = { message, type, duration }
    this.toastSubject.next(toast)

    timer(duration)
    .pipe(tap(() => this.clearToast()))
    .subscribe()
  }

  clearToast(): void {
    this.toastSubject.next(null)
  }
}
