export interface NotificationsInterface {
  isOpen: boolean
}

export interface NotificationItem {
  name: string
  isCompleted: boolean
  content?: string
  component?: string
}

export interface MeshNotificationItem {
  hasTracing: boolean
  hasLogging: boolean
  hasMtls: boolean
  hasMetrics: boolean
}
