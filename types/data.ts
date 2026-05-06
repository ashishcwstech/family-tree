export interface Datum {
  id: string;
  data: {
    gender: 'M' | 'F';
    [key: string]: any;
  };
  rels: {
    parents: string[];
    spouses: string[];
    children: string[];
  };
  [key: string]: any;
}

export type Data = Datum[];

export interface FamilyNode {
  id: string;
  data: {
    firstName?: string;
    lastName?: string;
    gender?: string;
    birthday?: string;
    avatar?: string;
  };
  rels?: {
    parents?: string[];
    children?: string[];
    spouses?: string[];
  };
}