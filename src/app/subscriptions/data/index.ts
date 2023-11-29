export function getIsConnected(subscriptions: { connectTime?: string, disconnectTime?: string }[] | undefined = []): boolean {
  return subscriptions.length > 0 && [subscriptions[subscriptions.length - 1]].every((item) => item.connectTime?.length && !item.disconnectTime)
}
