import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export interface TemplateFile {
  id: number;
  file: string;
  type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TemplateData {
  id: string;
  generation_type?: string;
  task_type?: string;
  model_name?: string;
  title: string;
  description: string;
  prompt: string;
  credit_cost?: number;
  status?: string;
  category?: string;
  subcategory?: number | string;
  imageUrl?: string;
  thumbnailUrl?: string;
  content_type?: string;
  files?: TemplateFile[];
}

interface TemplateCardProps {
  template: TemplateData;
  onEdit: (template: TemplateData) => void;
  onDelete: (id: string) => void;
}

const isVideoFile = (url: string | undefined): boolean => {
  if (!url) return false;
  const cleanUrl = url.split("?")[0].toLowerCase();
  return (
    cleanUrl.endsWith(".mp4") ||
    cleanUrl.endsWith(".webm") ||
    cleanUrl.endsWith(".ogg") ||
    cleanUrl.endsWith(".mov") ||
    cleanUrl.includes("/video/")
  );
};

export default function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  return (
    <div className="bg-[#2C2C2C] border border-[#3E3E3E] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group hover:bg-[#323232] transition-colors relative">

      {/* Top Right Actions (absolute on mobile or right-aligned) */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-3">
        <button
          onClick={() => onEdit(template)}
          className="text-[#A3A3A3] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
          aria-label="Edit Template"
        >
          <Pencil className="w-[18px] h-[18px]" />
        </button>
        <button
          onClick={() => onDelete(template.id)}
          className="text-[#A3A3A3] hover:text-[#FF4C4C] transition-colors p-1.5 rounded-lg hover:bg-white/10"
          aria-label="Delete Template"
        >
          <Trash2 className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Image/Video Block */}
      <div className="w-full sm:w-[200px] h-[140px] shrink-0 rounded-xl overflow-hidden bg-[#1F1F1F] relative border border-[#3E3E3E]">
        {template.imageUrl ? (
          isVideoFile(template.imageUrl) ? (
            <video
              src={template.imageUrl}
              poster={template.thumbnailUrl && !isVideoFile(template.thumbnailUrl) ? template.thumbnailUrl : undefined}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={template.imageUrl}
              alt={template.title}
              className="w-full h-full object-cover"
            />
          )
        ) : template.thumbnailUrl ? (
          isVideoFile(template.thumbnailUrl) ? (
            <video
              src={template.thumbnailUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={template.thumbnailUrl}
              alt={template.title}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#A3A3A3] text-sm">
            No Media
          </div>
        )}
      </div>


      {/* Content Block */}
      <div className="flex flex-col gap-3 flex-1 pr-16 sm:pr-20">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-white font-semibold text-lg">Title: {template.title}</h3>
          {/* {template.credit_cost !== undefined && (
            <span className="bg-[#FF9F05]/10 text-[#FF9F05] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#FF9F05]/20">
              {template.credit_cost} Credits
            </span>
          )} */}
          {template.status && (
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${template.status === "active"
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : template.status === "draft"
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                : "bg-gray-500/10 text-gray-400 border-gray-500/20"
              }`}>
              {template.status}
            </span>
          )}
        </div>

        <p className="text-[#A3A3A3] text-sm">Description: {template.description}</p>

        {/* Badges for types and models */}
        {(template.generation_type || template.task_type || template.model_name) && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#A3A3A3] bg-[#1F1F1F] p-2 rounded-xl border border-[#3E3E3E] w-fit">
            {template.generation_type && (
              <span className="px-2 py-0.5 bg-[#2A2A2A] rounded-md border border-[#3E3E3E] font-mono">
                Gen: {template.generation_type}
              </span>
            )}
            {template.task_type && (
              <span className="px-2 py-0.5 bg-[#2A2A2A] rounded-md border border-[#3E3E3E] font-mono">
                Task: {template.task_type}
              </span>
            )}
            {template.model_name && (
              <span className="px-2 py-0.5 bg-[#2A2A2A] rounded-md border border-[#3E3E3E] font-mono truncate max-w-[200px]" title={template.model_name}>
                Model: {template.model_name}
              </span>
            )}
          </div>
        )}

        {/* Prompt with left border */}
        {template.prompt && (
          <div className="mt-2 pl-4 border-l-2 border-[#555555]">
            <p className="text-[#A3A3A3] text-sm leading-relaxed line-clamp-3">
              Prompt: {template.prompt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
