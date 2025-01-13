import { useSyncExternalStore } from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { nodeStore } from '../../store';

export function MuiTreeView() {
  const items = useSyncExternalStore(nodeStore.subscribe, nodeStore.getSnapshot);

  return <RichTreeView items={items} slots={{ item: TreeItem2 }} />;
}

