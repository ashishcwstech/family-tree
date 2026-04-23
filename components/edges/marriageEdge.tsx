import { EdgeProps, useStore } from "@xyflow/react";

const NODE_WIDTH = 150;
const NODE_HEIGHT = 150;

export const MarriageEdge = ({
  id,
  source,
  sourceY,
  target,
  targetY,
}: EdgeProps) => {
  const allNodes = useStore((s) => s.nodes);
  const allEdges = useStore((s) => s.edges);
  const nodeLookup = useStore((s) => s.nodeLookup);

  const sourceNode = allNodes.find((n) => n.id === source);
  const targetNode = allNodes.find((n) => n.id === target);
  if (!sourceNode || !targetNode) return null;

  // ✅ Always horizontal using node positions directly
  const sourceX = sourceNode.position.x + NODE_WIDTH;
  const targetX = targetNode.position.x;
  const lineY =
    (sourceNode.position.y +
      NODE_HEIGHT / 2 +
      targetNode.position.y +
      NODE_HEIGHT / 2) /
    2;
  const midX = (sourceX + targetX) / 2;
  // const dropY = sourceY + 120;

  // ✅ Stagger dropY for multiple marriages on same person
  const marriagesOfSource = allEdges.filter(
    (e) => e.data?.edgeType === "marriage" && e.source === source,
  );
  const marriageIndex = marriagesOfSource.findIndex((e) => e.id === id);
  const dropY = lineY + 120 + marriageIndex * 50;

  // ✅ Filter children — supports parentId as string, string[], or marriageId
  const children = allNodes.filter((n) => {
    const parentId = (n.data as any).parentId;
    const marriageId = (n.data as any).marriageId;

    
    if (marriageId) return marriageId === id;

    if (Array.isArray(parentId) && parentId.length > 0) {
      return true;
    }

    return false;
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
          {/* <circle cx={midX} cy={lineY} r={4} fill="#e11d48" /> */}
       
          {children.map((child) => {
            const childCenterX = child.position.x + NODE_WIDTH / 2;
            const childTopY = child.position.y;

            const parentIds = (child.data as any).parentId || [];

            // 👉 SINGLE PARENT
            console.log((child.data as any).parentId);
            if (parentIds.length === 1) {
              const parentNode = allNodes.find((n) => n.id === parentIds[0]);
              console.log('parentNode',parentNode);
              if (!parentNode) return null;

              const parentCenterX = parentNode.position.x + NODE_WIDTH / 2;
              const parentBottomY = parentNode.position.y + NODE_HEIGHT;

              return (
                <path
                  key={child.id}
                  d={`M${parentCenterX},${parentBottomY} L${childCenterX},${childTopY}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              );
            }

            // 👉 TWO PARENTS (existing logic)
            const fatherX = sourceNode.position.x + NODE_WIDTH / 2;
            const motherX = targetNode.position.x + NODE_WIDTH / 2;
            return (
              <g key={child.id}>
                {/* 👨 Father → child */}
                <path
                  d={`M${fatherX},${sourceY} L${fatherX},${dropY} L${childCenterX},${dropY} L${childCenterX},${childTopY}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />

                {/* 👩 Mother → child */}
                <path
                  d={`M${motherX},${targetY} L${motherX},${dropY} L${childCenterX},${dropY} L${childCenterX},${childTopY}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </g>
            );
          })}
        </>
      )}
    </g>
  );
};

export const edgeTypes = { marriage: MarriageEdge };
