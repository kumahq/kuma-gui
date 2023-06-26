export const isClosed = (source: { readyState: number }) => source.readyState === 2
export default class CallableEventSource extends EventTarget {
  url = ''
  withCredentials = false
  readonly CONNECTING = 0
  readonly OPEN = 1
  readonly CLOSED = 2

  onerror = null
  onmessage = null
  onopen = null
  readyState = 2

  constructor(
    protected source: () => AsyncGenerator,
    _configuration = {},
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
          if (self.readyState === 2) {
            break
          }
        }
        self.readyState = 2
      } catch (e) {
        console.error(e)
        self.dispatchEvent(new ErrorEvent('error', {
          error: e,
        }))
      }
    })(this)
  }

  open(): void {
    if (this.readyState !== 2) {
      this._open()
    }
  }

  close(): void {
    this.readyState = 2
  }
}
