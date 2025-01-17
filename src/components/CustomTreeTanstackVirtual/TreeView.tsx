import { CSSProperties } from "react";
import memoizeOne from "memoize-one";
import { TreeNode } from "./TreeNode";
// import { TreeViewItem } from "./TreeViewItem";
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import React from "react";
import { Avatar, Typography } from "@mui/material";

const getItemData = memoizeOne(
  (
    nodes: TreeNode[],
    onSelectedItem: (node: TreeNode) => void,
    onContextMenu: (node: TreeNode, event: React.MouseEvent) => void
  ) => ({
    nodes,
    onSelectedItem,
    onContextMenu,
  })
);

export interface TreeViewProps {
  id?: string;
  nodes: TreeNode[];
  onSelectedItem: (node: TreeNode) => void;
  onSelectEmptyArea?: () => void;
  onContextMenu?: (node: TreeNode, event: React.MouseEvent) => void;
  itemSize?: number;
  style?: CSSProperties | undefined;
}




export function TreeView(props: TreeViewProps) {
  const { id, onSelectedItem, nodes, onSelectEmptyArea, onContextMenu } = props;
  const fixedListClass = "TreeView-FixedList";
  const itemData = getItemData(
    nodes,
    onSelectedItem,
    onContextMenu ?? (() => {})
  );

  const listRef = React.useRef<HTMLDivElement | null>(null)

  const virtualizer = useWindowVirtualizer({
    count: 10000,
    estimateSize: () => 35,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
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
          {virtualizer.getVirtualItems().map((item) => {
            const currentNode = nodes[item.index];
            const left = currentNode.depth * 16;
            
            return (
            <div
              style={{
                left: `${left}px`,
                position: 'absolute',
                top: 0,
                width: '100%',
                height: `${item.size}px`,
                transform: `translateY(${
                  item.start - virtualizer.options.scrollMargin
                }px)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left',
              }}
            >
              <Avatar sx={{ width: 14, height: 14, fontSize: '0.5rem' }}>L3</Avatar>
              <Typography>{currentNode.label}</Typography>
            </div>
          )})}
        </div>
      </div>
    </>
  )
}
