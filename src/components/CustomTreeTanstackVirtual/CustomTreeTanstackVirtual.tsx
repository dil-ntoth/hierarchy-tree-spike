import React from 'react';
import { TreeView } from './TreeView';
import { nodeStore } from '../../store';
import { TreeNode } from './TreeNode';
import { v4 as uuidv4 } from 'uuid';
import { Box } from '@mui/material';

export function CustomTreeTanstackVirtual() {
  // const items: TreeNode[] = [];
  function generateTreeData(
    parentsPerLevel = 3,
    childrenPerParent = 2
  ): TreeNode[] {
    const nodes: TreeNode[] = [];
    
    // Add root
    const rootId = uuidv4();
    nodes.push({ 
      id: rootId, 
      label: 'Root', 
      parentId: null,
      depth: 0,
      type: 'orgUnit',
      coveredByParent: false,
      isMerged: false,
      isDisabled: false,
    });
  
    // Add second level (parents)
    for (let i = 0; i < parentsPerLevel; i++) {
      const parentId = uuidv4();
      nodes.push({
        id: parentId,
        label: `Parent ${i + 1}`,
        parentId: rootId,
        depth: 1,
        auditableEntityName: 'AU name',
        type: 'orgUnit',
        coveredByParent: false,
        isMerged: false,
        isDisabled: false,
      });
  
      // Add third level (children)
      for (let j = 0; j < childrenPerParent; j++) {
        nodes.push({
          id: uuidv4(),
          label: `Child ${i + 1}-${j + 1}`,
          parentId: parentId,
          isLeaf: true,
          depth: 2,
          // auditableEntityName: 'AU name',
          type: 'process',
          coveredByParent: false,
          isMerged: false,
          isDisabled: false,
        });
      }
    }
  
    return nodes;
  }

  // const items = generateTreeData(332, 12);

  const [items, setItems] = React.useState<TreeNode[]>(generateTreeData(332, 12));



  function findAllDescendants(parentId: string, items: TreeNode[]): TreeNode[] {
    const descendants: TreeNode[] = [];
    
    // Find direct children
    const children = items.filter(item => item.parentId === parentId);
    
    // Add children to descendants
    descendants.push(...children);
    
    // Recursively find descendants of each child
    children.forEach(child => {
      const childDescendants = findAllDescendants(child.id, items);
      descendants.push(...childDescendants);
    });
    
    return descendants;
  }

  // function insertNewChildNode(parentId: string, items: TreeNode[]): TreeNode[] {
  //   // Create new node
  //   const newNodeId = uuidv4();
  //   const parentNode = items.find(item => item.id === parentId);
    
  //   if (!parentNode) return items;
  
  //   // Get all current children
  //   const children = items.filter(item => item.parentId === parentId);
    
  //   // Create new intermediate node
  //   const newNode: TreeNode = {
  //     id: newNodeId,
  //     label: 'New Node',
  //     parentId: parentId,
  //     isLeaf: false,
  //     depth: (parentNode.depth || 0) + 1,
  //     type: 'process',
  //     coveredByParent: false,
  //     isMerged: false,
  //     isDisabled: false,
  //   };
  
  //   // Update parent references of existing children
  //   const updatedItems = items.map(item => 
  //     item.parentId === parentId
  //       ? { ...item, parentId: newNodeId, depth: (item.depth || 0) + 1 }
  //       : item
  //   );
  
  //   // Add new node to items
  //   return [...updatedItems, newNode];
  // }
  function insertNewChildNode(parentId: string, items: TreeNode[]): TreeNode[] {
    const parentNode = items.find(item => item.id === parentId);
    if (!parentNode) return items;
  
    const parentIndex = items.findIndex(item => item.id === parentId);
    const descendants = findAllDescendants(parentId, items);
    
    // Create new intermediate node
    const newNode: TreeNode = {
      id: uuidv4(),
      label: 'New Node',
      parentId: parentId,
      isLeaf: false,
      depth: (parentNode.depth || 0) + 1,
      type: 'process',
      coveredByParent: false,
      isMerged: false,
      isDisabled: false,
    };
  
    // Update descendants' parent reference and depth
    const updatedDescendants = descendants.map(item => ({
      ...item,
      parentId: newNode.id,
      depth: (item.depth || 0) + 1
    }));
  
    // Create new array with correct order
    const beforeParent = items.slice(0, parentIndex + 1);
    const afterDescendants = items.filter(item => 
      !descendants.find(d => d.id === item.id) && 
      item.id !== parentId
    );
  
    return [
      ...beforeParent,
      newNode,
      ...updatedDescendants,
      ...afterDescendants.filter(item => item.id !== newNode.id)
    ];
  }

  function onSelectHandler(node: TreeNode) {
    // console.log(node);
    // console.log(items.find((item) => item.id === node.id));
    // const descendants = findAllDescendants(node.id, items);
    // console.log(descendants);
    // TODO: Find all descendants of the selected node
    setItems(prevItems => insertNewChildNode(node.id, prevItems));
  }

  return (
    <>
      <h1>CustomMuiTree</h1>
      <TreeView nodes={items} onSelectedItem={onSelectHandler} itemSize={64} />
    </>
  );
}
