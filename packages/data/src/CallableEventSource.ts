const CONNECTING = 0
const OPEN = 1
const CLOSED = 2
export const isClosed = (source: { readyState: number }) => source.readyState === CLOSED
// CallableEventSource turns a Promise returning function into an EventTarget,
// making it act like a standard EventSource.

export default class CallableEventSource<T extends object = {}> extends EventTarget {
  url = ''
  withCredentials = false
  readonly CONNECTING = CONNECTING
  readonly OPEN = OPEN
  readonly CLOSED = CLOSED

  onerror = null
  onmessage = null
  onopen = null
  readyState = CLOSED

  private controller = new AbortController()
  constructor(
    protected source: (controller: AbortController) => AsyncGenerator,
    public configuration: T,
  ) {
    super()
  }
  protected async _open() {
    try {
      this.readyState = CONNECTING
      this.readyState = OPEN
      for await (const res of this.source(this.controller)) {
        this.dispatchEvent(new MessageEvent('message', {
          data: res,
        }))
        if (this.readyState === CLOSED) {
          break
        }
      }
      this.readyState = CLOSED
    } catch (e) {
      this.close()
      this.dispatchEvent(new ErrorEvent('error', {
        error: e,
      }))
    }
  }

  open(): void {
    if (this.readyState === CLOSED) {
      this._open()
    }
  }

  close(): void {
    this.readyState = CLOSED
    this.controller.abort()
  }
}
