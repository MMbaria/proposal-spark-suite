import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, Target, FileText, Brain, TrendingUp, Settings, Plus } from "lucide-react";

// Foundation Components
import { ProposalSection } from "@/components/proposal/ProposalSection";
import { BudgetBuilder } from "@/components/budget/BudgetBuilder";
import { TeamManagement } from "@/components/collaboration/TeamManagement";
import { TemplateSystem } from "@/components/templates/TemplateSystem";
import { TimelineManager } from "@/components/timeline/TimelineManager";

// Types
import type { Proposal, ProposalStats } from "@/types/proposal";

interface DashboardProposal {
  id: string;
  title: string;
  funder: string;
  deadline: string;
  status: "draft" | "review" | "submitted" | "approved";
  progress: number;
  team: string[];
  budget: string;
}

const mockProposals: DashboardProposal[] = [
  {
    id: "1",
    title: "AI-Enhanced Learning Platform for Underserved Communities",
    funder: "National Science Foundation",
    deadline: "2024-02-15",
    status: "review",
    progress: 85,
    team: ["Dr. Sarah Chen", "Dr. Michael Rodriguez"],
    budget: "$450,000"
  },
  {
    id: "2", 
    title: "Sustainable Urban Agriculture Initiative",
    funder: "Department of Agriculture",
    deadline: "2024-03-01",
    status: "draft",
    progress: 45,
    team: ["Dr. Emily Johnson", "Dr. David Park", "Dr. Lisa Williams"],
    budget: "$275,000"
  },
  {
    id: "3",
    title: "Community Health Resilience Program",
    funder: "Gates Foundation",
    deadline: "2024-01-30",
    status: "submitted",
    progress: 100,
    team: ["Dr. Maria Santos"],
    budget: "$125,000"
  }
];

