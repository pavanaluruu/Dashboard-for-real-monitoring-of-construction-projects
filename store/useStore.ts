import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StateCreator } from "zustand";

export interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  department: string;
  position: string;
  dateOfBirth: string;
  dateOfJoining: string;
  contactNumber: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  qualifications: string[];
  certifications: {
    name: string;
    issuedDate: string;
    expiryDate: string;
    issuingAuthority: string;
  }[];
  workSchedule: {
    shift: "morning" | "afternoon" | "night";
    workingHours: string;
    daysOff: string[];
  };
  salary: {
    basic: number;
    allowances: number;
    deductions: number;
    netSalary: number;
  };
  attendance: {
    totalDays: number;
    present: number;
    absent: number;
    late: number;
  };
  performance: {
    lastReviewDate: string;
    rating: number;
    feedback: string;
  };
  documents: {
    type: string;
    number: string;
    expiryDate: string;
    issuingAuthority: string;
  }[];
}

export interface SiteInfo {
  id: string;
  name: string;
  location: string;
  projectType: string;
  startDate: string;
  expectedCompletionDate: string;
  totalWorkers: number;
  safetyCompliance: number;
  lastUpdated: string;
  siteManager: {
    name: string;
    contactNumber: string;
  };
  emergencyContacts: {
    name: string;
    role: string;
    contactNumber: string;
  }[];
  safetyOfficer: {
    name: string;
    contactNumber: string;
    certificationNumber: string;
  };
  siteStatus: "active" | "completed" | "on-hold";
  workHours: {
    start: string;
    end: string;
    breakTimes: string[];
  };
  safetyMeasures: {
    firstAidKits: number;
    fireExtinguishers: number;
    emergencyExits: number;
    safetySigns: boolean;
    lastSafetyAudit: string;
  };
  equipment: {
    type: string;
    count: number;
    lastMaintenance: string;
    nextMaintenance: string;
  }[];
  permits: {
    type: string;
    number: string;
    issuedDate: string;
    expiryDate: string;
    issuingAuthority: string;
  }[];
}

export interface SafetyViolation {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
  workerId?: string;
}

interface DashboardState {
  workers: Worker[];
  sites: SiteInfo[];
  safetyViolations: SafetyViolation[];
  selectedSite: string | null;
  addWorker: (worker: Worker) => void;
  updateWorker: (worker: Worker) => void;
  removeWorker: (id: string) => void;
  addSite: (site: SiteInfo) => void;
  updateSite: (site: SiteInfo) => void;
  removeSite: (id: string) => void;
  addSafetyViolation: (violation: SafetyViolation) => void;
  setSelectedSite: (id: string | null) => void;
}

type DashboardStore = StateCreator<DashboardState, [], [], DashboardState>;

export const useStore = create<DashboardState>()(
  persist(
    ((set) => ({
      workers: [],
      sites: [],
      safetyViolations: [],
      selectedSite: null,
      addWorker: (worker: Worker) =>
        set((state: DashboardState) => ({
          workers: [...state.workers, worker],
        })),
      updateWorker: (worker: Worker) =>
        set((state: DashboardState) => ({
          workers: state.workers.map((w: Worker) =>
            w.id === worker.id ? worker : w),
        })),
      removeWorker: (id: string) =>
        set((state: DashboardState) => ({
          workers: state.workers.filter((w: Worker) => w.id !== id),
        })),
      addSite: (site: SiteInfo) =>
        set((state: DashboardState) => ({
          sites: [...state.sites, site],
        })),
      updateSite: (site: SiteInfo) =>
        set((state: DashboardState) => ({
          sites: state.sites.map((s: SiteInfo) =>
            s.id === site.id ? site : s),
        })),
      removeSite: (id: string) =>
        set((state: DashboardState) => ({
          sites: state.sites.filter((s: SiteInfo) => s.id !== id),
        })),
      addSafetyViolation: (violation: SafetyViolation) =>
        set((state: DashboardState) => ({
          safetyViolations: [...state.safetyViolations, violation],
        })),
      setSelectedSite: (siteId: string | null) => set({ selectedSite: siteId }),
    })) as DashboardStore,
    {
      name: "dashboard-storage",
    },
  ),
);
