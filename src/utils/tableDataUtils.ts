import { TableDataParams, TableItem } from './tableDataUtils.types'
import { PAGE_SIZE_DEFAULT } from '@/consts'

function sortEntities(items: TableItem[]): TableItem[] {
  return [...items].sort((a, b) => (a.name > b.name ? 1 : a.name === b.name ? (a.mesh > b.mesh ? 1 : -1) : -1))
}

const getItems = (response: { total: number; items: TableItem[] }): TableItem[] => {
  if (response.total !== 0 && response.items && response.items.length > 0) {
    return sortEntities(response.items)
  }

  return []
}

function getAPICallFunction({
  getSingleEntity,
  getAllEntities,
  getAllEntitiesFromPath,
  getAllEntitiesFromMesh,
  path,
  mesh,
  query,
  size,
  offset,
  params: additionalParms = {},
}: TableDataParams) {
  const params = {
    size,
    offset,
    ...additionalParms,
  }

  if (getSingleEntity && query) {
    return getSingleEntity({ mesh, path, name: query }, params)
  }

  const isAllEntities = !mesh || mesh === 'all'

  if (getAllEntities && isAllEntities) {
    return getAllEntities(params)
  }

  if (getAllEntitiesFromPath && isAllEntities) {
    return getAllEntitiesFromPath({ path }, params)
  }

  if (getAllEntitiesFromMesh && mesh) {
    return getAllEntitiesFromMesh({ mesh, path }, params)
  }

  return Promise.resolve()
}

export async function getTableData({
  getSingleEntity,
  getAllEntities,
  getAllEntitiesFromPath,
  getAllEntitiesFromMesh,
  path,
  mesh,
  query,
  size = PAGE_SIZE_DEFAULT,
  offset,
  params = {},
}: TableDataParams): Promise<{ data: TableItem[]; next: boolean }> {
  const response = await getAPICallFunction({
    getSingleEntity,
    getAllEntities,
    getAllEntitiesFromPath,
    getAllEntitiesFromMesh,
    path,
    mesh,
    query,
    size,
    offset,
    params,
  })

  if (!response) {
    return {
      data: [],
      next: false,
    }
  }

  return {
    data: response.items ? getItems(response) : [response],
    next: Boolean(response.next),
  }
}
