import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { Toast } from '../model/toast.model';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  private toastSubject = new BehaviorSubject<Toast | null>(null)
  toast$: Observable<Toast | null> = this.toastSubject.asObservable()

  showToast(message: string, type: 'success' | 'error', duration: number = 3000): Observable<Toast> {
    const toast: Toast = { message, type, duration }
    this.toastSubject.next(toast)

    return of(toast).pipe(delay(duration))
  }

  clearToast(): void {
    this.toastSubject.next(null);
  }
}
