import * as cheerio from "cheerio"
import { GetModelsParams } from "./utils/types"

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
  params: Record<string, string>
) => `
https://makerworld.com/_next/data/${id}/en/${path}.json?${new URLSearchParams(
  params
).toString()}`

export class MakerWorldJS {
  public getModels = async (params: GetModelsParams) => {
    const id = await fetchId()

    const models = await fetch(
      baseUrlWithIdAndParams(id, "3d-models", {
        orderBy: params.orderBy?.toString() || "downloadCount",
        isPrintable: "true",
        ...(params.customizable && { customizable: "true" }),
        designCreateSince: params.designCreateSince?.toString() || "7",
        ...(params.printDuration && {
          printDuration: `${params.printDuration.min}-${params.printDuration.max}`,
        }),
        ...(params.multiColor && {
          multiColor: "true",
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
