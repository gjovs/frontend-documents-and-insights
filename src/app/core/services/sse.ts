import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

export interface SseEvent {
  type: string;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class SseService {
  constructor(private zone: NgZone) { }

  getServerSentEvents(url: string): Observable<SseEvent> {
    return new Observable(subscriber => {
      const eventSource = new EventSource(url, {
        withCredentials: true
      });

      eventSource.onmessage = event => {
        this.zone.run(() => {
          subscriber.next({ type: 'message', data: JSON.parse(event.data) });
        });
      };

      // Escuta por eventos customizados que enviamos
      const addCustomListener = (typeName: string) => {
        eventSource.addEventListener(typeName, event => {
          this.zone.run(() => {

            if (!event.data) {
              subscriber.unsubscribe();
              eventSource.close();
              return;
            }

            subscriber.next({ type: typeName, data: JSON.parse((event as MessageEvent).data) });
          });
        });
      };

      addCustomListener('stream_end');
      addCustomListener('error');

      eventSource.onerror = error => {
        this.zone.run(() => {
          subscriber.error(error);
          eventSource.close();
        });
      };

      return () => {
        eventSource.close();
      };
    });
  }
}
