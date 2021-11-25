export interface TableDataParams {
  getSingleEntity?: (
    options: { mesh?: string | null; name?: string | null },
    params: { size: number; offset: string | null },
  ) => any
  getAllEntities: (params: { size: number; offset: string | null }) => any
  getAllEntitiesFromMesh?: (options: { mesh: string }, params: { size: number; offset: string | null }) => any
  mesh?: string
  size: number
  query?: string | null
  params?: Object
  offset: string | null
}

export interface TableItem {
  name: string
  mesh: string
}
