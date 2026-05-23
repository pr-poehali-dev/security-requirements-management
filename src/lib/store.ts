import { create } from 'zustand';
import { OrgDomain, TechDomain, Requirement, Technology, User, ItemStatus } from './types';
import {
  MOCK_ORG_DOMAINS,
  MOCK_TECH_DOMAINS,
  MOCK_REQUIREMENTS,
  MOCK_TECHNOLOGIES,
  MOCK_USERS,
} from './mockData';

function nextVersion(current: string): string {
  const parts = current.split('.');
  const minor = parseInt(parts[1] || '0', 10) + 1;
  return `${parts[0]}.${minor}`;
}

function nowStr() {
  return new Date().toISOString().slice(0, 10);
}

interface AppState {
  currentUser: User | null;
  orgDomains: OrgDomain[];
  techDomains: TechDomain[];
  requirements: Requirement[];
  technologies: Technology[];

  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Org Domains
  addOrgDomain: (data: Omit<OrgDomain, 'id' | 'numericId' | 'version' | 'versionHistory' | 'createdAt' | 'updatedAt'>) => OrgDomain;
  updateOrgDomain: (id: string, data: Partial<Pick<OrgDomain, 'name' | 'owner' | 'status' | 'description'>>) => void;
  deleteOrgDomain: (id: string) => void;

  // Tech Domains
  addTechDomain: (data: Omit<TechDomain, 'id' | 'numericId' | 'version' | 'versionHistory' | 'createdAt' | 'updatedAt'>) => TechDomain;
  updateTechDomain: (id: string, data: Partial<Pick<TechDomain, 'name' | 'owner' | 'status' | 'description' | 'orgDomains'>>) => void;
  deleteTechDomain: (id: string) => void;

  // Requirements
  addRequirement: (data: Omit<Requirement, 'id' | 'numericId' | 'version' | 'versionHistory' | 'createdAt' | 'updatedAt'>) => Requirement;
  updateRequirement: (id: string, data: Partial<Pick<Requirement, 'name' | 'owner' | 'status' | 'description'>>) => void;
  deleteRequirement: (id: string) => void;

  // Technologies
  addTechnology: (data: Omit<Technology, 'id' | 'numericId' | 'version' | 'versionHistory' | 'createdAt' | 'updatedAt'>) => Technology;
  updateTechnology: (id: string, data: Partial<Pick<Technology, 'name' | 'owner' | 'status' | 'description' | 'tags'>>) => void;
  deleteTechnology: (id: string) => void;
}

