"use client";

import { Check } from "lucide-react";

interface Template {
  id: string;
  label: string;
  src: string;
  defaultSize: number;
  qrPos: { x: number; y: number };
}

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: Template;
  onSelectTemplate: (template: Template) => void;
}

export default function TemplateSelector({
  templates,
  selectedTemplate,
  onSelectTemplate,
}: TemplateSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-muted">
        Choose Template
      </p>

      <div className="grid grid-cols-3 gap-3">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectTemplate(t)}
            className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 aspect-3/4 hover:-translate-y-0.5 hover:shadow-md
              ${selectedTemplate.id === t.id
                ? "border-coral shadow-sm"
                : "border-brand-border hover:border-coral/50 dark:hover:border-coral/60"
              }`}
          >
            <img
              src={t.src}
              alt={t.label}
              className="w-full h-full object-cover"
            />

            {/* Label overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-black/40 py-1">
              <p className="text-white text-xs font-bold text-center">
                {t.label}
              </p>
            </div>

            {/* Selected checkmark */}
            {selectedTemplate.id === t.id && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-coral flex items-center justify-center shadow-sm">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
