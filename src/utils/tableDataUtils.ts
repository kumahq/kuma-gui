import { getOffset } from '@/helpers'

interface TableDataParams {
  getSingleEntity: (mesh: string, query: string | null, params: { size: number; offset: string | null }) => any
  getAllEntities: (params: { size: number; offset: string | null }) => any
  getAllEntitiesFromMesh: (mesh: string) => any
  mesh: string
  size: number
  query: string | null
  offset: string | null
}

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

async function getTableData({
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

export { getTableData }
