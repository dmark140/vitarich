import { StorageLocationData } from "../types"

export interface StorageNode extends StorageLocationData {
  children: StorageNode[]
}

export function buildStorageTree(
  data: StorageLocationData[]
): StorageNode[] {

  const map = new Map<number, StorageNode>()
  const roots: StorageNode[] = []

  data.forEach(item => {
    map.set(item.id, { ...item, children: [] })
  })

  map.forEach(node => {
    if (node.parent_id === null) {
      roots.push(node)
    } else {
      const parent = map.get(node.parent_id)
      if (parent) {
        parent.children.push(node)
      }
    }
  })

  return roots
}
