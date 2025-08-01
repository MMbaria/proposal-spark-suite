// Core proposal types and interfaces for ProposalPilot

export interface Proposal {
  id: string;
  title: string;
  funder: string;
  deadline: Date;
  status: "draft" | "review" | "submitted" | "approved" | "rejected";
  progress: number;
  team: TeamMember[];
  budget: ProposalBudget;
  sections: ProposalSectionData[];
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  timeline: TimelineData;
  metadata: ProposalMetadata;
}

export interface ProposalSectionData {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  status: "empty" | "draft" | "complete" | "needs-review";
  lastModified: Date;
  lastModifiedBy: string;
  comments: Comment[];
  aiSuggestions?: AISuggestion[];
}

export interface ProposalBudget {
  totalRequested: number;
  directCosts: number;
  indirectCosts: number;
  totalCosts: number;
  costShare: number;
  categories: BudgetCategoryData[];
  justification: string;
}

export interface BudgetCategoryData {
  id: string;
  name: string;
  total: number;
  items: BudgetLineItem[];
}

export interface BudgetLineItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  total: number;
  justification?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "writer" | "reviewer" | "viewer";
  status: "active" | "pending" | "inactive";
  avatar?: string;
  affiliation?: string;
  expertise?: string[];
  joinedAt: Date;
  lastActivity?: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  resolved: boolean;
  replies: Comment[];
  sectionId?: string;
  position?: {
    start: number;
    end: number;
  };
}

export interface AISuggestion {
  id: string;
  type: "content" | "structure" | "compliance" | "style";
  suggestion: string;
  confidence: number;
  applied: boolean;
  createdAt: Date;
}

export interface TimelineData {
  startDate: Date;
  endDate: Date;
  tasks: TimelineTask[];
  milestones: TimelineMilestone[];
}

export interface TimelineTask {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: "not-started" | "in-progress" | "completed" | "overdue";
  assignee: string;
  dependencies: string[];
  category: "research" | "writing" | "review" | "budget" | "admin";
}

export interface TimelineMilestone {
  id: string;
  title: string;
  date: Date;
  type: "internal" | "external" | "deadline";
  completed: boolean;
}

export interface ProposalMetadata {
  tags: string[];
  discipline: string;
  fundingAmount: number;
  projectDuration: number; // in months
  duration?: string;
  useAITemplate?: boolean;
  collaboratingInstitutions: string[];
  keywords: string[];
  complianceChecks: ComplianceCheck[];
}

export interface ComplianceCheck {
  id: string;
  rule: string;
  status: "pass" | "fail" | "warning";
  message: string;
  section?: string;
}

// Funder-specific types
export interface FunderGuidelines {
  id: string;
  name: string;
  requirements: FunderRequirement[];
  templates: string[];
  deadlines: FunderDeadline[];
  budgetRules: BudgetRules;
  formatting: FormattingRules;
}

export interface FunderRequirement {
  id: string;
  title: string;
  description: string;
  mandatory: boolean;
  wordLimit?: number;
  wordMinimum?: number;
  guidelines?: string;
}

export interface FunderDeadline {
  type: "application" | "loi" | "fullproposal";
  date: Date;
  description: string;
}

export interface BudgetRules {
  indirectCostRate?: number;
  maxIndirectCost?: number;
  totalBudgetLimit?: number;
  categoryLimits?: Record<string, number>;
  costShareRequired?: boolean;
  costSharePercentage?: number;
}

export interface FormattingRules {
  pageLimit?: number;
  fontSize: number;
  fontFamily: string;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  lineSpacing: number;
}

// API response types
export interface ProposalListResponse {
  proposals: Proposal[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProposalStats {
  totalActive: number;
  totalFunding: number;
  successRate: number;
  averageTimeline: number;
  upcomingDeadlines: number;
}

// Form and validation types
export interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning" | "info";
}

export interface ProposalFormData {
  title: string;
  funder: string;
  deadline: string;
  estimatedBudget: number;
  teamMembers: string[];
  templateId?: string;
  description?: string;
}