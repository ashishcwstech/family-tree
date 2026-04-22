import { EdgeProps, useStore } from "@xyflow/react";

const NODE_WIDTH = 150;
const NODE_HEIGHT = 150;

export const MarriageEdge = ({ id, source, sourceY, target,targetY }: EdgeProps) => {
  const allNodes = useStore((s) => s.nodes);
  const allEdges = useStore((s) => s.edges);

  const sourceNode = allNodes.find((n) => n.id === source);
  const targetNode = allNodes.find((n) => n.id === target);
  if (!sourceNode || !targetNode) return null;

  

  // ✅ Always horizontal using node positions directly
  const sourceX = sourceNode.position.x + NODE_WIDTH;
  const targetX = targetNode.position.x;
  const lineY = (
    sourceNode.position.y + NODE_HEIGHT / 2 +
    targetNode.position.y + NODE_HEIGHT / 2
  ) / 2;
  const midX = (sourceX + targetX) / 2;
 // const dropY = sourceY + 120;

 // ✅ Stagger dropY for multiple marriages on same person
  const marriagesOfSource = allEdges.filter(
    (e) => e.data?.edgeType === "marriage" && e.source === source
  );
  const marriageIndex = marriagesOfSource.findIndex((e) => e.id === id);
  const dropY = lineY + 120 + marriageIndex * 50;

  
  // ✅ Filter children — supports parentId as string, string[], or marriageId
  const children = allNodes.filter((n) => {
    const parentId = (n.data as any).parentId;
    const marriageId = (n.data as any).marriageId;

    if (marriageId) return marriageId === id;                   // most specific
    if (Array.isArray(parentId)) return parentId.includes(source); // array
    return parentId === source;                                 // string fallback
  });

  const hasChildren = children.length > 0;

  return (
    <g>
     
      <path
        d={`M${sourceX},${sourceY} L${targetX},${targetY}`}
        fill="none"
        stroke="#e11d48"
        strokeWidth={2}
      />


       {/* ── Drop + branches — only when children exist ── */}
      {hasChildren && (
        <>
          <circle cx={midX} cy={lineY} r={4} fill="#e11d48" />
          <path
            d={`M${midX},${lineY} L${midX},${dropY}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2}
          />
          {/* ✅ Map over children — not childNodes */}
          {children.map((child) => {
            const childCenterX = child.position.x + NODE_WIDTH / 2;
            const childTopY = child.position.y;
            return (
              <path
                key={child.id}
                d={`M${midX},${dropY} L${childCenterX},${dropY} L${childCenterX},${childTopY}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            );
          })}
        </>
      )}
    </g>
  );
};

export const edgeTypes = { marriage: MarriageEdge };