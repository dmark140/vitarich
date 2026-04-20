'use client'

import SearchableCombobox, {
  ComboboxItemType
} from '@/components/SearchableCombobox'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Breadcrumb from '@/lib/Breadcrumb'
import { useGlobalContext } from '@/lib/context/GlobalContext'
import React, { useEffect, useState } from 'react'
import { savetask, SavetaskPayload } from './api'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { getProjects } from '../../projects/api'

type FormFieldName =
  | 'project_id'
  | 'subject'
  | 'issue'
  | 'priority'
  | 'task_type'
  | 'parent_task'
  | 'color'

export default function Layout() {
  const { setValue } = useGlobalContext()

  const [isLoading, setIsLoading] = useState(false)

  const [projectsList, setProjectsList] =
    useState<ComboboxItemType[]>([])

  const [taskTypes, setTaskTypes] =
    useState<ComboboxItemType[]>([])

  const [tasksList, setTasksList] =
    useState<ComboboxItemType[]>([])

  const [formValues, setFormValues] =
    useState<Record<FormFieldName, any>>({
      project_id: null,
      subject: '',
      issue: '',
      priority: null,
      task_type: null,
      parent_task: null,
      color: '#000000'
    })

  const components: {
    name: FormFieldName
    label: string
    type: string
    required?: boolean
    placeholder?: string
    multiselect?: boolean
    list?: ComboboxItemType[]
  }[] = [
      {
        name: 'project_id',
        label: 'Project',
        type: 'search',
        required: true,
        placeholder: 'Select project',
        multiselect: false,
        list: projectsList
      },

      {
        name: 'subject',
        label: 'Subject',
        type: 'text',
        required: true,
        placeholder: 'Enter subject'
      },

      {
        name: 'issue',
        label: 'Issue',
        type: 'textarea',
        placeholder: 'Describe issue'
      },

      {
        name: 'priority',
        label: 'Priority',
        type: 'search',
        required: true,
        multiselect: false,
        list: [
          { code: 'low', name: 'Low' },
          { code: 'mid', name: 'Medium' },
          { code: 'high', name: 'High' }
        ]
      },

      {
        name: 'task_type',
        label: 'Task Type',
        type: 'search',
        required: true,
        multiselect: false,
        list: taskTypes
      },

      {
        name: 'parent_task',
        label: 'Parent Task',
        type: 'search',
        multiselect: false,
        list: tasksList
      },

      {
        name: 'color',
        label: 'Color',
        type: 'color'
      }
    ]

  const handleChange = (
    name: FormFieldName,
    value: any
  ) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (
      !formValues.project_id ||
      !formValues.subject ||
      !formValues.priority ||
      !formValues.task_type
    ) {
      console.error('Missing required fields')
      return
    }

    setIsLoading(true)

    const payload: SavetaskPayload = {
      id: null,
      project_id: formValues.project_id.code,
      subject: formValues.subject,
      issue: formValues.issue || null,
      priority: formValues.priority.code,
      task_type: formValues.task_type.code,
      parent_task:
        formValues.parent_task?.code ?? null,
      color: formValues.color ?? null
    }

    try {
      const id = await savetask(payload)
      console.log('Saved task:', id)
    } catch (err) {
      console.error(err)
    }

    setIsLoading(false)
  }


  const getProjectList = async () => {
    const data = await getProjects()
    console.log({ data })
    setProjectsList((data || []).map((p: any) => ({
      code: p.id,
      name: p.project_name
    })))
  }
  useEffect(() => {
    getProjectList()
  }, [])

  useEffect(() => {
    setValue('loading_g', isLoading)
  }, [isLoading])

  return (
    <div>
      <form
        className="space-y-4 mt-8"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between">
          <Breadcrumb
            CurrentPageName="Create New Task"
            FirstPreviewsPageName="Tasks"
          />

          <Button
            type="submit"
            disabled={isLoading}
          >
            Save
          </Button>
        </div>

        <Card className='shadow-none'>
          <div className="grid grid-cols-2 gap-4 px-4">

            {components.map((e, i) => (
              <div key={i}>

                {e.type !== "search" && (
                  <Label
                    required={e.required}
                    htmlFor={e.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {e.label}
                  </Label>
                )}

                {e.type === "search" ? (
                  <SearchableCombobox
                    required={e.required}
                    multiple={e.multiselect}
                    label={e.label}
                    showCode
                    items={e.list || []}
                    value={(formValues as any)[e.name] || ""}
                    onValueChange={(val: any) => handleChange(e.name, val)}
                    className="w-full"
                  />
                ) : e.type === "textarea" ? (

                  <textarea
                    id={e.name}
                    name={e.name}
                    placeholder={e.placeholder}
                    value={(formValues as any)[e.name] || ""}
                    onChange={(ev) =>
                      handleChange(e.name, ev.target.value)
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />

                ) : e.type === "date" ? (

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {(formValues as any)[e.name]
                          ? format((formValues as any)[e.name], "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={(formValues as any)[e.name]}
                        onSelect={(date) =>
                          handleChange(e.name, date)
                        }
                        captionLayout="dropdown"
                        className="rounded-lg border"
                      />
                    </PopoverContent>
                  </Popover>

                ) : (

                  <Input
                    id={e.name}
                    name={e.name}
                    type={e.type}
                    placeholder={e.placeholder}
                    value={(formValues as any)[e.name] || ""}
                    onChange={(ev) =>
                      handleChange(e.name, ev.target.value)
                    }
                  />

                )}

              </div>
            ))}

          </div>
        </Card>
      </form>
    </div>
  )
}