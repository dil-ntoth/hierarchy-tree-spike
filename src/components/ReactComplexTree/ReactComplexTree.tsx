import React from 'react';
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';

import 'react-complex-tree/lib/style-modern.css';

import { v4 as uuidv4 } from 'uuid';

function generateRandomTreeData(depth = 3, maxChildren = 5) {
  const items: Record<string, any> = {
    root: {
      index: 'root',
      canMove: true,
      isFolder: true,
      children: [],
      data: 'Root item',
      canRename: true,
    }
  };

  function createNode(currentDepth: number, parentId: string | null = null): string {
    const nodeId = uuidv4();
    const isFolder = currentDepth > 0;
    const numChildren = isFolder ? Math.floor(Math.random() * maxChildren) : 0;
    const children: string[] = [];

    if (currentDepth > 0) {
      for (let i = 0; i < numChildren; i++) {
        const childId = createNode(currentDepth - 1, nodeId);
        children.push(childId);
      }
    }

    items[nodeId] = {
      index: nodeId,
      canMove: false,
      isFolder,
      children,
      data: `Item ${nodeId.slice(0, 6)}`,
      canRename: true,
    };

    return nodeId;
  }

  // Create first level children for root
  const numRootChildren = Math.floor(Math.random() * 1000) + 1;
  for (let i = 0; i < numRootChildren; i++) {
    const childId = createNode(depth - 1, 'root');
    items.root.children.push(childId);
  }

  return items;
}

export function ReactComplexTree() {

  // const items = {
  //   root: {
  //     index: 'root',
  //     canMove: true,
  //     isFolder: true,
  //     children: ['child1', 'child2'],
  //     data: 'Root item',
  //     canRename: true,
  //   },
  //   child1: {
  //     index: 'child1',
  //     canMove: true,
  //     isFolder: true,
  //     children: ['child3'],
  //     data: 'Child item 1',
  //     canRename: true,
  //   },
  //   child2: {
  //     index: 'child2',
  //     canMove: true,
  //     isFolder: false,
  //     children: [],
  //     data: 'Child item 2',
  //     canRename: true,
  //   },
  //   child3: {
  //     index: 'child3',
  //     canMove: true,
  //     isFolder: false,
  //     children: [],
  //     data: 'Child item 2',
  //     canRename: true,
  //   },
  // };
  const items = generateRandomTreeData(3, 8);
  // console.log( items )
  // const [expanded, setExpanded] = React.useState<string[]>([]);
  const getAllNodeIds = React.useCallback((items: Record<string, any>): string[] => {
    const nodeIds: string[] = [];
    
    Object.keys(items).forEach(key => {
      nodeIds.push(key);
      if (items[key].children && items[key].children.length > 0) {
        items[key].children.forEach((childId: string) => {
          if (items[childId]) {
            nodeIds.push(childId);
          }
        });
      }
    });
    
    return nodeIds;
  }, []);

  // React.useEffect(() => {
  //   const allNodes = getAllNodeIds(items);
  //   setExpanded(allNodes);
  // }, [items]);

  const dataProvider = new StaticTreeDataProvider(items, (item, newName) => ({ ...item, data: newName }));

  return (
    <UncontrolledTreeEnvironment
      dataProvider={dataProvider}
      getItemTitle={item => item.data}
      canDragAndDrop={true}
      canDropOnFolder={true}
      canReorderItems={true}
      viewState={{ 'tree-1': { expandedItems: [] } }}
    >
      <Tree  treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  )
}
