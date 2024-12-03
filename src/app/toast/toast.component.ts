import { Component, inject } from '@angular/core'
import { Observable } from 'rxjs'
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
export class ToastComponent {
  toast$: Observable<Toast | null> = inject(NotificationService).toast$;
}
