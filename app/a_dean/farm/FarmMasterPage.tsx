
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Breadcrumb from '@/lib/Breadcrumb'
import { useEffect, useMemo, useState } from 'react'
import { ColumnConfig, RowDataKey } from '@/lib/Defaults/DefaultTypes'
import { toast } from 'sonner'
import { Edit, Plus } from 'lucide-react'
import DynamicTable from '@/components/ui/DataTableV2'
import { useRouter } from 'next/navigation'

type Field = {
  label: string
  name: string
  type?: 'text' | 'textarea'
}

type Section = {
  id: string
  title: string
  fields?: Field[]
  render?: () => React.ReactNode
}

export default function FarmMasterPage() {
  // ⭐ ALL UI COMPONENTS DEFINED HERE
  const router = useRouter()
  const [initialRows, setinitialRows] = useState<RowDataKey[]>([])
  const [loading, setLoading] = useState(false)
  const tableColumnsx: ColumnConfig[] = useMemo(
    () => [
      { key: 'id', label: 'Approval ID', type: 'text', disabled: true },
      { key: 'dr_num', label: 'Dr #', type: 'text', disabled: true },
      { key: 'status', label: 'Status', type: 'text', disabled: true },
      { key: 'decided_by_email', label: 'Decided By', type: 'text', disabled: true },
      { key: 'decided_at', label: 'Decision Date', type: 'text', disabled: true },
      { key: 'remarks', label: 'Remarks', type: 'text', disabled: true },
      { key: 'created_at', label: 'Created At', type: 'text', disabled: true },
      { key: 'action', label: 'Action', type: 'button', disabled: false },
    ],
    [initialRows]
  )

  useEffect(() => {
    router.prefetch("/a_dean/farm/new")
  }, [])

  return (
    <div>
      <div className='mt-5 mx-4 flex justify-between items-center'>
        <Breadcrumb
          FirstPreviewsPageName='Settings'
          CurrentPageName='Farm Management'
        />
        <Button onClick={() => router.push("/a_dean/farm/new")}><Plus /> New Farm</Button>
      </div>

      {!loading && (
        <DynamicTable
          columns={tableColumnsx.map((col) => ({
            key: col.key,
            label: col.label,
            align: col.key === 'action' ? 'right' : 'left',

            render: (row: RowDataKey) => {
              if (col.key === 'action') {
                return (
                  <div className="flex justify-end gap-2">
                    <Button
                      className='bg-background border hover:bg-foreground/10 border-green-400 text-green-400 p-1 rounded-xs   '

                      onClick={() => {

                      }}
                    >
                      <Edit />
                      Edit
                    </Button>
                  </div>
                )
              }

              // 📝 Default rendering
              const value = row[col.key]

              if (!value) return "-"

              return String(value)
            },
          }))}

          data={initialRows}

        />
      )}
    </div>
  )
}


