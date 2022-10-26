export interface TableDataParams {
  getSingleEntity?: (
    options: { mesh?: string | null, path?: string, name?: string | null },
    params?: any,
  ) => any
  getAllEntities?: (
    params: { size: number, offset: number | null }
  ) => any
  getAllEntitiesFromPath?: (
    options: { path?: string },
    params: { size: number, offset: number | null }
  ) => any
  getAllEntitiesFromMesh?: (
    options: { mesh: string, path?: string },
    params: { size: number, offset: number | null }
  ) => any
  path?: string
  mesh?: string | null
  size: number
  query?: string | null
  params?: Object
  offset: number | null
}

export interface TableItem {
  name: string
  mesh: string
}
