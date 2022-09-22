/**
 * Utility type for annotating API responses for collection resources.
 *
 * **Example**:
 *
 * ```typescript
 * Promise<ApiListResponse<ExternalService>>
 * ```
 */
export type ApiListResponse<ResourceType> = {
  items: ResourceType[]
  total: number
  next: string | null
}
