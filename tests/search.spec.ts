import { it, describe } from "vitest"
import MakerWorldJS from "../src"

describe("Get models", () => {
  it(
    "search models",
    async () => {
      await new MakerWorldJS().getModels({})
    },
    {
      timeout: 200000,
    }
  )
  it(
    "get user",
    async () => {
      await new MakerWorldJS().getUser({ user: "BambuLab" })
    },
    {
      timeout: 200000,
    }
  )
  it(
    "get model",
    async () => {
      await new MakerWorldJS().getModel({ slug: "13717-led-lamp-001" })
    },
    {
      timeout: 200000,
    }
  )
})
