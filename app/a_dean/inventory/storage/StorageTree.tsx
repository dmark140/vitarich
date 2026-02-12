'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, Folder } from 'lucide-react'
import { StorageNode } from '@/lib/utils/buildStorageTree'
import { cn } from '@/lib/utils'

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
    <div className="space-y-1">
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
  const [open, setOpen] = useState(false)
  const hasChildren = node.children.length > 0

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 cursor-pointer hover:bg-muted px-2 py-1 rounded"
        )}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => onSelect(node)}
      >
        {hasChildren ? (
          open ? (
            <ChevronDown
              size={14}
              onClick={(e) => {
                e.stopPropagation()
                setOpen(!open)
              }}
            />
          ) : (
            <ChevronRight
              size={14}
              onClick={(e) => {
                e.stopPropagation()
                setOpen(!open)
              }}
            />
          )
        ) : (
          <div className="w-[14px]" />
        )}

        <Folder size={14} />
        <span className="text-sm">
          {node.location_code}
        </span>
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
