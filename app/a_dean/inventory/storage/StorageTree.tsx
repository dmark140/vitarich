"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import { StorageNode } from "@/lib/utils/buildStorageTree"
import { Button } from "@/components/ui/button"

interface Props {
  nodes: StorageNode[]
  level?: number
  onSelect: (node: StorageNode) => void
}

export default function StorageTree({
  nodes,
  level = 0,
  onSelect
}: Props) {
  return (
    <div>
      {nodes.map(node => (
        <TreeItem
          key={node.id}
          node={node}
          level={level}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

function TreeItem({
  node,
  level,
  onSelect
}: {
  node: StorageNode
  level: number
  onSelect: (node: StorageNode) => void
}) {
  const [open, setOpen] = useState(true)
  const hasChildren = node.children.length > 0

  return (
    <div>
      <div
        className="group flex items-center justify-between py-1 px-2 rounded hover:bg-muted transition"
        style={{ paddingLeft: `${level * 20}px` }}
      >
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onSelect(node)}
        >
          {hasChildren ? (
            open ? (
              <ChevronDown
                size={14}
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen(false)
                }}
              />
            ) : (
              <ChevronRight
                size={14}
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen(true)
                }}
              />
            )
          ) : (
            <div className="w-[14px]" />
          )}

          <span className="text-sm font-medium">
            {node.location_name ?? node.location_code}
          </span>

          <span className="text-xs text-muted-foreground">
            ({node.location_code})
          </span>
        </div>

        {/* Action Buttons (Hover Only) */}
        <div className="hidden group-hover:flex gap-1">
          <Button size="sm" variant="ghost">Edit</Button>
          <Button size="sm" variant="ghost">Add Child</Button>
        </div>
      </div>

      {open && hasChildren && (
        <StorageTree
          nodes={node.children}
          level={level + 1}
          onSelect={onSelect}
        />
      )}
    </div>
  )
}
