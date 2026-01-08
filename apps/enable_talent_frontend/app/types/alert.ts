import { ALERT_POSITION, ALERT_TYPE } from '~/constants';

export type AlertType = (typeof ALERT_TYPE)[keyof typeof ALERT_TYPE];
export type AlertPosition = (typeof ALERT_POSITION)[keyof typeof ALERT_POSITION];

export interface Alert {
  id: number;
  message: string;
  title?: string;
  type: AlertType;
  position: AlertPosition;
  autoDismiss: boolean;
  duration: number;
}

export interface AlertOptions {
  message: string;
  title?: string;
  type?: AlertType;
  position?: AlertPosition;
  autoDismiss?: boolean;
  duration?: number;
}
