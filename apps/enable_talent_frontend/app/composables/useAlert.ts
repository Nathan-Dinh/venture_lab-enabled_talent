import { useAlertStore } from '~/stores/alert';
import type { AlertOptions } from '~/types/alert';

export function useAlert() {
  const alertStore = useAlertStore();

  return {
    show: (options: AlertOptions) => alertStore.addAlert(options),
    success: (message: string, options?: Partial<Omit<AlertOptions, 'message' | 'type'>>) =>
      alertStore.success(message, options),
    error: (message: string, options?: Partial<Omit<AlertOptions, 'message' | 'type'>>) =>
      alertStore.error(message, options),
    warning: (message: string, options?: Partial<Omit<AlertOptions, 'message' | 'type'>>) =>
      alertStore.warning(message, options),
    info: (message: string, options?: Partial<Omit<AlertOptions, 'message' | 'type'>>) =>
      alertStore.info(message, options),
    remove: (id: number) => alertStore.removeAlert(id),
    clear: () => alertStore.clearAlerts(),
  };
}
