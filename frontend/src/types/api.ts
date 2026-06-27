export type ApiMeta = Record<string, string | number | boolean | null>

export type ApiResponse<TData> = {
  success: boolean
  message: string
  data: TData
  meta: ApiMeta
}

export type PaginatedMeta = {
  limit: number
  page: number
  pages: number
  total: number
}
