'use client'

import { useEffect, useState } from "react"
import { useTopLoader } from "nextjs-toploader"
import { useGlobalContext } from "./GlobalContext"

export default function GlobalLoaderController() {
  const { getValue } = useGlobalContext()
  const loader = useTopLoader()

 const [load, setload] = useState(false)

 useEffect(() => {
   setload(!!getValue("loading_g"))
 }, [getValue("loading_g")])
 
  useEffect(() => {
    if (load) {
      loader.start()
    } else {
      loader.done()
    }
  }, [load])

  return null
}