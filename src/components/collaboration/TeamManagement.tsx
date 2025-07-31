import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, Mail, Shield, Edit3, Trash2, Crown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type UserRole = "owner" | "admin" | "writer" | "reviewer" | "viewer";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: "active" | "pending" | "inactive";
  joinedAt: Date;
  lastActivity?: Date;
  permissions: string[];
}

export interface TeamManagementProps {
  members: TeamMember[];
  currentUserId: string;
  onAddMember?: (email: string, role: UserRole) => void;
  onRemoveMember?: (memberId: string) => void;
  onUpdateRole?: (memberId: string, role: UserRole) => void;
  onResendInvite?: (memberId: string) => void;
  className?: string;
}

const roleConfig = {
  owner: {
    label: "Owner",
    color: "bg-primary text-primary-foreground",
    icon: Crown,
    permissions: ["all"]
  },
  admin: {
    label: "Admin", 
    color: "bg-accent text-accent-foreground",
    icon: Shield,
    permissions: ["manage_team", "edit_all", "submit", "review"]
  },
  writer: {
    label: "Writer",
    color: "bg-secondary text-secondary-foreground", 
    icon: Edit3,
    permissions: ["edit_assigned", "comment"]
  },
  reviewer: {
    label: "Reviewer",
    color: "bg-warning text-warning-foreground",
    icon: Clock,
    permissions: ["review", "comment"]
  },
  viewer: {
    label: "Viewer",
    color: "bg-muted text-muted-foreground",
    icon: Users,
    permissions: ["view"]
  }
};

export const TeamManagement: React.FC<TeamManagementProps> = ({
  members,
  currentUserId,
  onAddMember,
  onRemoveMember,
  onUpdateRole,
  onResendInvite,
  className
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<UserRole>("writer");

  const currentUser = members.find(m => m.id === currentUserId);
  const canManageTeam = currentUser?.role === "owner" || currentUser?.role === "admin";

  const handleAddMember = () => {
    if (newMemberEmail && onAddMember) {
      onAddMember(newMemberEmail, newMemberRole);
      setNewMemberEmail("");
      setNewMemberRole("writer");
      setIsAddDialogOpen(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status: TeamMember["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="text-success">Active</Badge>;
      case "pending":
        return <Badge variant="secondary" className="text-warning">Pending</Badge>;
      case "inactive":
        return <Badge variant="secondary" className="text-muted-foreground">Inactive</Badge>;
    }
  };

  const sortedMembers = [...members].sort((a, b) => {
    const roleOrder = { owner: 0, admin: 1, writer: 2, reviewer: 3, viewer: 4 };
    return roleOrder[a.role] - roleOrder[b.role];
  });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Team Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Team Management
              </CardTitle>
              <CardDescription>
                Manage team members, roles, and permissions for this proposal
              </CardDescription>
            </div>
            {canManageTeam && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="gradient">
                    <UserPlus className="h-4 w-4" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Add a new team member to collaborate on this proposal
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="colleague@university.edu"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select value={newMemberRole} onValueChange={(value: UserRole) => setNewMemberRole(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(roleConfig).map(([role, config]) => (
                            role !== "owner" && (
                              <SelectItem key={role} value={role}>
                                <div className="flex items-center gap-2">
                                  <config.icon className="h-4 w-4" />
                                  {config.label}
                                </div>
                              </SelectItem>
                            )
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddMember} disabled={!newMemberEmail}>
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold text-foreground">{members.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-success">
                {members.filter(m => m.status === "active").length}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-warning">
                {members.filter(m => m.status === "pending").length}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Writers</p>
              <p className="text-2xl font-bold text-primary">
                {members.filter(m => m.role === "writer" || m.role === "admin" || m.role === "owner").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Current team members and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedMembers.map((member) => {
              const roleInfo = roleConfig[member.role];
              const RoleIcon = roleInfo.icon;
              const isCurrentUser = member.id === currentUserId;

              return (
                <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">
                          {member.name}
                          {isCurrentUser && (
                            <span className="text-sm text-muted-foreground ml-1">(You)</span>
                          )}
                        </p>
                        {getStatusBadge(member.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right space-y-1">
                      <Badge className={roleInfo.color}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleInfo.label}
                      </Badge>
                      {member.lastActivity && (
                        <p className="text-xs text-muted-foreground">
                          Last active: {member.lastActivity.toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {canManageTeam && !isCurrentUser && (
                      <div className="flex items-center gap-1">
                        {member.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onResendInvite?.(member.id)}
                          >
                            Resend
                          </Button>
                        )}
                        
                        <Select
                          value={member.role}
                          onValueChange={(value: UserRole) => onUpdateRole?.(member.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(roleConfig).map(([role, config]) => (
                              role !== "owner" && (
                                <SelectItem key={role} value={role}>
                                  {config.label}
                                </SelectItem>
                              )
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRemoveMember?.(member.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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