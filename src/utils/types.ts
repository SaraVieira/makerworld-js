export enum SortByModels {
  hotScore,
  boosts,
  newUploads,
  downloadCount,
  likeCount,
}

export interface GetModelsParams {
  orderBy?: SortByModels
  designCreateSince?: number
  multiColor?: boolean
  printDuration?: {
    min: number
    max: number
  }
  customizable?: boolean
}
