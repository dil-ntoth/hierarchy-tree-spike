import { CSSProperties } from "react";
import memoizeOne from "memoize-one";
import { TreeNode } from "./TreeNode";
// import { TreeViewItem } from "./TreeViewItem";
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import React from "react";
import { Avatar, Button, Typography } from "@mui/material";
import { TreeItem } from "./TreeItem";

const getItemData = memoizeOne(
  (
    nodes: TreeNode[],
    onSelectedItem: (node: TreeNode) => void,
  ) => ({
    nodes,
    onSelectedItem,
  })
);

export interface TreeViewProps {
  id?: string;
  nodes: TreeNode[];
  onSelectedItem: (node: TreeNode) => void;
  itemSize?: number;
  style?: CSSProperties | undefined;
}




export function TreeView(props: TreeViewProps) {
  const { id, onSelectedItem, nodes } = props;
  const fixedListClass = "TreeView-FixedList";
  const itemData = getItemData(
    nodes,
    onSelectedItem,
  );

  const listRef = React.useRef<HTMLDivElement | null>(null)

  const virtualizer = useWindowVirtualizer({
    count: nodes.length,
    estimateSize: () => 35,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    // debug: true,
  })

  return (
    <>
      <div ref={listRef} className="List">
      <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((item) => 
            <TreeItem 
              currentNode={nodes[item.index]} 
              item={item} 
              key={item.key} 
              onSelectedItem={onSelectedItem} 
              virtualizer={virtualizer} 
            />
          )}
        </div>
      </div>
    </>
  )
}
