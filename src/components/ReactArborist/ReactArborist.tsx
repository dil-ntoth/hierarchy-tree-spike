const data = [
  { id: "1", name: "Unread" },
  { id: "2", name: "Threads" },
  {
    id: "3",
    name: "Chat Rooms",
    children: [
      { id: "c1", name: "General" },
      { id: "c2", name: "Random" },
      { id: "c3", name: "Open Source Projects" },
    ],
  },
  {
    id: "4",
    name: "Direct Messages",
    children: [
      { id: "d1", name: "Alice" },
      { id: "d2", name: "Bob" },
      { id: "d3", name: "Charlie" },
    ],
  },
];

import { Tree } from 'react-arborist';
import { nodeStore } from '../../store'; 
import { useSyncExternalStore } from 'react';

export function ReactArborist() {
  const items = useSyncExternalStore(nodeStore.subscribe, nodeStore.getSnapshot);
  
  return (
    <Tree initialData={items} height={1000}>
      {Node}
    </Tree>
  )
}


function Node({ node, style, dragHandle}) {
  
  return (
    <div style={style} ref={dragHandle}>
      {node.isLeaf ? "*" : '[]'}
      {node.data.label}
    </div>
  )
}
