/**
 * Utility type for annotating API responses for collection resources.
 * @deprecated
 *
 * **Example**:
 *
 * ```typescript
 * Promise<ApiListResponse<ExternalService>>
 * ```
 */
export interface ApiListResponse<ResourceType> {
  items: ResourceType[]
  total: number
}

export interface ApiKindListResponse<ResourceType> extends ApiListResponse<ResourceType> {
  kind: string
}

export interface PaginatedApiListResponse<ResourceType> extends ApiListResponse<ResourceType> {
  next: string | null
}
