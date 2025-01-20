import { Avatar, Button, Typography } from "@mui/material";
import { TreeNode } from "./TreeNode";
import { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import React from "react";

interface Props {
  item: VirtualItem;
  currentNode: TreeNode;
  virtualizer: Virtualizer<Window, Element>;
  onSelectedItem: (node: TreeNode) => void;
  selected: boolean;
}

export function TreeItem({ 
  currentNode, 
  item, 
  onSelectedItem,
  virtualizer,
  selected = false,
}: Props) {
  const left = currentNode.depth * 16;

  return (
    <div
      key={item.key}
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
        // backgroundColor: isSelected ? 'lightblue' : 'white',
      }}
      // onClick={() => setIsSelected(prev => !prev)}
    >
      <Avatar sx={{ width: 14, height: 14, fontSize: '0.5rem' }}>{currentNode.type === 'process' ? 'P' : `L${currentNode.depth + 1}`}</Avatar>
      <Typography>{currentNode.label}</Typography>
      <Button onClick={() => onSelectedItem(currentNode)}>Select</Button>
    </div>
  )
}
