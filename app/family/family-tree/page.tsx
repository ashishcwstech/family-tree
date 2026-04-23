"use client";
import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getLayoutedElements } from "@/lib/layout/dagreLayout";
import type { FamilyNode, FamilyEdge, CustomNodeProps } from "@/types/family";
import { edgeTypes } from "@/components/edges/marriageEdge";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLayoutedNodes, setTree } from "@/store/familySlice";


const CustomNode = ({ data }: CustomNodeProps) => {
  return (
    <div className="z-10 bg-surface-container-lowest p-4 rounded-xl shadow-[0px_8px_24px_rgba(44,47,49,0.06)] flex flex-col items-center w-36 hover:ring-2 hover:ring-primary transition-all cursor-pointer">
      {/* ✅ id="top" — matches targetHandle: "top" on child edges */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ opacity: 0
          
         }}
      />

      {/* ✅ id="spouse-out" — matches sourceHandle: "spouse-out" on marriage edge */}
       <Handle
          type="source"
          position={Position.Right}
          id="spouse-out"
          style={{
            background: "#e11d48",
            width: 10,
            height: 10,
            border: "2px solid white",
            borderRadius: "50%",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: data.spouseRole === "source" ? 1 : 0,
            pointerEvents: "none",
          }}
        />

      {/* ✅ id="spouse-in" — matches targetHandle: "spouse-in" on marriage edge */}
      <Handle
        type="target"
        position={Position.Left}
        id="spouse-in"
        style={{
          background: "#e11d48",
          width: 10,
          height: 10,
          border: "2px solid white",
          borderRadius: "50%",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: data.spouseRole === "target" ? 1 : 0,
          pointerEvents: "none",
        }}
      />

      <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-primary-container">
        <img
          className="w-full h-full object-cover"
          data-alt="portrait of an elderly man with kind eyes and gray hair in a soft indoor light setting"
          src={data.image || "/images/default-profile.png"}
        />
      </div>
      <span className="text-sm font-bold text-on-surface text-center">
        {data.label}
      </span>
      <span className="text-[10px] text-on-surface-variant font-medium mt-1">
        {data.subText}
      </span>
      <span className="text-[10px] text-on-surface-variant font-medium mt-1">
        {data.gender}
      </span>

      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ opacity: 0 }}
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function FamilyTreeLayout() {
  // const [nodes, setNodes] = useState<FamilyNode[]>(initialNodes);
  // const [edges, setEdges] = useState<FamilyEdge[]>(initialEdges);
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((s) => s.family.nodes);
  const edges = useAppSelector((s) => s.family.edges);

  const onNodesChange = useCallback(
    (changes: any[]) => {
      const updated = applyNodeChanges(changes, nodes);
      dispatch(setLayoutedNodes(updated as FamilyNode[]));
    },
    [nodes, dispatch],
  );

  const onEdgesChange = useCallback(
    (changes: any[]) => {
      const updated = applyEdgeChanges(changes, edges);
      dispatch(setTree({ nodes, edges: updated as FamilyEdge[] }));
    },
    [nodes, edges, dispatch],
  );

  useEffect(() => {
    const { nodes: ln, edges: le } = getLayoutedElements(nodes, edges);
    dispatch(setTree({ nodes: ln as FamilyNode[], edges: le as FamilyEdge[] }));
  }, []); // 👈 run once on mount

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          markerEnd: {
            type: "arrowclosed",
            color: "blue",
          },
          style: { stroke: "blue", strokeWidth: 2, strokeDasharray: "0" },
          type: "step",
          animated: true,
        }}
        //nodesDraggable={false}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
        fitView
      />
    </div>
  );
}
