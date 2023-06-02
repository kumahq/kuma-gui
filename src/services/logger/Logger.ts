export const logEvents: Record<string, string> = {
  PAGINATION_PREVIOUS_BUTTON_CLICKED: 'pagination-previous-button-clicked',
  PAGINATION_NEXT_BUTTON_CLICKED: 'pagination-next-button-clicked',
  SIDEBAR_ITEM_CLICKED: 'sidebar-item-clicked',
  TABLE_REFRESH_BUTTON_CLICKED: 'table-refresh-button-clicked',
  TABS_TAB_CHANGE: 'tabs-tab-change',
  CREATE_DATA_PLANE_PROXY_CLICKED: 'create-data-plane-proxy-clicked',
}

type LogArgs = [string] | [string, object | undefined] | [string, object | undefined, Error | undefined]

export default class Logger {
  setup() {
    // Currently, there is no setup code here. This could contain Datadog Logs setup code, for example.
  }

  info(...args: LogArgs) {
    this._log('info', ...args)
  }

  protected _log(type: 'info', ...args: LogArgs) {
    console[type](...args)
  }
}