const statusConfig = {
  draft: { color: "bg-warning text-warning-foreground", label: "Draft" },
  review: { color: "bg-primary text-primary-foreground", label: "In Review" },
  submitted: { color: "bg-accent text-accent-foreground", label: "Submitted" },
  approved: { color: "bg-success text-success-foreground", label: "Approved" }
};

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "proposals" | "team" | "templates" | "timeline">("overview");

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">ProposalPilot</h1>
              </div>
              <Badge variant="secondary" className="text-xs">
                AI-Powered Grant Assistant
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                {[
                  { key: "overview", label: "Overview", icon: TrendingUp },
                  { key: "proposals", label: "Proposals", icon: FileText },
                  { key: "team", label: "Team", icon: Users },
                  { key: "templates", label: "Templates", icon: Brain },
                  { key: "timeline", label: "Timeline", icon: Calendar }
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={activeTab === key ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(key as any)}
                    className="gap-1"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                ))}
              </div>
              
              <Button variant="gradient" size="sm">
                <Plus className="h-4 w-4" />
                New Proposal
              </Button>
              
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Render different views based on active tab */}
        {activeTab === "overview" && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">3</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">$850K</div>
              <p className="text-xs text-muted-foreground">
                Potential award value
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">68%</div>
              <p className="text-xs text-muted-foreground">
                +12% from last year
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Timeline</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">45 days</div>
              <p className="text-xs text-muted-foreground">
                From start to submission
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Proposals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Active Proposals
              </CardTitle>
              <CardDescription>
                Track progress and manage deadlines for your grant proposals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProposals.map((proposal) => (
                  <div key={proposal.id} className="border border-border rounded-lg p-4 hover:shadow-card transition-smooth">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{proposal.title}</h3>
                        <p className="text-sm text-muted-foreground">{proposal.funder}</p>
                      </div>
                      <Badge className={statusConfig[proposal.status].color}>
                        {statusConfig[proposal.status].label}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Due:</span>
                        <span className="font-medium">{proposal.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-medium">{proposal.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Team:</span>
                        <span className="font-medium">{proposal.team.length}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Progress:</span>
                        <span className="font-medium">{proposal.progress}%</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <Progress value={proposal.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {proposal.team.slice(0, 3).map((member, index) => (
                          <div key={index} className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {member.split(' ').map(n => n[0]).join('')}
                          </div>
                        ))}
                        {proposal.team.length > 3 && (
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-xs">
                            +{proposal.team.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="default" size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-card hover:shadow-elegant transition-smooth">
                <CardHeader>
                  <CardTitle className="text-lg">AI Proposal Builder</CardTitle>
                  <CardDescription>
                    Create proposals with intelligent templates and guidance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="gradient" className="w-full">
                    <Brain className="h-4 w-4" />
                    Start Building
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-elegant transition-smooth">
                <CardHeader>
                  <CardTitle className="text-lg">Template Library</CardTitle>
                  <CardDescription>
                    Browse successful templates by funder and field
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab("templates")}
                  >
                    <FileText className="h-4 w-4" />
                    Browse Templates
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-elegant transition-smooth">
                <CardHeader>
                  <CardTitle className="text-lg">Collaboration Hub</CardTitle>
                  <CardDescription>
                    Invite team members and manage review workflows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => setActiveTab("team")}
                  >
                    <Users className="h-4 w-4" />
                    Manage Team
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Team Management Tab */}
        {activeTab === "team" && (
          <TeamManagement 
            members={[
              {
                id: "1",
                name: "Dr. Sarah Chen",
                email: "sarah.chen@university.edu",
                role: "owner",
                status: "active",
                joinedAt: new Date("2024-01-01"),
                lastActivity: new Date("2024-01-29"),
                permissions: ["all"]
              },
              {
                id: "2",
                name: "Dr. Michael Rodriguez",
                email: "m.rodriguez@university.edu",
                role: "admin",
                status: "active",
                joinedAt: new Date("2024-01-05"),
                lastActivity: new Date("2024-01-28"),
                permissions: ["manage_team", "edit_all", "submit", "review"]
              },
              {
                id: "3",
                name: "Dr. Emily Johnson",
                email: "emily.j@university.edu",
                role: "writer",
                status: "pending",
                joinedAt: new Date("2024-01-25"),
                permissions: ["edit_assigned", "comment"]
              }
            ]}
            currentUserId="1"
            onAddMember={(email, role) => console.log("Add member:", email, role)}
            onRemoveMember={(id) => console.log("Remove member:", id)}
            onUpdateRole={(id, role) => console.log("Update role:", id, role)}
          />
        )}

        {/* Template System Tab */}
        {activeTab === "templates" && (
          <TemplateSystem
            templates={[]}
            onUseTemplate={(id) => console.log("Use template:", id)}
            onBookmarkTemplate={(id) => console.log("Bookmark template:", id)}
            onCreateTemplate={(template) => console.log("Create template:", template)}
          />
        )}

        {/* Timeline Manager Tab */}
        {activeTab === "timeline" && (
          <TimelineManager
            tasks={[
              {
                id: "1",
                title: "Literature Review",
                description: "Comprehensive review of existing research",
                startDate: new Date("2024-02-01"),
                endDate: new Date("2024-02-14"),
                status: "in-progress",
                priority: "high",
                assignees: ["Dr. Sarah Chen"],
                dependencies: [],
                estimatedHours: 40,
                actualHours: 25,
                category: "research"
              },
              {
                id: "2",
                title: "Budget Preparation",
                description: "Detailed budget with justifications",
                startDate: new Date("2024-02-10"),
                endDate: new Date("2024-02-20"),
                status: "not-started",
                priority: "medium",
                assignees: ["Dr. Michael Rodriguez"],
                dependencies: ["1"],
                estimatedHours: 20,
                category: "budget"
              }
            ]}
            milestones={[
              {
                id: "1",
                title: "First Draft Complete",
                date: new Date("2024-02-28"),
                type: "internal",
                completed: false
              },
              {
                id: "2",
                title: "NSF Deadline",
                date: new Date("2024-03-15"),
                type: "deadline",
                description: "Final submission deadline",
                completed: false
              }
            ]}
            projectStartDate={new Date("2024-02-01")}
            projectEndDate={new Date("2024-03-15")}
            onTaskUpdate={(id, updates) => console.log("Update task:", id, updates)}
            onMilestoneUpdate={(id, updates) => console.log("Update milestone:", id, updates)}
          />
        )}
      </div>
    </div>
  );
};