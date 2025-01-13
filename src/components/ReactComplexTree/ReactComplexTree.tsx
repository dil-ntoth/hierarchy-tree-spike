import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';

import 'react-complex-tree/lib/style-modern.css';

export function ReactComplexTree() {

  const items = {
  root: {
    index: 'root',
    canMove: true,
    isFolder: true,
    children: ['child1', 'child2'],
    data: 'Root item',
    canRename: true,
  },
  child1: {
    index: 'child1',
    canMove: true,
    isFolder: false,
    children: [],
    data: 'Child item 1',
    canRename: true,
  },
  child2: {
    index: 'child2',
    canMove: true,
    isFolder: false,
    children: [],
    data: 'Child item 2',
    canRename: true,
  },
  };

  const dataProvider = new StaticTreeDataProvider(items, (item, newName) => ({ ...item, data: newName }));

  return (
    <UncontrolledTreeEnvironment
      dataProvider={dataProvider}
      getItemTitle={item => item.data}
      viewState={{}}
      canDragAndDrop={true}
      canDropOnFolder={true}
      canReorderItems={true}
    >
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  )
}
