import React from "react"
import { ItemProvider } from "./src/itemContext"

export const wrapRootElement = ({ element }) => {
  return <ItemProvider>{element}</ItemProvider>
}
