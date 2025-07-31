import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Save, AlertCircle, CheckCircle2, Brain, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProposalSectionSchema {
  id: string;
  title: string;
  description: string;
  required: boolean;
  wordLimit?: number;
  wordMinimum?: number;
  placeholder?: string;
  funderSpecific?: {
    [funder: string]: {
      guidelines?: string;
      examples?: string;
    };
  };
}

export interface ProposalSectionProps {
  schema: ProposalSectionSchema;
  content?: string;
  funder?: string;
  autoSave?: boolean;
  onContentChange?: (sectionId: string, content: string) => void;
  onValidationChange?: (sectionId: string, isValid: boolean, errors: string[]) => void;
  className?: string;
}

export const ProposalSection: React.FC<ProposalSectionProps> = ({
  schema,
  content = "",
  funder,
  autoSave = true,
  onContentChange,
  onValidationChange,
  className
}) => {
  const [sectionContent, setSectionContent] = useState(content);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const wordCount = sectionContent.trim().split(/\s+/).filter(word => word.length > 0).length;
  const funderGuidelines = funder && schema.funderSpecific?.[funder];

  // Validation logic
  useEffect(() => {
    const newErrors: string[] = [];
    
    if (schema.required && sectionContent.trim().length === 0) {
      newErrors.push("This section is required");
    }
    
    if (schema.wordMinimum && wordCount < schema.wordMinimum) {
      newErrors.push(`Minimum ${schema.wordMinimum} words required (current: ${wordCount})`);
    }
    
    if (schema.wordLimit && wordCount > schema.wordLimit) {
      newErrors.push(`Exceeds word limit of ${schema.wordLimit} (current: ${wordCount})`);
    }

    setErrors(newErrors);
    onValidationChange?.(schema.id, newErrors.length === 0, newErrors);
  }, [sectionContent, schema, wordCount, onValidationChange]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const saveTimeout = setTimeout(async () => {
      if (sectionContent !== content) {
        setIsSaving(true);
        // Simulate save delay
        await new Promise(resolve => setTimeout(resolve, 500));
        onContentChange?.(schema.id, sectionContent);
        setLastSaved(new Date());
        setIsSaving(false);
      }
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [sectionContent, content, autoSave, onContentChange, schema.id]);

  const handleManualSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onContentChange?.(schema.id, sectionContent);
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const getValidationStatus = () => {
    if (errors.length > 0) return "error";
    if (schema.required && sectionContent.trim().length > 0) return "success";
    return "default";
  };

  const getProgressValue = () => {
    if (!schema.wordMinimum) return sectionContent.length > 0 ? 100 : 0;
    return Math.min((wordCount / schema.wordMinimum) * 100, 100);
  };

  return (
    <Card className={cn("relative", className)}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {schema.title}
              {schema.required && (
                <Badge variant="destructive" className="text-xs">Required</Badge>
              )}
            </CardTitle>
            <CardDescription>{schema.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getValidationStatus() === "success" && (
              <CheckCircle2 className="h-5 w-5 text-success" />
            )}
            {getValidationStatus() === "error" && (
              <AlertCircle className="h-5 w-5 text-destructive" />
            )}
          </div>
        </div>

        {/* Funder-specific guidelines */}
        {funderGuidelines && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
            <p className="text-sm font-medium text-primary mb-1">{funder} Guidelines:</p>
            <p className="text-sm text-muted-foreground">{funderGuidelines.guidelines}</p>
          </div>
        )}

        {/* Word count and progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Word count: {wordCount}
              {schema.wordLimit && ` / ${schema.wordLimit}`}
              {schema.wordMinimum && ` (min: ${schema.wordMinimum})`}
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isSaving && "Saving..."}
              {lastSaved && !isSaving && `Saved ${lastSaved.toLocaleTimeString()}`}
            </div>
          </div>
          {(schema.wordMinimum || schema.wordLimit) && (
            <Progress 
              value={getProgressValue()} 
              className={cn(
                "h-1",
                getValidationStatus() === "error" && "bg-destructive/20",
                getValidationStatus() === "success" && "bg-success/20"
              )}
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          value={sectionContent}
          onChange={(e) => setSectionContent(e.target.value)}
          placeholder={schema.placeholder || `Enter content for ${schema.title}...`}
          className={cn(
            "min-h-[200px] resize-y",
            getValidationStatus() === "error" && "border-destructive",
            getValidationStatus() === "success" && "border-success"
          )}
        />

        {/* Error messages */}
        {errors.length > 0 && (
          <div className="space-y-1">
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            ))}
          </div>
        )}

        {/* AI assistance and manual save */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" size="sm" className="text-primary">
            <Brain className="h-4 w-4" />
            AI Assist
          </Button>
          
          {!autoSave && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleManualSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};