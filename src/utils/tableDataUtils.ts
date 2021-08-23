import { PAGE_SIZE_DEFAULT } from '@/consts'
import { TableDataParams, TableItem } from './tableDataUtils.types'

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
  getAllEntitiesFromMesh,
  mesh,
  query,
  size,
  offset,
}: TableDataParams) {
  const params = {
    size,
    offset,
  }

  if (mesh === 'all') {
    return getAllEntities(params)
  } else if (getSingleEntity && query && query.length && mesh !== 'all') {
    return getSingleEntity(mesh, query, params)
  }

  return getAllEntitiesFromMesh(mesh, params)
}

export async function getTableData({
  getSingleEntity,
  getAllEntities,
  getAllEntitiesFromMesh,
  mesh,
  query,
  size = PAGE_SIZE_DEFAULT,
  offset,
}: TableDataParams): Promise<{ data: TableItem[]; next: boolean }> {
  const response = await getAPICallFunction({
    getSingleEntity,
    getAllEntities,
    getAllEntitiesFromMesh,
    mesh,
    query,
    size,
    offset,
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
