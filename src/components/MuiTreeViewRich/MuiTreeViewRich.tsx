import React from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { nodeStore } from '../../store';
import { Box } from '@mui/material';
// import { useWindowVirtualizer } from '@tanstack/react-virtual'

export function MuiTreeViewRich() {
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const listRef = React.useRef<HTMLDivElement | null>(null)

  // const virtualizer = useWindowVirtualizer({
  //   count: 10000,
  //   estimateSize: () => 35,
  //   overscan: 5,
  //   scrollMargin: listRef.current?.offsetTop ?? 0,
  // })

  const items = React.useSyncExternalStore(nodeStore.subscribe, nodeStore.getSnapshot);

  // function nodeIds(nodes: TreeViewBaseItem[]): string[] {
  //   return nodes.map((node) => {
  //     return node.id
  //   });
  // }

  function getAllItemsWithChildrenItemIds(nodes: TreeViewBaseItem[]) {
    const itemIds: string[] = [];
    const registerItemId = (item: TreeViewBaseItem) => {
      if (item.children?.length) {
        itemIds.push(item.id);
        item.children.forEach(registerItemId);
      }
    };
  
    nodes.forEach(registerItemId);
  
    return itemIds;
  }

  // return (
  //   <Box ref={listRef}>
  //     <Box sx={{
  //       height: `${virtualizer.getTotalSize()}px`,
  //       width: '100%',
  //       position: 'relative',
  //     }}>
  //       <RichTreeView getItemId={(item) => item.key.toString()} getItemLabel={(item) => item.key.toString()} items={virtualizer.getVirtualItems()} slots={{ item: TreeItem2 }} defaultExpandedItems={getAllItemsWithChildrenItemIds(items)} />
  //     </Box>
  //   </Box>
  // )

  return (
    <Box ref={listRef}>
      <RichTreeView items={items} slots={{ item: TreeItem2 }} defaultExpandedItems={getAllItemsWithChildrenItemIds(items)} />
    </Box>
  )
}

