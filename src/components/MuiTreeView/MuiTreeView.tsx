import React from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { Box } from '@mui/material';
import { nodeStore } from '../../store';
import { SimpleTreeView } from '@mui/x-tree-view';

type TreeViewItemDepth = {
  depth?: number;
  id: string;
  label: string;
}


export function MuiTreeView() {
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  
  const items = React.useSyncExternalStore(nodeStore.subscribe, nodeStore.getSnapshot);
  
  // Flatten tree into array based on expanded state
  // const getFlattenedNodes = React.useCallback((nodes: TreeViewBaseItem<TreeViewItemDepth>[]): TreeViewBaseItem<TreeViewItemDepth>[] => {
  //   const flattened: TreeViewBaseItem<TreeViewItemDepth>[] = [];
    
  //   const flatten = (node: TreeViewBaseItem<TreeViewItemDepth>, depth: number) => {
  //     flattened.push({ ...node, depth });
  //     if (expandedItems.includes(node.id) && node.children) {
  //       node.children.forEach(child => flatten(child, depth + 1));
  //     }
  //   };
    
  //   nodes.forEach(node => flatten(node, 0));
  //   return flattened;
  // }, [expandedItems]);

  const getFlattenedNodes = React.useCallback((nodes: TreeViewBaseItem<TreeViewItemDepth>[]): TreeViewBaseItem<TreeViewItemDepth>[] => {
    const flattened: TreeViewBaseItem<TreeViewItemDepth>[] = [];

    const flatten = (node: TreeViewBaseItem<TreeViewItemDepth>, depth: number) => {
      flattened.push({ ...node, depth });
      if (node.children) {
        node.children.forEach(child => flatten(child, depth + 1));
      }
    }
    
    nodes.forEach(node => flatten(node, 0));
    return flattened;
  }, [expandedItems]);

  const flattenedItems = React.useMemo(() => getFlattenedNodes(items), [items, getFlattenedNodes]);
  // console.log(flattenedItems)

  const virtualizer = useWindowVirtualizer({
    count: flattenedItems.length,
    estimateSize: () => 55,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

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

  return (
    <Box ref={listRef}>
      <Box sx={{
        height: `${virtualizer.getTotalSize()}px`,
        width: '100%',
        position: 'relative',
      }}>
        <SimpleTreeView
          // expandedItems={getAllItemsWithChildrenItemIds(items)}
          // defaultExpandedItems={getAllItemsWithChildrenItemIds(items)}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const item = flattenedItems[virtualRow.index];
            return (
              <TreeItem
                key={item.id}
                id={item.id}
                itemId={item.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: virtualRow.size,
                  transform: `translateY(${virtualRow.start}px)`,
                  paddingLeft: `${(item.depth || 0) * 24}px`
                }}
              >
                {item.label}
              </TreeItem>
            );
          })}
        </SimpleTreeView>
      </Box>
    </Box>
  );
}

