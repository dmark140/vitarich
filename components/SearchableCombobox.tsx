"use client"

import * as React from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "./ui/input"

type ComboboxItemType = {
  code: string
  name: string
}

type MultiProps = {
  multiple: true
  items: ComboboxItemType[]
  value: string[]
  onValueChange: (value: string[]) => void
  allowSelectAll?: boolean
  autoHighlight?: boolean
  className?: string
  showCode?: boolean
}

type SingleProps = {
  multiple?: false
  items: ComboboxItemType[]
  value: string
  onValueChange: (value: string) => void
  allowSelectAll?: boolean
  autoHighlight?: boolean
  className?: string
  showCode?: boolean
}

type Props = MultiProps | SingleProps

export default function SearchableCombobox(props: Props) {
  const [showModal, setShowModal] = React.useState(false)
  const [modalSearch, setModalSearch] = React.useState("")
  const anchor = useComboboxAnchor()
  const searchRef = React.useRef<HTMLInputElement>(null)

  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const {
    items,
    autoHighlight = true,
    className = "w-full max-w-xs",
    showCode = false,
  } = props

  const filteredItems = React.useMemo(() => {
    if (!search) return items

    return items.filter((item) =>
      `${item.code} ${item.name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [items, search])


  const selectedItems = React.useMemo(() => {
    const values = Array.isArray(props.value) ? props.value : []
    return items.filter((item) => values.includes(item.code))
  }, [items, props.value])

  const modalFiltered = React.useMemo(() => {
    if (!modalSearch) return selectedItems

    return selectedItems.filter((item) =>
      `${item.code} ${item.name}`
        .toLowerCase()
        .includes(modalSearch.toLowerCase())
    )
  }, [selectedItems, modalSearch])

  const formatLabel = (item?: ComboboxItemType) => {
    if (!item) return ""
    return showCode ? `${item.code} - ${item.name}` : item.name
  }

  const selectItem = (code: string) => {
    if (props.multiple) {
      const current = Array.isArray(props.value) ? props.value : []

      if (!current.includes(code)) {
        props.onValueChange([...current, code])
      }

      // keep dropdown open for multiple select
    } else {
      props.onValueChange(code)

      // close only for single select
      setOpen(false)
    }
  }

  return (
    <Combobox
      open={open}
      onOpenChange={(o) => {
        setOpen(o)

        if (o) {
          setTimeout(() => searchRef.current?.focus(), 0)
        } else {
          setSearch("")
        }
      }}
      multiple={props.multiple}
      autoHighlight={autoHighlight}
      items={filteredItems}
      value={props.value as any}
      onValueChange={(val) => {
        if (props.multiple) {
          if (!val) props.onValueChange([])
          else if (Array.isArray(val)) props.onValueChange(val)
          else props.onValueChange([val])
        } else {
          if (!val) props.onValueChange("")
          else if (Array.isArray(val)) props.onValueChange(val[0] ?? "")
          else props.onValueChange(val)
        }

        if (!props.multiple) {
          setOpen(false)
        }
      }}
    >
      <ComboboxChips ref={anchor} className={`${className} w-full border`}>
        <ComboboxValue>
          {(values) => {
            const normalized = Array.isArray(values)
              ? values
              : values
                ? [values]
                : []

            // if (props.multiple) {
            //   return (
            //     <>
            //       {normalized.map((val) => {
            //         const item = items.find((f) => f.code === val)

            //         return (
            //           <ComboboxChip key={val} className="bg-black/75 rounded-2xl text-white">
            //             {formatLabel(item)}
            //           </ComboboxChip>
            //         )
            //       })}
            //       <ComboboxChipsInput />
            //     </>
            //   )
            // }
            // if (props.multiple) {
            //   const visible = normalized.slice(0, 2)
            //   const hidden = normalized.slice(2)

            //   return (
            //     <div className="flex items-center w-full gap-1 overflow-hidden">

            //       {/* LEFT SIDE (chips + input) */}
            //       <div className="flex items-center gap-1 flex-nowrap overflow-hidden">
            //         {visible.map((val) => {
            //           const item = items.find((f) => f.code === val)

            //           return (
            //             <ComboboxChip
            //               key={val}
            //               className="bg-black/75 rounded-2xl text-white shrink-0"
            //             >
            //               {formatLabel(item)}
            //             </ComboboxChip>
            //           )
            //         })}

            //         {/* INPUT */}
            //         <ComboboxChipsInput className="min-w-[60px]" />
            //       </div>

            //       {/* RIGHT SIDE (+X MORE) */}
            //       {hidden.length > 0 && (
            //         <button
            //           type="button"
            //           onClick={() => setShowModal(true)}
            //           className="ml-auto shrink-0 px-2 py-0.5 text-xs rounded-full bg-muted hover:bg-muted/70 transition whitespace-nowrap"
            //         >
            //           +{hidden.length} more
            //         </button>
            //       )}
            //     </div>
            //   )
            // }
            if (props.multiple) {
              const values = Array.isArray(props.value) ? props.value : []

              const first = values[0]
              const hiddenCount = values.length - 1

              const firstItem = items.find((f) => f.code === first)

              return (
                <div className="flex items-center w-full gap-1 overflow-hidden">

                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-1 overflow-hidden flex-nowrap">

                    {/* FIRST ITEM ONLY */}
                    {first && (
                      <ComboboxChip
                        className="bg-black/75 rounded-2xl text-white shrink-0 flex items-center gap-1"
                      >
                        {/* ❌ LEFT SIDE */}
                        <span
                          className="cursor-pointer text-xs mr-1"
                          onClick={() => {
                            const current = values.filter((v) => v !== first)
                            props.onValueChange(current)
                          }}
                        >
                          ✕
                        </span>

                      <span className="truncate min-w-0 flex-1">
                          {formatLabel(firstItem)}
                        </span>
                      </ComboboxChip>
                    )}

                    {/* INPUT */}
                    <ComboboxChipsInput className="min-w-[60px]" />
                  </div>

                  {/* RIGHT SIDE */}
                  {hiddenCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="ml-auto shrink-0 px-2 py-0.5 text-xs rounded-full bg-muted hover:bg-muted/70 transition whitespace-nowrap"
                    >
                      +{hiddenCount} more
                    </button>
                  )}
                </div>
              )
            }
            const val = normalized[0]
            const item = items.find((f) => f.code === val)

            return (
              <ComboboxChipsInput
                value={formatLabel(item)}
                readOnly
              />
            )
          }}
        </ComboboxValue>
      </ComboboxChips>

      <ComboboxContent anchor={anchor}>
        <div className="p-2">
          <Input
            ref={searchRef}
            className="w-full"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab" && filteredItems.length > 0) {
                e.preventDefault()
                selectItem(filteredItems[0].code)
              }
            }}
          />
        </div>

        {filteredItems.length === 0 && (
          <ComboboxEmpty>No items found.</ComboboxEmpty>
        )}

        <ComboboxList>
          {(item: ComboboxItemType) => (
            <ComboboxItem key={item.code} value={item.code}>
              {formatLabel(item)}
            </ComboboxItem>
          )}
        </ComboboxList>

        {/* SELECT ALL */}
        {props.multiple && props.allowSelectAll && filteredItems.length > 0 && (
          <div className="border-t p-2">
            <button
              type="button"
              className="w-full text-sm text-left px-2 py-1 rounded-md hover:bg-muted"
              onClick={() => {
                const allCodes = filteredItems.map((i) => i.code)
                props.onValueChange(allCodes)
              }}
            >
              Select All
            </button>
          </div>
        )}
      </ComboboxContent>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Selected Items</DialogTitle>
          </DialogHeader>

          {/* SEARCH */}
          <Input
            placeholder="Search selected..."
            value={modalSearch}
            onChange={(e) => setModalSearch(e.target.value)}
            className="mb-2"
          />

          {/* LIST */}
          <div className="max-h-75 overflow-auto space-y-2">
            {modalFiltered.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No items found.
              </div>
            )}

            {modalFiltered.map((item) => (
              <div
                key={item.code}
                className="flex items-center justify-between border rounded-md px-3 py-2"
              >
                <span className="text-sm">
                  {formatLabel(item)}
                </span>

                {/* REMOVE BUTTON */}
                <button
                  className="text-xs text-red-500 hover:underline"
                  onClick={() => {
                    if (!props.multiple) return

                    const current = Array.isArray(props.value)
                      ? props.value
                      : []

                    props.onValueChange(
                      current.filter((v) => v !== item.code)
                    )
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Combobox>
  )
}