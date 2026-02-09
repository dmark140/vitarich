'use client'
import { useGlobalContext } from '@/lib/context/GlobalContext'
import React from 'react'

export default function Layout() {
    const { setValue, getValue } = useGlobalContext()

    return (
        <div>Layout</div>
    )
}
