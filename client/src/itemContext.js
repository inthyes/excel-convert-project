// itemContext.js
import React, { createContext, useState, useContext } from "react"

const ItemContext = createContext()

export function ItemProvider({ children }) {
  const [item, setItem] = useState(null)
  console.log(item)

  return (
    <ItemContext.Provider value={{ item, setItem }}>
      {children}
    </ItemContext.Provider>
  )
}

export function useItemContext() {
  return useContext(ItemContext)
}
