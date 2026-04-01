'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button } from './button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGlobalContext } from '@/lib/context/GlobalContext'

type Farm = {
  id: number
  code: string
  name: string
}

export default function GlobalFarmUserSettings() {
  const { getValue, setValue } = useGlobalContext()

  const [open, setOpen] = useState(false)
  const [userFarms, setUserFarms] = useState<string[]>([])
  const [farmDB, setFarmDB] = useState<Farm[]>([])
  const [defaultFarm, setDefaultFarm] = useState<Farm | null>(null)

  // load farms from session
  useEffect(() => {
    const session = getValue('UserInfoAuthSession')
    console.log({ session })
    if (session?.length > 0) {
      setUserFarms(session[0].users_farms || [])
    }
  }, [getValue('UserInfoAuthSession')])

  // load farm DB
  useEffect(() => {
    const farms = getValue('getFarmDB') || []
    setFarmDB(farms)
  }, [getValue('getFarmDB')])

  // merge session farms + farmDB info
  const allowedFarms = useMemo(() => {
    if (!farmDB.length || !userFarms.length) return []

    return farmDB.filter((farm) =>
      userFarms.includes(farm.code)
    )
  }, [farmDB, userFarms])

  // set default farm
  const handleSelectFarm = (farm: Farm) => {
    setValue('DefaultFarmId', farm.id)
    setDefaultFarm(farm)
    setOpen(false)
  }



  useEffect(() => {
    const session = getValue('UserInfoAuthSession')
    const currentDefaultFarmId = getValue('DefaultFarmId')

    if (!session?.length) return

    const sessionDefaultFarmId = session[0]?.default_farm

    // if no DefaultFarmId yet → use session default
    if (!currentDefaultFarmId && sessionDefaultFarmId) {
      setValue('DefaultFarmId', sessionDefaultFarmId)

      const farm = farmDB.find(
        (f) => f.id === sessionDefaultFarmId
      )

      if (farm) setDefaultFarm(farm)
    }

    // if already exists → resolve farm display
    if (currentDefaultFarmId) {
      const farm = farmDB.find(
        (f) => f.id === currentDefaultFarmId
      )

      if (farm) setDefaultFarm(farm)
    }
  }, [farmDB])

  return (
    <div>
      <Button
        variant="secondary"
        onClick={() => setOpen(true)}
      >
        Farm:
        {' '}
        {defaultFarm
          ? `${defaultFarm.code} - ${defaultFarm.name}`
          : 'Select Farm'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Default Farm</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            {allowedFarms.map((farm) => (
              <Button
                key={farm.id}
                variant="outline"
                onClick={() => handleSelectFarm(farm)}
                className="justify-start"
              >
                {farm.code} — {farm.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}