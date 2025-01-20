import React, { useState, useCallback, useMemo } from 'react';
import { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual';
// import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Box } from '@mui/material';

// Types
type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
};

type FlattenedNode = TreeNode & {
  depth: number;
  isLeaf: boolean;
  isLast: boolean;
};

// Component Props
type TreeProps = {
  data: TreeNode[];
  defaultExpanded?: boolean;
  onNodeClick?: (node: TreeNode) => void;
  className?: string;
};

export const VirtualTree = ({
  data,
  defaultExpanded = false,
  onNodeClick,
  className = ''
}: TreeProps) => {
  // State for expanded nodes
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    if (!defaultExpanded) return new Set();
    const expanded = new Set<string>();
    const addAllNodes = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        expanded.add(node.id);
        if (node.children) addAllNodes(node.children);
      });
    };
    addAllNodes(data);
    return expanded;
  });

  // Track the currently focused node for keyboard navigation
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

  // Toggle node expansion
  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // Flatten tree for virtualization
  const flattenedNodes = useMemo(() => {
    const flattened: FlattenedNode[] = [];

    const traverse = (
      nodes: TreeNode[],
      depth: number,
      parentExpanded: boolean = true
    ) => {
      nodes.forEach((node, index) => {
        if (!parentExpanded) return;

        const isLeaf = !node.children || node.children.length === 0;
        const isLast = index === nodes.length - 1;

        flattened.push({
          ...node,
          depth,
          isLeaf,
          isLast
        });

        if (node.children && expandedNodes.has(node.id)) {
          traverse(node.children, depth + 1, true);
        }
      });
    };

    traverse(data, 0);
    return flattened;
  }, [data, expandedNodes]);

  // Virtual list configuration
  const parentRef = React.useRef<HTMLDivElement>(null);
  // const rowVirtualizer = useVirtualizer({
  //   count: flattenedNodes.length,
  //   overscan: 10,
  //   getScrollElement: () => parentRef.current,
  //   estimateSize: useCallback(() => 36, []),
  // });

  const rowVirtualizer = useWindowVirtualizer({
    count: flattenedNodes.length,
    estimateSize: () => 35,
    overscan: 5,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  })

  // Keyboard navigation handlers
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, node: FlattenedNode) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = flattenedNodes.findIndex(n => n.id === node.id) + 1;
          if (nextIndex < flattenedNodes.length) {
            setFocusedNodeId(flattenedNodes[nextIndex].id);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = flattenedNodes.findIndex(n => n.id === node.id) - 1;
          if (prevIndex >= 0) {
            setFocusedNodeId(flattenedNodes[prevIndex].id);
          }
          break;
        case 'ArrowRight':
          if (!node.isLeaf && !expandedNodes.has(node.id)) {
            toggleNode(node.id);
          }
          break;
        case 'ArrowLeft':
          if (!node.isLeaf && expandedNodes.has(node.id)) {
            toggleNode(node.id);
          }
          break;
        case 'Enter':
          if (onNodeClick) {
            onNodeClick(node);
          }
          break;
      }
    },
    [flattenedNodes, expandedNodes, toggleNode, onNodeClick]
  );

  return (
    <Box
    ref={parentRef}
    sx={{
      height: '24rem',
      overflow: 'auto',
      border: 1,
      borderRadius: 1,
      borderColor: 'divider',
    }}
    tabIndex={0}
  >
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: `${rowVirtualizer.getTotalSize()}px`
      }}
    >
        {rowVirtualizer.getVirtualItems().map(virtualRow => {
          const node = flattenedNodes[virtualRow.index];
          const isExpanded = expandedNodes.has(node.id);
          const isFocused = focusedNodeId === node.id;

          return (
            <div
              key={node.id}
              className={`absolute top-0 left-0 w-full ${
                isFocused ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              <div
                role="button"
                tabIndex={0}
                className="flex items-center h-9 px-2 focus:outline-none focus:bg-blue-50"
                style={{ paddingLeft: `${node.depth * 20 + 8}px` }}
                onClick={() => {
                  if (!node.isLeaf) toggleNode(node.id);
                  if (onNodeClick) onNodeClick(node);
                }}
                onKeyDown={e => handleKeyDown(e, node)}
              >
                {!node.isLeaf ? (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleNode(node.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {isExpanded ? (
                      <ExpandMoreIcon />
                    ) : (
                      <ChevronRightIcon  />
                    )}
                  </button>
                ) : (
                  <span className="w-6" />
                )}
                {node.isLeaf ? (
                  <InsertDriveFileIcon className="w-4 h-4 mr-2 text-gray-500" />
                ) : (
                  <FolderIcon className="w-4 h-4 mr-2 text-blue-500" />
                )}
                <span className="truncate">{node.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualTree;