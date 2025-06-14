export interface Notification {
  id: number;
  notif_type: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at?: string;
}
