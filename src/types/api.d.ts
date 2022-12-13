/**
 * Utility type for annotating API responses for collection resources.
 *
 * **Example**:
 *
 * ```typescript
 * Promise<ApiListResponse<ExternalService>>
 * ```
 */
export interface ApiListResponse<ResourceType> {
  items: ResourceType[] | null
  total: number
}

export interface ApiKindListResponse<ResourceType> extends ApiListResponse<ResourceType> {
  kind: string
}

export interface PaginatedApiListResponse<ResourceType> extends ApiListResponse<ResourceType> {
  next: string | null
}

export interface PaginationParameters {
  size?: number
  offset?: number
}

export interface DataPlaneOverviewParameters extends PaginationParameters {
  /**
   * **Example**: `?gateway=delegated`
   */
  gateway?: 'builtin' | 'delegated' | boolean

  /**
   * **Example**: `?namePrefix=gateway`
   */
  namePrefix?: string

  /**
   * **Example**: `?tag=kuma.io/service:foo&tag=version:v1`
   */
  tag?: string | string[]
}
