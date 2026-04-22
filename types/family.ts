import type { Node, Edge } from "@xyflow/react";

export type PersonData = {
  label: string;
  subText: string;
  image: string | null;
  parentId?: string | string[] | null;
  marriageId?: string; // optional link to a specific marriage edge
  description: string;
  gender:string;
  spouseRole?: "source" | "target" | null;
};

export type FamilyNode = Node<PersonData>;
export type FamilyEdge = Edge;

export type CustomNodeProps = {
  data: PersonData;
};