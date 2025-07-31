import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Star, Download, Eye, Filter, Search, Plus, Bookmark, TrendingUp, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Template {
  id: string;
  title: string;
  description: string;
  funder: string;
  category: string;
  discipline: string;
  successRate: number;
  usageCount: number;
  rating: number;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPremium: boolean;
  previewSections: string[];
  estimatedTime: string;
  budgetRange: string;
}

export interface TemplateSystemProps {
  templates: Template[];
  onUseTemplate?: (templateId: string) => void;
  onBookmarkTemplate?: (templateId: string) => void;
  onCreateTemplate?: (template: Partial<Template>) => void;
  userBookmarks?: string[];
  className?: string;
}

const mockTemplates: Template[] = [
  {
    id: "1",
    title: "NSF CAREER Award Proposal",
    description: "Comprehensive template for NSF CAREER proposals with research and education integration",
    funder: "National Science Foundation",
    category: "Career Development",
    discipline: "Computer Science",
    successRate: 23,
    usageCount: 156,
    rating: 4.8,
    tags: ["CAREER", "NSF", "Research", "Education"],
    createdBy: "Dr. Sarah Chen",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    isPremium: true,
    previewSections: ["Project Summary", "Research Plan", "Education Plan"],
    estimatedTime: "3-4 weeks",
    budgetRange: "$400K-$500K"
  },
  {
    id: "2", 
    title: "NIH R01 Research Grant",
    description: "Standard template for NIH R01 research proposals with all required sections",
    funder: "National Institutes of Health",
    category: "Research Grant",
    discipline: "Biomedical Sciences",
    successRate: 18,
    usageCount: 234,
    rating: 4.6,
    tags: ["NIH", "R01", "Biomedical", "Research"],
    createdBy: "Dr. Michael Rodriguez",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-25"),
    isPremium: false,
    previewSections: ["Specific Aims", "Research Strategy", "Bibliography"],
    estimatedTime: "4-6 weeks",
    budgetRange: "$200K-$300K"
  }
];

export const TemplateSystem: React.FC<TemplateSystemProps> = ({
  templates = mockTemplates,
  onUseTemplate,
  onBookmarkTemplate,
  onCreateTemplate,
  userBookmarks = [],
  className
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFunder, setSelectedFunder] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({});

  // Filter and sort templates
  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFunder = selectedFunder === "all" || template.funder === selectedFunder;
      const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
      
      return matchesSearch && matchesFunder && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "success":
          return b.successRate - a.successRate;
        case "usage":
          return b.usageCount - a.usageCount;
        case "recent":
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        default:
          return 0;
      }
    });

  const funders = Array.from(new Set(templates.map(t => t.funder)));
  const categories = Array.from(new Set(templates.map(t => t.category)));

  const handleCreateTemplate = () => {
    if (onCreateTemplate && newTemplate.title) {
      onCreateTemplate(newTemplate);
      setNewTemplate({});
      setIsCreateDialogOpen(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ));
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Template Library
              </CardTitle>
              <CardDescription>
                Browse and use proven proposal templates from successful submissions
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gradient">
                  <Plus className="h-4 w-4" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                  <DialogDescription>
                    Share your successful proposal template with the community
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Template Title</Label>
                      <Input
                        id="title"
                        value={newTemplate.title || ""}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="NSF Research Grant Template"
                      />
                    </div>
                    <div>
                      <Label htmlFor="funder">Funder</Label>
                      <Input
                        id="funder"
                        value={newTemplate.funder || ""}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, funder: e.target.value }))}
                        placeholder="National Science Foundation"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTemplate.description || ""}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what makes this template effective..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newTemplate.category || ""}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Research Grant"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discipline">Discipline</Label>
                      <Input
                        id="discipline"
                        value={newTemplate.discipline || ""}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, discipline: e.target.value }))}
                        placeholder="Computer Science"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTemplate} disabled={!newTemplate.title}>
                    Create Template
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
                Advanced
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedFunder} onValueChange={setSelectedFunder}>
                <SelectTrigger>
                  <SelectValue placeholder="All Funders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Funders</SelectItem>
                  {funders.map(funder => (
                    <SelectItem key={funder} value={funder}>{funder}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="success">Success Rate</SelectItem>
                  <SelectItem value="usage">Most Used</SelectItem>
                  <SelectItem value="recent">Recently Updated</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground self-center">
                {filteredTemplates.length} templates found
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg line-clamp-2">{template.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{template.funder}</Badge>
                    {template.isPremium && (
                      <Badge variant="default" className="bg-gradient-primary">
                        <Award className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBookmarkTemplate?.(template.id)}
                  className={cn(
                    userBookmarks.includes(template.id) && "bg-primary/10 text-primary"
                  )}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
              
              <CardDescription className="line-clamp-3">
                {template.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="font-bold text-success">{template.successRate}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Used</p>
                  <p className="font-bold text-foreground">{template.usageCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-bold text-foreground">{template.rating}</span>
                    <div className="flex">
                      {renderStars(template.rating)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Metadata */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Est. Time:</span>
                  <span>{template.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Budget Range:</span>
                  <span>{template.budgetRange}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onUseTemplate?.(template.id)}
                >
                  <Download className="h-4 w-4" />
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};