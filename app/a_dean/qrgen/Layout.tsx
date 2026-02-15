'use client'
import QrCodeGenerator from '@/components/QRGenerator'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

export default async function Layout() {
    const [data, setdata] = useState("DR-000166")

    // await new Promise((resolve) => setTimeout(resolve, 3));

    return (
        <div className='w-md'>
            <div className='w-fit '>
                <QrCodeGenerator
                    data={data}
                    size={300}
                    className="rounded-lg shadow-sm"
                />
                <Input defaultValue={data} onChange={(e) => setdata(e.target.value)} className='w-fit mx-auto mt-4' />

            </div>

        </div>
    )
}
