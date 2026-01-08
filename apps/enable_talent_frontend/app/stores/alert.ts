import { defineStore } from 'pinia';
import { ALERT_POSITION, ALERT_TYPE } from '~/constants';
import type { Alert, AlertOptions, AlertPosition } from '~/types/alert';

export const useAlertStore = defineStore('alert', {
  state: () => ({
    alerts: [] as Alert[],
    nextId: 1,
  }),

  getters: {
    // Group alerts by position for rendering
    alertsByPosition: (state) => {
      const grouped: Record<AlertPosition, Alert[]> = {
        'top-left': [],
        'top-center': [],
        'top-right': [],
        'bottom-left': [],
        'bottom-center': [],
        'bottom-right': [],
      };

      state.alerts.forEach((alert) => {
        grouped[alert.position].push(alert);
      });

      return grouped;
    },
  },

  actions: {
    addAlert(options: AlertOptions): number {
      const id = this.nextId++;

      const alert: Alert = {
        id,
        message: options.message,
        title: options.title,
        type: options.type || ALERT_TYPE.INFO,
        position: options.position || ALERT_POSITION.BOTTOM_RIGHT,
        autoDismiss: options.autoDismiss ?? true,
        duration: options.duration ?? 4000,
      };

      this.alerts.push(alert);

      if (alert.autoDismiss) {
        setTimeout(() => {
          this.removeAlert(id);
        }, alert.duration);
      }

      return id;
    },

    removeAlert(id: number) {
      const index = this.alerts.findIndex((alert) => alert.id === id);
      if (index !== -1) {
        this.alerts.splice(index, 1);
      }
    },

    clearAlerts() {
      this.alerts = [];
    },

    // Convenience methods
    success(message: string, options?: Partial<Omit<AlertOptions, 'message' | 'type'>>) {
      return this.addAlert({ ...options, message, type: ALERT_TYPE.SUCCESS });
    },

    error(message: string, options?: Partial<Omit<AlertOptions, 'message' | 'type'>>) {
      return this.addAlert({ ...options, message, type: ALERT_TYPE.ERROR });
    },

    warning(message: string, options?: Partial<Omit<AlertOptions, 'message' | 'type'>>) {
      return this.addAlert({ ...options, message, type: ALERT_TYPE.WARNING });
    },

    info(message: string, options?: Partial<Omit<AlertOptions, 'message' | 'type'>>) {
      return this.addAlert({ ...options, message, type: ALERT_TYPE.INFO });
    },
  },
});
