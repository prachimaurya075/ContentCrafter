import { PREMIUM_TEMPLATES } from '../constants/premium-templates';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export const WritingPromptsToolbar = ({ onPromptSelect = () => {} }) => {
  const selectTemplate = (template) => {
    onPromptSelect(template);
  };

  const topPrompts = [
    ...Object.values(PREMIUM_TEMPLATES.categories).flatMap(cat => cat.prompts.slice(0,2)),
  ].slice(0, 8);

  return (
    <div className="flex flex-wrap gap-2 p-3 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      {topPrompts.map((promptObj, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          onClick={() => selectTemplate(promptObj.template)}
          className="h-auto px-3 py-1.5 text-xs bg-muted/50 hover:bg-muted hover:text-foreground border border-muted/50 rounded-lg whitespace-nowrap truncate max-w-48"
          title={promptObj.template}
        >
          {promptObj.title}
        </Button>
      ))}
    </div>
  );
};

