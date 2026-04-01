'use client'
import React, { useEffect, useState } from 'react'
import { getUserFarms, getvwdmf_get_farmlist_code_name_farmtype } from '../admin/user/new/api'
import SearchableCombobox from '@/components/SearchableCombobox'
import { useGlobalContext } from '@/lib/context/GlobalContext'
import { db } from '@/lib/Supabase/supabaseClient'
import { AuthUser } from '../admin/user/new/Layout'

type Params = {
    label: string
    setValue: (value: any) => void
    value: any
}

export default function DefaultFarmComboBox({
    label,
    setValue,
    value,
}: Params) {
    const { getValue } = useGlobalContext()

    const [farmList, setFarmList] = useState<any[]>([])

    const [authSelected, setAuthSelected] = useState<AuthUser>()
    useEffect(() => {
        setAuthSelected(getValue('selectedUser'))
    }, [getValue])


    useEffect(() => {
        if (authSelected?.id) {
            const init = async () => {
                const farms = await getUserFarms(Number(authSelected?.id) || 0)
                console.log({ farms })
                setFarmList(farms)
            }
            init()
        }

    }, [authSelected])

    // set default value from GlobalContext if empty
    useEffect(() => {
        if (value) return
        if (!farmList.length) return

        const defaultFarmId = getValue('DefaultFarmId')

        if (defaultFarmId) {
            setValue(defaultFarmId)
        }
    }, [farmList, value])

    return (
        <>
            <SearchableCombobox
                required
                label={label}
                showCode
                items={farmList}
                value={value}
                onValueChange={setValue}
                className="w-full"
            />
            {value}
        </>
    )
}