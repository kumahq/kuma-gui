const CONNECTING = 0
const OPEN = 1
const CLOSED = 2
export const isClosed = (source: { readyState: number }) => source.readyState === CLOSED
// CallableEventSource turns a Promise returning function into an EventTarget,
// making it act like a standard EventSource.
export default class CallableEventSource extends EventTarget {
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
    public configuration = {
      attempts: 0,
      maxAttempts: 3,
      power: 1,
    },
  ) {
    super()
    this._open()
  }

  _open() {
    (async function (self) {
      try {
        self.readyState = 0
        const source = self.source()
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
        // temporarily commented until we can avoid console.errors being
        // reported in environments where we don't want to see them
        // console.error(e)
        self.dispatchEvent(new ErrorEvent('error', {
          error: e,
        }))
      }
    })(this)
  }

  open(): void {
    if (this.readyState !== CLOSED) {
      this._open()
    }
  }

  close(): void {
    this.readyState = CLOSED
  }
}
