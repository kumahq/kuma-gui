export interface TableDataParams {
  getSingleEntity?: (
    options: { mesh?: string | null, path?: string, name?: string | null },
    params: { size: number, offset: string | null },
  ) => any
  getAllEntities?: (
    params: { size: number, offset: string | null }
  ) => any
  getAllEntitiesFromPath?: (
    options: { path?: string },
    params: { size: number, offset: string | null }
  ) => any
  getAllEntitiesFromMesh?: (
    options: { mesh: string, path?: string },
    params: { size: number, offset: string | null }
  ) => any
  path?: string
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
