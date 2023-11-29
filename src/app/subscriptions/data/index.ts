export function getStatus(subscriptions: { connectTime?: string, disconnectTime?: string }[] | undefined = []): 'online' | 'offline' {
  const proxyOnline = subscriptions.length > 0 && [subscriptions[subscriptions.length - 1]].every((item) => item.connectTime?.length && !item.disconnectTime)
  return proxyOnline ? 'online' : 'offline'
}
