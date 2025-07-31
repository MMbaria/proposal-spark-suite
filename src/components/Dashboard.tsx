import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, Target, FileText, Brain, TrendingUp } from "lucide-react";

interface Proposal {
  id: string;
  title: string;
  funder: string;
  deadline: string;
  status: "draft" | "review" | "submitted" | "approved";
  progress: number;
  team: string[];
  budget: string;
}

const mockProposals: Proposal[] = [
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
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4" />
                Timeline
              </Button>
              <Button variant="gradient" size="sm">
                <FileText className="h-4 w-4" />
                New Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
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
              <Button variant="outline" className="w-full">
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
              <Button variant="secondary" className="w-full">
                <Users className="h-4 w-4" />
                Manage Team
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};