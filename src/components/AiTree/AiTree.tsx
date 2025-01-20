import MUIVirtualTree from "./VirtualTree";
import VirtualTree from "./VirtualTree";

// const treeData = [
//   {
//     id: '1',
//     label: 'Root',
//     children: [
//       {
//         id: '1-1',
//         label: 'Child 1',
//         children: [
//           { id: '1-1-1', label: 'Grandchild 1' },
//           { id: '1-1-2', label: 'Grandchild 2' }
//         ]
//       },
//       {
//         id: '1-2',
//         label: 'Child 2',
//         children: [
//           { id: '1-2-1', label: 'Grandchild 3' }
//         ]
//       }
//     ]
//   }
// ];
import { v4 as uuidv4 } from 'uuid';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

function generateHierarchicalTreeData(
  maxDepth: number = 3,
  childrenPerNode: number = 4,
  totalNodes: number = 1000
) {
  let nodeCount = 0;

  function generateNode(depth: number): TreeNode | null {
    if (nodeCount >= totalNodes) return null;
    if (depth === 0) return null;

    const node: TreeNode = {
      id: uuidv4(),
      label: `Node ${nodeCount}`,
      children: []
    };
    nodeCount++;

    const childCount = Math.min(
      childrenPerNode,
      Math.floor((totalNodes - nodeCount) / depth)
    );

    for (let i = 0; i < childCount; i++) {
      const childNode = generateNode(depth - 1);
      if (childNode) {
        node.children?.push(childNode);
      }
    }

    return node;
  }

  return [generateNode(maxDepth)];
}

// Usage:
const treeData = generateHierarchicalTreeData(3, 53, 10000) as TreeNode[];
  
export function AiTree() {
  console.log('treeData:', treeData);
  // return (
  //   <VirtualTree
  //     data={treeData}
  //     defaultExpanded={true}
  //     onNodeClick={(node) => console.log('Clicked:', node)}
  //   />
  // );
  return (
    <MUIVirtualTree data={treeData} defaultExpanded={true} onNodeClick={(node) => console.log('Clicked:', node)} />
  )
}