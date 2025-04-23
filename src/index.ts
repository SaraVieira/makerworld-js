import { Cheerio } from "cheerio"
import { getGame } from "./game"
import * as cheerio from "cheerio"
import { getSystems } from "./systems"
import { AllowedLangs, GetGameProps } from "./utils/types"

const fetchId = async () => {
  const html = await fetch("https://makerworld.com/").then((rsp) => rsp.text())

  const $ = cheerio.load(html)
  const id = $("script[src*='_ssgManifest.js']")?.[0]
    ?.attributes?.find((a) => a.name === "src")
    ?.value.split("/_next/static/")?.[1]
    .split("/")?.[0]

  if (!id) throw new Error("AAA")

  return id
}

const baseUrlWithIdAndParams = (
  id: string,
  path: string,
  params: Record<string, any>
) => `
https://makerworld.com/_next/data/${id}/en/${path}.json?${new URLSearchParams(
  params
).toString()}`

enum SortByModels {
  hotScore,
  boosts,
  newUploads,
  downloadCount,
  likeCount,
}

export class MakerWorldJS {
  public getModels = async (params: {
    orderBy?: SortByModels
    designCreateSince?: number
    multiColor?: boolean
    printDuration?: {
      min: number
      max: number
    }
    customizable?: boolean
  }) => {
    const id = await fetchId()

    const models = await fetch(
      baseUrlWithIdAndParams(id, "3d-models", {
        orderBy: params.orderBy?.toString() || "downloadCount",
        isPrintable: true,
        ...(params.customizable && { customizable: true }),
        designCreateSince: params.designCreateSince?.toString() || "7",
        ...(params.printDuration && {
          printDuration: `${params.printDuration.min}-${params.printDuration.max}`,
        }),
        ...(params.multiColor && {
          multiColor: true,
        }),
      })
    ).then((rsp) => rsp.json())

    return models.pageProps.designs
  }

  public getUser = async (params: { user: string }) => {
    const id = await fetchId()

    const user = await fetch(
      baseUrlWithIdAndParams(id, `@${params.user}`, {})
    ).then((rsp) => rsp.json())
    return user.pageProps.userInfo
  }

  public getModel = async (params: { slug: string }) => {
    const id = await fetchId()

    const model = await fetch(
      baseUrlWithIdAndParams(id, `models/${params.slug}`, {})
    ).then((rsp) => rsp.json())

    return model.pageProps.design
  }
}

export default MakerWorldJS
