import React from 'react';
import { TreeView } from './TreeView';
import { nodeStore } from '../../store';
import { TreeNode } from './TreeNode';
import { v4 as uuidv4 } from 'uuid';
import { Box } from '@mui/material';

export function CustomTreeReactWindow() {
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
      depth: 0
    });
  
    // Add second level (parents)
    for (let i = 0; i < parentsPerLevel; i++) {
      const parentId = uuidv4();
      nodes.push({
        id: parentId,
        label: `Parent ${i + 1}`,
        parentId: rootId,
        depth: 1
      });
  
      // Add third level (children)
      for (let j = 0; j < childrenPerParent; j++) {
        nodes.push({
          id: uuidv4(),
          label: `Child ${i + 1}-${j + 1}`,
          parentId: parentId,
          isLeaf: true,
          depth: 2
        });
      }
    }
  
    return nodes;
  }

  const items = generateTreeData(332, 12);

  return (
    <Box sx={{
      // height: '100%',
      // display: 'flex',
      // alignItems: 'center',
      // pl: 1,
      // pr: 1,
  }}>
      <h1>CustomTree</h1>
      <Box sx={{
                // pt: 1,
                // height: `calc(100% - 8px)`,
                display: 'flex',
                height: '100vh',
            }}>
        <TreeView nodes={items} onSelectedItem={(item) => { console.log(item) }} itemSize={64} />
      </Box>
    </Box>
  );
}