// Simple password store (in real app - hashed, stored in DB)
const PASSWORDS: Record<string, string> = {
  admin: 'admin',
  test: 'test',
};

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  orgDomains: MOCK_ORG_DOMAINS,
  techDomains: MOCK_TECH_DOMAINS,
  requirements: MOCK_REQUIREMENTS,
  technologies: MOCK_TECHNOLOGIES,

  login: (username, password) => {
    const user = MOCK_USERS.find(u => u.username === username);
    if (user && PASSWORDS[username] === password) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },
  logout: () => set({ currentUser: null }),

  // ─── Org Domains ───
  addOrgDomain: (data) => {
    const state = get();
    const numericId = Math.max(0, ...state.orgDomains.map(d => d.numericId)) + 1;
    const newItem: OrgDomain = {
      ...data,
      id: `org-dom-${numericId}`,
      numericId,
      version: '1.0',
      versionHistory: [{ version: '1.0', changedAt: nowStr(), changedBy: state.currentUser?.username ?? 'system', comment: 'Создание' }],
      createdAt: nowStr(),
      updatedAt: nowStr(),
    };
    set(s => ({ orgDomains: [...s.orgDomains, newItem] }));
    return newItem;
  },
  updateOrgDomain: (id, data) => {
    set(s => ({
      orgDomains: s.orgDomains.map(item => {
        if (item.id !== id) return item;
        const newVer = nextVersion(item.version);
        return {
          ...item,
          ...data,
          version: newVer,
          updatedAt: nowStr(),
          versionHistory: [...item.versionHistory, { version: newVer, changedAt: nowStr(), changedBy: s.currentUser?.username ?? 'system', comment: 'Редактирование' }],
        };
      }),
    }));
  },
  deleteOrgDomain: (id) => set(s => ({ orgDomains: s.orgDomains.filter(x => x.id !== id) })),

  // ─── Tech Domains ───
  addTechDomain: (data) => {
    const state = get();
    const numericId = Math.max(0, ...state.techDomains.map(d => d.numericId)) + 1;
    const newItem: TechDomain = {
      ...data,
      id: `tech-dom-${numericId}`,
      numericId,
      version: '1.0',
      versionHistory: [{ version: '1.0', changedAt: nowStr(), changedBy: state.currentUser?.username ?? 'system', comment: 'Создание' }],
      createdAt: nowStr(),
      updatedAt: nowStr(),
    };
    set(s => ({ techDomains: [...s.techDomains, newItem] }));
    return newItem;
  },
  updateTechDomain: (id, data) => {
    set(s => ({
      techDomains: s.techDomains.map(item => {
        if (item.id !== id) return item;
        const newVer = nextVersion(item.version);
        return {
          ...item,
          ...data,
          version: newVer,
          updatedAt: nowStr(),
          versionHistory: [...item.versionHistory, { version: newVer, changedAt: nowStr(), changedBy: s.currentUser?.username ?? 'system', comment: 'Редактирование' }],
        };
      }),
    }));
  },
  deleteTechDomain: (id) => set(s => ({ techDomains: s.techDomains.filter(x => x.id !== id) })),

  // ─── Requirements ───
  addRequirement: (data) => {
    const state = get();
    const numericId = Math.max(0, ...state.requirements.map(d => d.numericId)) + 1;
    const newItem: Requirement = {
      ...data,
      id: `req-${numericId}`,
      numericId,
      version: '1.0',
      versionHistory: [{ version: '1.0', changedAt: nowStr(), changedBy: state.currentUser?.username ?? 'system', comment: 'Создание' }],
      createdAt: nowStr(),
      updatedAt: nowStr(),
    };
    set(s => ({ requirements: [...s.requirements, newItem] }));
    return newItem;
  },
  updateRequirement: (id, data) => {
    set(s => ({
      requirements: s.requirements.map(item => {
        if (item.id !== id) return item;
        const newVer = nextVersion(item.version);
        return {
          ...item,
          ...data,
          version: newVer,
          updatedAt: nowStr(),
          versionHistory: [...item.versionHistory, { version: newVer, changedAt: nowStr(), changedBy: s.currentUser?.username ?? 'system', comment: 'Редактирование' }],
        };
      }),
    }));
  },
  deleteRequirement: (id) => set(s => ({ requirements: s.requirements.filter(x => x.id !== id) })),

  // ─── Technologies ───
  addTechnology: (data) => {
    const state = get();
    const numericId = Math.max(0, ...state.technologies.map(d => d.numericId)) + 1;
    const newItem: Technology = {
      ...data,
      id: `tech-${numericId}`,
      numericId,
      version: '1.0',
      versionHistory: [{ version: '1.0', changedAt: nowStr(), changedBy: state.currentUser?.username ?? 'system', comment: 'Создание' }],
      createdAt: nowStr(),
      updatedAt: nowStr(),
    };
    set(s => ({ technologies: [...s.technologies, newItem] }));
    return newItem;
  },
  updateTechnology: (id, data) => {
    set(s => ({
      technologies: s.technologies.map(item => {
        if (item.id !== id) return item;
        const newVer = nextVersion(item.version);
        return {
          ...item,
          ...data,
          version: newVer,
          updatedAt: nowStr(),
          versionHistory: [...item.versionHistory, { version: newVer, changedAt: nowStr(), changedBy: s.currentUser?.username ?? 'system', comment: 'Редактирование' }],
        };
      }),
    }));
  },
  deleteTechnology: (id) => set(s => ({ technologies: s.technologies.filter(x => x.id !== id) })),
}));
