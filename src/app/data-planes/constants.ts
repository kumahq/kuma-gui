import { TableHeader } from '@/types/index.d'

export type ColumnDropdownItem = {
  tableHeaderKey: string
  label: string
  isChecked: boolean
}

/**
 * The list of available table headers.
 */
export const availableTableHeaders: TableHeader[] = [
  { key: 'status', label: 'Status' },
  { key: 'name', label: 'DPP' },
  { key: 'type', label: 'Type' },
  { key: 'service', label: 'Service' },
  { key: 'protocol', label: 'Protocol' },
  { key: 'zone', label: 'Zone' },
  { key: 'lastConnected', label: 'Last Connected' },
  { key: 'lastUpdated', label: 'Last Updated' },
  { key: 'totalUpdates', label: 'Total Updates' },
  { key: 'dpVersion', label: 'Kuma DP version' },
  { key: 'envoyVersion', label: 'Envoy version' },
  { key: 'details', label: 'Details', hideLabel: true },
]

const nonHideableTableHeaderKeys = [
  'name',
  'details',
]

export const columnsDropdownItems: ColumnDropdownItem[] = availableTableHeaders
  .filter((tableHeader) => !nonHideableTableHeaderKeys.includes(tableHeader.key))
  .map((tableHeader) => ({
    tableHeaderKey: tableHeader.key,
    label: tableHeader.label,
    isChecked: false,
  }))

/**
 * The list of table headers that are visible in the data planes table by default.
 */
export const defaultVisibleTableHeaderKeys = [
  'status',
  'name',
  'type',
  'service',
  'protocol',
  'zone',
  'lastUpdated',
  'dpVersion',
  'details',
]

/**
 * Retrieves the data plane tables headers that should be shown.
 *
 * It’s filtered by the columns the user has configured as visible.
 *
 * The zone column is only every included in multi zone mode.
 */
export function getDataPlaneTableHeaders(isMultiZoneEnabled: boolean, visibleTableHeaderKeys: string[] = defaultVisibleTableHeaderKeys): TableHeader[] {
  return availableTableHeaders.filter((tableHeader) => {
    if (!visibleTableHeaderKeys.includes(tableHeader.key)) {
      return false
    }

    return isMultiZoneEnabled ? true : tableHeader.key !== 'zone'
  })
}
