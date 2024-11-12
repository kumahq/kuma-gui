const CONNECTING = 0
const OPEN = 1
const CLOSED = 2
export const isClosed = (source: { readyState: number }) => source.readyState === CLOSED
// CallableEventSource turns a Promise returning function into an EventTarget,
// making it act like a standard EventSource.

export default class CallableEventSource<T extends {} = {}> extends EventTarget {
  url = ''
  withCredentials = false
  readonly CONNECTING = CONNECTING
  readonly OPEN = OPEN
  readonly CLOSED = CLOSED

  onerror = null
  onmessage = null
  onopen = null
  readyState = CLOSED

  constructor(
    protected source: () => AsyncGenerator,
    public configuration: T,
  ) {
    super()
    this.open()
  }

  protected _open() {
    (async function (self) {
      try {
        self.readyState = CONNECTING
        const source = self.source()
        self.readyState = OPEN
        for await (const res of source) {
          self.dispatchEvent(new MessageEvent('message', {
            data: res,
          }))
          if (self.readyState === CLOSED) {
            break
          }
        }
        self.readyState = CLOSED
      } catch (e) {
        self.close()
        self.dispatchEvent(new ErrorEvent('error', {
          error: e,
        }))
      }
    })(this)
  }

  open(): void {
    if (this.readyState === CLOSED) {
      this._open()
    }
  }

  close(): void {
    this.readyState = CLOSED
  }
}
