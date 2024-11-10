import { Component, inject } from '@angular/core'
import { Observable  } from 'rxjs'
import { map } from 'rxjs/operators'
import { NotificationService } from '../services/notification.service'
import { CommonModule } from '@angular/common'
import { Toast } from '../model/toast.model'

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent{
  private notificationService = inject(NotificationService)
  toast$: Observable<Toast | null> = this.notificationService.toast$.pipe(
    map(toast => {
      if (toast?.duration) {
        setTimeout(() => (this.toast$), toast.duration)
      }
      return toast
    })
  );
}
