export interface TableDataParams {
  getSingleEntity: (mesh: string, query: string | null, params: { size: number; offset: string | null }) => any
  getAllEntities: (params: { size: number; offset: string | null }) => any
  getAllEntitiesFromMesh: (mesh: string) => any
  mesh: string
  size: number
  query: string | null
  offset: string | null
}

export interface TableItem {
  name: string
  mesh: string
}
