

import { Tree } from 'react-arborist';
import { nodeStore } from '../../store'; 
import { useSyncExternalStore } from 'react';
import useResizeObserver from "use-resize-observer";


export function ReactArborist() {
  const { ref, width, height } = useResizeObserver();
  const items = useSyncExternalStore(nodeStore.subscribe, nodeStore.getSnapshot);

  return (
    <div style={{ height: "100vh", width: "100vw" }} ref={ref}>
        <Tree initialData={items} height={height} width={width} >
          {Node}
        </Tree>
    </div>
  )
}


function Node({ node, style, dragHandle}) {
  
  return (
    <div style={style} ref={dragHandle}>
      {/* {node.isLeaf ? "*" : '[]'} */}
      {node.data.label}
    </div>
  )
}
