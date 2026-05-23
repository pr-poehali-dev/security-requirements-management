export type ItemStatus = 'Активен' | 'В разработке' | 'Не активен' | 'В архиве';

export interface VersionEntry {
  version: string;
  changedAt: string;
  changedBy: string;
  comment?: string;
}

export interface OrgDomain {
  id: string;
  numericId: number;
  name: string;
  version: string;
  owner: string;
  status: ItemStatus;
  description: string;
  versionHistory: VersionEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface TechDomain {
  id: string;
  numericId: number;
  name: string;
  version: string;
  owner: string;
  status: ItemStatus;
  description: string;
  orgDomains: string[];
  versionHistory: VersionEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Requirement {
  id: string;
  numericId: number;
  name: string;
  version: string;
  owner: string;
  status: ItemStatus;
  description: string;
  versionHistory: VersionEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Technology {
  id: string;
  numericId: number;
  name: string;
  version: string;
  owner: string;
  status: ItemStatus;
  description: string;
  tags: string[];
  versionHistory: VersionEntry[];
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'administrator' | 'user';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  displayName: string;
}

export type SectionType = 'org-domains' | 'tech-domains' | 'requirements' | 'technologies';
