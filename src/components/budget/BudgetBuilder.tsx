import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Plus, Trash2, AlertCircle, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BudgetCategory {
  id: string;
  name: string;
  description?: string;
  required?: boolean;
  maxPercentage?: number;
  items: BudgetItem[];
}

export interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  yearlyBreakdown?: number[];
}

export interface BudgetRules {
  indirectCostRate?: number;
  maxIndirectCost?: number;
  totalBudgetLimit?: number;
  categoryLimits?: {
    [categoryId: string]: number;
  };
  costShareRequired?: boolean;
  costSharePercentage?: number;
}

export interface BudgetBuilderProps {
  categories: BudgetCategory[];
  rules?: BudgetRules;
  projectYears?: number;
  funder?: string;
  onBudgetChange?: (categories: BudgetCategory[], totals: BudgetTotals) => void;
  className?: string;
}

export interface BudgetTotals {
  directCosts: number;
  indirectCosts: number;
  costShare: number;
  totalBudget: number;
  categoryTotals: { [categoryId: string]: number };
}

export const BudgetBuilder: React.FC<BudgetBuilderProps> = ({
  categories: initialCategories,
  rules = {},
  projectYears = 1,
  funder,
  onBudgetChange,
  className
}) => {
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
  const [errors, setErrors] = useState<string[]>([]);

  // Calculate totals
  const calculateTotals = (): BudgetTotals => {
    const categoryTotals: { [categoryId: string]: number } = {};
    let directCosts = 0;

    categories.forEach(category => {
      const categoryTotal = category.items.reduce((sum, item) => {
        return sum + (item.quantity * item.unitCost);
      }, 0);
      
      categoryTotals[category.id] = categoryTotal;
      directCosts += categoryTotal;
    });

    const indirectCosts = rules.indirectCostRate 
      ? Math.min(directCosts * (rules.indirectCostRate / 100), rules.maxIndirectCost || Infinity)
      : 0;

    const totalBudget = directCosts + indirectCosts;
    const costShare = rules.costShareRequired 
      ? totalBudget * ((rules.costSharePercentage || 0) / 100)
      : 0;

    return {
      directCosts,
      indirectCosts,
      costShare,
      totalBudget,
      categoryTotals
    };
  };

  const totals = calculateTotals();

  // Validation
  useEffect(() => {
    const newErrors: string[] = [];

    // Check total budget limit
    if (rules.totalBudgetLimit && totals.totalBudget > rules.totalBudgetLimit) {
      newErrors.push(`Total budget exceeds limit of $${rules.totalBudgetLimit.toLocaleString()}`);
    }

    // Check category limits
    if (rules.categoryLimits) {
      Object.entries(rules.categoryLimits).forEach(([categoryId, limit]) => {
        const categoryTotal = totals.categoryTotals[categoryId] || 0;
        if (categoryTotal > limit) {
          const category = categories.find(c => c.id === categoryId);
          newErrors.push(`${category?.name} exceeds limit of $${limit.toLocaleString()}`);
        }
      });
    }

    // Check required categories
    categories.forEach(category => {
      if (category.required && (totals.categoryTotals[category.id] || 0) === 0) {
        newErrors.push(`${category.name} is required but has no budget allocated`);
      }
    });

    setErrors(newErrors);
    onBudgetChange?.(categories, totals);
  }, [categories, rules, totals, onBudgetChange]);

  const addItem = (categoryId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            items: [...category.items, {
              id: `item-${Date.now()}`,
              description: "",
              quantity: 1,
              unitCost: 0
            }]
          }
        : category
    ));
  };

  const removeItem = (categoryId: string, itemId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            items: category.items.filter(item => item.id !== itemId)
          }
        : category
    ));
  };

  const updateItem = (categoryId: string, itemId: string, field: keyof BudgetItem, value: any) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            items: category.items.map(item => 
              item.id === itemId 
                ? { ...item, [field]: value }
                : item
            )
          }
        : category
    ));
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Budget Summary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Budget Summary
            {funder && <Badge variant="secondary">{funder}</Badge>}
          </CardTitle>
          <CardDescription>
            {projectYears > 1 ? `${projectYears}-year project budget` : "Project budget overview"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Direct Costs</p>
              <p className="text-2xl font-bold text-foreground">
                ${totals.directCosts.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Indirect Costs {rules.indirectCostRate && `(${rules.indirectCostRate}%)`}
              </p>
              <p className="text-2xl font-bold text-accent">
                ${totals.indirectCosts.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Cost Share {rules.costSharePercentage && `(${rules.costSharePercentage}%)`}
              </p>
              <p className="text-2xl font-bold text-warning">
                ${totals.costShare.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Request</p>
              <p className="text-3xl font-bold text-primary">
                ${totals.totalBudget.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Budget errors */}
          {errors.length > 0 && (
            <div className="mt-4 space-y-2">
              {errors.map((error, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Categories */}
      {categories.map((category, categoryIndex) => (
        <Card key={category.id} className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {category.name}
                  {category.required && (
                    <Badge variant="destructive" className="text-xs">Required</Badge>
                  )}
                </CardTitle>
                {category.description && (
                  <CardDescription>{category.description}</CardDescription>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Category Total</p>
                <p className="text-xl font-bold text-primary">
                  ${(totals.categoryTotals[category.id] || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Budget Items */}
              {category.items.map((item, itemIndex) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-5">
                    <Label htmlFor={`item-${item.id}-desc`}>Description</Label>
                    <Input
                      id={`item-${item.id}-desc`}
                      value={item.description}
                      onChange={(e) => updateItem(category.id, item.id, 'description', e.target.value)}
                      placeholder="Budget item description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-${item.id}-qty`}>Quantity</Label>
                    <Input
                      id={`item-${item.id}-qty`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(category.id, item.id, 'quantity', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-${item.id}-cost`}>Unit Cost</Label>
                    <Input
                      id={`item-${item.id}-cost`}
                      type="number"
                      value={item.unitCost}
                      onChange={(e) => updateItem(category.id, item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Total</Label>
                    <div className="flex items-center h-10 px-3 py-2 border border-input bg-muted rounded-md">
                      <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-sm font-medium">
                        {(item.quantity * item.unitCost).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(category.id, item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add Item Button */}
              <Button
                variant="outline"
                onClick={() => addItem(category.id)}
                className="w-full border-dashed"
              >
                <Plus className="h-4 w-4" />
                Add Budget Item
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};