import type { Node, Edge } from "@xyflow/react";

export type PersonData = {
  label: string;
  subText: string;
  image: string | null;
  parentIds?: string | string[] | null;
  childernDetails? :any | null;
  generatedParents?: boolean; //for default parent
  parentMarriageId?: string; // optional link to a specific marriage edge
  description: string;
  gender:string;
  spouseRole?: "source" | "target" | null;
};

export type FamilyNode = Node<PersonData>;
export type FamilyEdge = Edge;

export type CustomNodeProps = {
  data: PersonData;
};