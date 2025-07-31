import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, AlertTriangle, CheckCircle2, Plus, Edit, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineTask {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: "not-started" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high" | "critical";
  assignees: string[];
  dependencies: string[];
  estimatedHours: number;
  actualHours?: number;
  category: "research" | "writing" | "review" | "budget" | "admin";
}

export interface TimelineMilestone {
  id: string;
  title: string;
  date: Date;
  type: "internal" | "external" | "deadline";
  description?: string;
  completed: boolean;
}

export interface TimelineManagerProps {
  tasks: TimelineTask[];
  milestones: TimelineMilestone[];
  projectStartDate: Date;
  projectEndDate: Date;
  onTaskUpdate?: (taskId: string, updates: Partial<TimelineTask>) => void;
  onMilestoneUpdate?: (milestoneId: string, updates: Partial<TimelineMilestone>) => void;
  onAddTask?: (task: Omit<TimelineTask, "id">) => void;
  className?: string;
}

const statusConfig = {
  "not-started": { color: "bg-muted text-muted-foreground", label: "Not Started" },
  "in-progress": { color: "bg-primary text-primary-foreground", label: "In Progress" },
  "completed": { color: "bg-success text-success-foreground", label: "Completed" },
  "overdue": { color: "bg-destructive text-destructive-foreground", label: "Overdue" }
};

const priorityConfig = {
  low: { color: "bg-muted text-muted-foreground", label: "Low" },
  medium: { color: "bg-warning text-warning-foreground", label: "Medium" },
  high: { color: "bg-accent text-accent-foreground", label: "High" },
  critical: { color: "bg-destructive text-destructive-foreground", label: "Critical" }
};

const categoryConfig = {
  research: { color: "bg-primary text-primary-foreground", label: "Research", icon: "🔬" },
  writing: { color: "bg-accent text-accent-foreground", label: "Writing", icon: "✍️" },
  review: { color: "bg-warning text-warning-foreground", label: "Review", icon: "👁️" },
  budget: { color: "bg-success text-success-foreground", label: "Budget", icon: "💰" },
  admin: { color: "bg-muted text-muted-foreground", label: "Admin", icon: "📋" }
};

export const TimelineManager: React.FC<TimelineManagerProps> = ({
  tasks,
  milestones,
  projectStartDate,
  projectEndDate,
  onTaskUpdate,
  onMilestoneUpdate,
  onAddTask,
  className
}) => {
  const [selectedView, setSelectedView] = useState<"gantt" | "list" | "calendar">("list");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Calculate project metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const overdueTasks = tasks.filter(t => t.status === "overdue").length;
  const upcomingDeadlines = milestones.filter(m => 
    !m.completed && m.date > new Date() && m.date <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;

  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Calculate project days
  const totalProjectDays = Math.ceil((projectEndDate.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((new Date().getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const timeProgressPercentage = Math.min((elapsedDays / totalProjectDays) * 100, 100);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const categoryMatch = filterCategory === "all" || task.category === filterCategory;
    const statusMatch = filterStatus === "all" || task.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const getDaysUntilDeadline = (date: Date) => {
    const days = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getTaskDuration = (task: TimelineTask) => {
    return Math.ceil((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Timeline Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Project Timeline
          </CardTitle>
          <CardDescription>
            Track progress and manage deadlines for your grant proposal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
              <p className="text-2xl font-bold text-success">{completedTasks}/{totalTasks}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Overdue Tasks</p>
              <p className="text-2xl font-bold text-destructive">{overdueTasks}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Upcoming Deadlines</p>
              <p className="text-2xl font-bold text-warning">{upcomingDeadlines}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Days Remaining</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.max(0, totalProjectDays - elapsedDays)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Project Progress</span>
              <span className="font-medium">{progressPercentage.toFixed(1)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Time Progress</span>
              <span className="font-medium">{timeProgressPercentage.toFixed(1)}% Elapsed</span>
            </div>
            <Progress value={timeProgressPercentage} className="h-2 bg-muted" />
          </div>
        </CardContent>
      </Card>

      {/* Filters and View Options */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">View:</span>
                <div className="flex rounded-md border">
                  {["list", "gantt", "calendar"].map(view => (
                    <Button
                      key={view}
                      variant={selectedView === view ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedView(view as any)}
                      className="rounded-none first:rounded-l-md last:rounded-r-md"
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Filter:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="text-sm border border-input rounded-md px-2 py-1"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-sm border border-input rounded-md px-2 py-1"
                >
                  <option value="all">All Status</option>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <Button variant="gradient" size="sm">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Milestones */}
      {milestones.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Upcoming Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {milestones
                .filter(m => !m.completed)
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map(milestone => {
                  const daysUntil = getDaysUntilDeadline(milestone.date);
                  return (
                    <div key={milestone.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          milestone.type === "deadline" ? "bg-destructive" : 
                          milestone.type === "external" ? "bg-warning" : "bg-primary"
                        )} />
                        <div>
                          <p className="font-medium text-foreground">{milestone.title}</p>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          {milestone.date.toLocaleDateString()}
                        </p>
                        <p className={cn(
                          "text-sm",
                          daysUntil <= 3 ? "text-destructive" :
                          daysUntil <= 7 ? "text-warning" : "text-muted-foreground"
                        )}>
                          {daysUntil > 0 ? `${daysUntil} days` : `${Math.abs(daysUntil)} days overdue`}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
          <CardDescription>
            Manage and track individual tasks in your proposal timeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.map(task => {
              const duration = getTaskDuration(task);
              const daysUntilEnd = getDaysUntilDeadline(task.endDate);
              
              return (
                <div key={task.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-smooth">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{task.title}</h3>
                        <Badge className={statusConfig[task.status].color}>
                          {statusConfig[task.status].label}
                        </Badge>
                        <Badge className={priorityConfig[task.priority].color}>
                          {priorityConfig[task.priority].label}
                        </Badge>
                        <Badge variant="outline">
                          {categoryConfig[task.category].icon} {categoryConfig[task.category].label}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {task.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="ml-2 font-medium">{duration} days</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Due:</span>
                      <span className={cn(
                        "ml-2 font-medium",
                        daysUntilEnd <= 3 && task.status !== "completed" ? "text-destructive" :
                        daysUntilEnd <= 7 && task.status !== "completed" ? "text-warning" : "text-foreground"
                      )}>
                        {task.endDate.toLocaleDateString()}
                        {task.status !== "completed" && (
                          <span className="ml-1">
                            ({daysUntilEnd > 0 ? `${daysUntilEnd}d left` : `${Math.abs(daysUntilEnd)}d overdue`})
                          </span>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Estimated:</span>
                      <span className="ml-2 font-medium">{task.estimatedHours}h</span>
                      {task.actualHours && (
                        <span className="text-muted-foreground"> / {task.actualHours}h actual</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{task.assignees.length}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};