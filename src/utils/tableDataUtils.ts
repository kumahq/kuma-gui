import { getOffset } from '@/helpers'
import { TableDataParams } from './tableDataUtils.types'

function sortEntities(
  items: {
    name: string
    mesh: string
  }[],
) {
  return [...items].sort((a, b) => (a.name > b.name ? 1 : a.name === b.name ? (a.mesh > b.mesh ? 1 : -1) : -1))
}

const getItems = (response: {
  total: number
  items: {
    name: string
    mesh: string
  }[]
}) => {
  const r = response

  if (!r.total) {
    return [r]
  }

  if (r.total !== 0 && r.items && r.items.length > 0) {
    return sortEntities(r.items)
  }

  return null
}

async function getAPICallFunction({
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
    return await getAllEntities(params)
  } else if (query && query.length && mesh !== 'all') {
    return await getSingleEntity(mesh, query, params)
  }

  return await getAllEntitiesFromMesh(mesh)
}

export async function getTableData({
  getSingleEntity,
  getAllEntities,
  getAllEntitiesFromMesh,
  mesh,
  query,
  size,
  offset,
}: TableDataParams) {
  const response = await getAPICallFunction({
    getSingleEntity,
    getAllEntities,
    getAllEntitiesFromMesh,
    mesh,
    query,
    size,
    offset,
  })

  const entityList = getItems(response)

  if (!entityList) {
    return {
      data: [],
      next: null,
    }
  }

  return {
    data: entityList,
    next: response.next ? getOffset(response.next) : null,
  }
}
