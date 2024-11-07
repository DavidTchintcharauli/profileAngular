import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, Toast } from '../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy {
  toast: Toast | null = null
  private toastSubscription: Subscription | null = null

  private notificationService = inject(NotificationService)
  
  ngOnInit(): void {
    this.toastSubscription = this.notificationService.toast$.subscribe((toast) => {
      this.toast = toast
      setTimeout(() => {
        this.toast = null
      }, toast.duration)
    })
  }

  ngOnDestroy(): void {
    if(this.toastSubscription) {
      this.toastSubscription.unsubscribe()
    }
  }
}
