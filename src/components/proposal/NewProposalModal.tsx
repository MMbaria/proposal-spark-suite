import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Proposal } from "@/types/proposal";

interface NewProposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProposal: (proposal: Omit<Proposal, "id" | "createdAt" | "updatedAt">) => void;
}

const funderOptions = [
  { value: "nsf", label: "National Science Foundation (NSF)" },
  { value: "nih", label: "National Institutes of Health (NIH)" },
  { value: "usda", label: "Department of Agriculture (USDA)" },
  { value: "doe", label: "Department of Energy (DOE)" },
  { value: "gates", label: "Gates Foundation" },
  { value: "ford", label: "Ford Foundation" },
  { value: "other", label: "Other" }
];

const categoryOptions = [
  { value: "research", label: "Research & Development" },
  { value: "education", label: "Education & Training" },
  { value: "community", label: "Community Development" },
  { value: "healthcare", label: "Healthcare & Medicine" },
  { value: "environment", label: "Environmental" },
  { value: "technology", label: "Technology Innovation" },
  { value: "social", label: "Social Impact" }
];

export const NewProposalModal = ({ open, onOpenChange, onCreateProposal }: NewProposalModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    funder: "",
    category: "",
    deadline: undefined as Date | undefined,
    requestedAmount: "",
    duration: "",
    customFunder: ""
  });

  const [useAITemplate, setUseAITemplate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.funder || !formData.deadline) {
      return;
    }

    const proposal: Omit<Proposal, "id" | "createdAt" | "updatedAt"> = {
      title: formData.title,
      funder: formData.funder === "other" ? formData.customFunder : formData.funder,
      deadline: formData.deadline,
      status: "draft",
      progress: 0,
      team: [],
      sections: [],
      createdBy: "current-user", // TODO: Get from auth context
      timeline: {
        startDate: new Date(),
        endDate: formData.deadline,
        tasks: [],
        milestones: []
      },
      budget: {
        totalRequested: parseFloat(formData.requestedAmount) || 0,
        directCosts: parseFloat(formData.requestedAmount) || 0,
        indirectCosts: 0,
        totalCosts: parseFloat(formData.requestedAmount) || 0,
        costShare: 0,
        categories: [],
        justification: ""
      },
      metadata: {
        tags: [],
        discipline: formData.category,
        fundingAmount: parseFloat(formData.requestedAmount) || 0,
        projectDuration: 12,
        duration: formData.duration,
        useAITemplate,
        collaboratingInstitutions: [],
        keywords: [],
        complianceChecks: []
      }
    };

    onCreateProposal(proposal);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      funder: "",
      category: "",
      deadline: undefined,
      requestedAmount: "",
      duration: "",
      customFunder: ""
    });
    setUseAITemplate(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create New Proposal
          </DialogTitle>
          <DialogDescription>
            Start a new grant proposal with AI-powered templates and guidance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Proposal Title *</Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title for your proposal"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Brief Description</Label>
              <Textarea
                id="description"
                placeholder="Summarize your project's goals and impact (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            {/* Funder and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="funder">Funding Agency *</Label>
                <Select value={formData.funder} onValueChange={(value) => setFormData({ ...formData, funder: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select funder" />
                  </SelectTrigger>
                  <SelectContent>
                    {funderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Funder Field */}
            {formData.funder === "other" && (
              <div className="space-y-2">
                <Label htmlFor="customFunder">Custom Funder Name *</Label>
                <Input
                  id="customFunder"
                  placeholder="Enter the name of the funding organization"
                  value={formData.customFunder}
                  onChange={(e) => setFormData({ ...formData, customFunder: e.target.value })}
                  required
                />
              </div>
            )}

            {/* Deadline and Budget */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Submission Deadline *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.deadline ? format(formData.deadline, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.deadline}
                      onSelect={(date) => setFormData({ ...formData, deadline: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Requested Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="250000"
                  value={formData.requestedAmount}
                  onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                />
              </div>
            </div>

            {/* Project Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Project Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 24 months, 3 years"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>

            {/* AI Template Toggle */}
            <div className="flex items-center space-x-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <input
                type="checkbox"
                id="aiTemplate"
                checked={useAITemplate}
                onChange={(e) => setUseAITemplate(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="aiTemplate" className="text-sm font-medium">
                Use AI-generated template based on funder and category
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              <Sparkles className="h-4 w-4" />
              Create Proposal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};