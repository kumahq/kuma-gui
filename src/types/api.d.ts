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
