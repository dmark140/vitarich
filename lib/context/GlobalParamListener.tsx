"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useGlobalLoading } from "./GlobalLoadingContext"

export default function GlobalParamListener() {
  const searchParams = useSearchParams()
  const { setLoading } = useGlobalLoading()

  useEffect(() => {
    const loadingParam = searchParams.get("loading_g")

    if (loadingParam === "true") {
      setLoading(true)
    }
  }, [searchParams, setLoading])

  return null
}