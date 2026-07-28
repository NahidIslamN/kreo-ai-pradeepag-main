/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { X, ImagePlus, Loader2, Video } from "lucide-react";
import { toast } from "sonner";
import { TemplateData } from "./TemplateCard";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, file: File | null, thumbnail: File | null) => void;
  template?: TemplateData | null;
  modalTitle: string;
  submitText: string;
  isLoading?: boolean;
  configData?: any;
}

export default function TemplateModal({
  isOpen,
  onClose,
  onSave,
  template,
  modalTitle,
  submitText,
  isLoading = false,
  configData,
}: TemplateModalProps) {
  const [formData, setFormData] = useState({
    generation_type: "",
    task_type: "",
    model_name: "",
    title: "",
    description: "",
    prompt: "",
    credit_cost: 0,
    status: "active",
    category: "",
    subcategory: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);

  const [filePreview, setFilePreview] = useState<string>("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  // Extract config elements
  const generationTypes = configData?.generation_types || [];
  const statuses = configData?.statuses || [];
  const categories = configData?.categories || [];
  const dbSubcategories = configData?.db_subcategories || [];

  // Reset form when modal opens or template changes
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setSelectedThumbnail(null);

      if (template) {
        setFormData({
          generation_type: template.generation_type || "",
          task_type: template.task_type || "",
          model_name: template.model_name || "",
          title: template.title || "",
          description: template.description || "",
          prompt: template.prompt || "",
          credit_cost: template.credit_cost || 0,
          status: template.status || "active",
          category: template.category || "",
          subcategory: template.subcategory ? String(template.subcategory) : "",
        });
        setFilePreview(template.imageUrl || "");
        setThumbnailPreview(template.thumbnailUrl || "");
      } else {
        // Pre-populate with first available options if any
        setFormData({
          generation_type: generationTypes[0]?.value || "",
          task_type: "",
          model_name: "",
          title: "",
          description: "",
          prompt: "",
          credit_cost: 0,
          status: "active",
          category: categories[0]?.value || "",
          subcategory: "",
        });
        setFilePreview("");
        setThumbnailPreview("");
      }
    }
  }, [isOpen, template, configData]);

  // Dynamically derive task types based on selected generation type
  const activeGenType = generationTypes.find((gt: any) => gt.value === formData.generation_type);
  const taskTypes = activeGenType?.task_types || [];

  // Automatically update task_type when generation_type changes if current task_type is invalid
  useEffect(() => {
    const activeGen = generationTypes.find((gt: any) => gt.value === formData.generation_type);
    const tasks = activeGen?.task_types || [];
    if (isOpen && tasks.length > 0) {
      if (!tasks.some((tt: any) => tt.value === formData.task_type)) {
        setFormData((prev) => ({
          ...prev,
          task_type: tasks[0].value,
          model_name: tasks[0].models?.[0]?.value || "",
        }));
      }
    }
  }, [formData.generation_type, generationTypes, isOpen]);

  // Dynamically derive models based on selected task type
  const activeTaskType = taskTypes.find((tt: any) => tt.value === formData.task_type);
  const modelsList = activeTaskType?.models || [];

  // Automatically update model_name when task_type changes
  useEffect(() => {
    const activeGen = generationTypes.find((gt: any) => gt.value === formData.generation_type);
    const tasks = activeGen?.task_types || [];
    const activeTask = tasks.find((tt: any) => tt.value === formData.task_type);
    const models = activeTask?.models || [];
    
    if (isOpen) {
      if (models.length > 0) {
        if (!models.some((m: any) => m.value === formData.model_name)) {
          setFormData((prev) => ({
            ...prev,
            model_name: models[0].value,
          }));
        }
      } else {
        if (formData.model_name !== "") {
          setFormData((prev) => ({
            ...prev,
            model_name: "",
          }));
        }
      }
    }
  }, [formData.task_type, formData.generation_type, generationTypes, isOpen]);

  // Filter subcategories based on chosen category
  const filteredSubcategories = dbSubcategories.filter(
    (sub: any) => sub.categoryfor === formData.category
  );

  // Automatically select first subcategory of the active category if none chosen or invalid
  useEffect(() => {
    const subs = dbSubcategories.filter(
      (sub: any) => sub.categoryfor === formData.category
    );
    if (isOpen) {
      if (subs.length > 0) {
        if (!subs.some((sub: any) => String(sub.id) === formData.subcategory)) {
          setFormData((prev) => ({
            ...prev,
            subcategory: String(subs[0].id),
          }));
        }
      } else {
        if (formData.subcategory !== "") {
          setFormData((prev) => ({
            ...prev,
            subcategory: "",
          }));
        }
      }
    }
  }, [formData.category, dbSubcategories, isOpen]);

  if (!isOpen) return null;

  // Determine if a field is required by the active task_type
  const isFieldRequired = (fieldName: string) => {
    if (!activeTaskType) return false;
    return activeTaskType.require_fields?.includes(fieldName) ?? false;
  };

  const isFilesFieldNeeded = () => {
    if (!activeTaskType) return true;
    return activeTaskType.require_fields?.includes("files") ?? true;
  };

  const isThumbnailFieldNeeded = () => {
    if (!activeTaskType) return true;
    return activeTaskType.require_fields?.includes("thumbnail") ?? true;
  };

  const isVideoFile = (urlOrFile: string | File | null): boolean => {
    if (!urlOrFile) return false;
    if (urlOrFile instanceof File) {
      return urlOrFile.type.startsWith("video/");
    }
    const cleanUrl = urlOrFile.split("?")[0].toLowerCase();
    return (
      cleanUrl.endsWith(".mp4") ||
      cleanUrl.endsWith(".webm") ||
      cleanUrl.endsWith(".ogg") ||
      cleanUrl.endsWith(".mov") ||
      cleanUrl.includes("/video/")
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required files
    if (isFieldRequired("files") && isFilesFieldNeeded() && !template && !selectedFile) {
      toast.error("Please upload the main template media file (Video/Image).");
      return;
    }
    if (isFieldRequired("thumbnail") && isThumbnailFieldNeeded() && !template && !selectedThumbnail) {
      toast.error("Please upload a thumbnail image file.");
      return;
    }

    onSave(
      {
        id: template?.id || "new",
        ...formData,
      },
      selectedFile,
      selectedThumbnail
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-[#1A1A1A] w-full max-w-5xl rounded-2xl shadow-2xl border border-[#3E3E3E] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#3E3E3E]">
          <h2 className="text-xl font-semibold text-white">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="text-[#A3A3A3] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto">
          <form id="templateForm" onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
            {/* Left Column: Two File Uploaders (Media + Thumbnail) */}
            {(isFilesFieldNeeded() || isThumbnailFieldNeeded()) && (
              <div className="w-full md:w-[280px] shrink-0 flex flex-col gap-6">
                {/* 1. Main Media File (files) */}
                {isFilesFieldNeeded() && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white flex items-center gap-1">
                      Template Media {isFieldRequired("files") && <span className="text-[#FF4C4C]">*</span>}
                    </label>
                    <div className="w-full aspect-video bg-[#242424] border border-dashed border-[#555555] rounded-xl flex flex-col items-center justify-center text-[#A3A3A3] cursor-pointer hover:bg-[#2A2A2A] transition-colors relative overflow-hidden group min-h-[140px]">
                      {filePreview ? (
                        <>
                          {isVideoFile(selectedFile || filePreview) ? (
                            <video
                              src={filePreview}
                              className="w-full h-full object-cover"
                              autoPlay
                              loop
                              muted
                              playsInline
                            />
                          ) : (
                            <img src={filePreview} alt="Media Preview" className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="text-white text-xs font-medium">Change Media</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Video className="w-6 h-6 mb-2 opacity-50" />
                          <span className="text-xs font-medium">Upload Media (Video/Image)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="video/*,image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setSelectedFile(file);
                            setFilePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* 2. Thumbnail File (thumbnail) */}
                {isThumbnailFieldNeeded() && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white flex items-center gap-1">
                      Thumbnail {isFieldRequired("thumbnail") && <span className="text-[#FF4C4C]">*</span>}
                    </label>
                    <div className="w-full aspect-video bg-[#242424] border border-dashed border-[#555555] rounded-xl flex flex-col items-center justify-center text-[#A3A3A3] cursor-pointer hover:bg-[#2A2A2A] transition-colors relative overflow-hidden group min-h-[140px]">
                      {thumbnailPreview ? (
                        <>
                          {isVideoFile(selectedThumbnail || thumbnailPreview) ? (
                            <video
                              src={thumbnailPreview}
                              className="w-full h-full object-cover"
                              autoPlay
                              loop
                              muted
                              playsInline
                            />
                          ) : (
                            <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="text-white text-xs font-medium">Change Thumbnail</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <ImagePlus className="w-6 h-6 mb-2 opacity-50" />
                          <span className="text-xs font-medium">Upload Thumbnail (Video/Image)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="video/*,image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setSelectedThumbnail(file);
                            setThumbnailPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Right Column: Form Fields */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Generation Type */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white flex items-center gap-1">
                  Generation Type {isFieldRequired("generation_type") && <span className="text-[#FF4C4C]">*</span>}
                </label>
                <select
                  required={isFieldRequired("generation_type")}
                  value={formData.generation_type}
                  onChange={(e) => setFormData({ ...formData, generation_type: e.target.value })}
                  className="w-full bg-[#242424] border border-[#3E3E3E] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#777777] transition-colors text-sm"
                >
                  <option value="" disabled>Select Generation Type</option>
                  {generationTypes.map((gt: any) => (
                    <option key={gt.value} value={gt.value}>{gt.label}</option>
                  ))}
                </select>
              </div>

              {/* Task Type */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white flex items-center gap-1">
                  Task Type {isFieldRequired("task_type") && <span className="text-[#FF4C4C]">*</span>}
                </label>
                <select
                  required={isFieldRequired("task_type")}
                  value={formData.task_type}
                  onChange={(e) => setFormData({ ...formData, task_type: e.target.value })}
                  className="w-full bg-[#242424] border border-[#3E3E3E] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#777777] transition-colors text-sm"
                >
                  <option value="" disabled>Select Task Type</option>
                  {taskTypes.map((tt: any) => (
                    <option key={tt.value} value={tt.value}>{tt.label}</option>
                  ))}
                </select>
              </div>

              {/* Model Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white flex items-center gap-1">
                  Model Name {isFieldRequired("model_name") && <span className="text-[#FF4C4C]">*</span>}
                </label>
                {modelsList.length > 0 ? (
                  <select
                    required={isFieldRequired("model_name")}
                    value={formData.model_name}
                    onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                    className="w-full bg-[#242424] border border-[#3E3E3E] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#777777] transition-colors text-sm"
                  >
                    <option value="" disabled>Select Model</option>
                    {modelsList.map((m: any) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required={isFieldRequired("model_name")}
                    value={formData.model_name}
                    placeholder="Enter model name"
                    onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                    className="w-full bg-[#242424] border border-[#3E3E3E] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#777777] transition-colors text-sm"
                  />
                )}
              </div>

              {/* Credit Cost */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white flex items-center gap-1">
                  Credit Cost {isFieldRequired("credit_cost") && <span className="text-[#FF4C4C]">*</span>}
                </label>
                <input
                  type="number"
                  min="0"
                  required={isFieldRequired("credit_cost")}
                  value={formData.credit_cost}
                  onChange={(e) => setFormData({ ...formData, credit_cost: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#242424] border border-[#3E3E3E] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#777777] transition-colors text-sm"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white flex items-center gap-1">
                  Category {isFieldRequired("category") && <span className="text-[#FF4C4C]">*</span>}
                </label>
                <select
                  required={isFieldRequired("category")}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#242424] border border-[#3E3E3E] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#777777] transition-colors text-sm"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((c: any) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white flex items-center gap-1">
                  Subcategory {isFieldRequired("subcategory") && <span className="text-[#FF4C4C]">*</span>}
                </label>
                <select
                  required={isFieldRequired("subcategory")}
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full bg-[#242424] border border-[#3E3E3E] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#777777] transition-colors text-sm"
                >
                  <option value="" disabled>Select Subcategory</option>
                  {filteredSubcategories.map((sub: any) => (
                    <option key={sub.id} value={String(sub.id)}>{sub.name}</option>
                  ))}
                </select>
              </div>


              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white flex items-center gap-1">
                  Title {isFieldRequired("title") && <span className="text-[#FF4C4C]">*</span>}
                </label>
                <input
                  type="text"
                  required={isFieldRequired("title")}
                  value={formData.title}
                  placeholder="Enter template title"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#242424] border border-[#3E3E3E] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#777777] transition-colors text-sm"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-sm font-medium text-white flex items-center gap-1">
                  Description {isFieldRequired("description") && <span className="text-[#FF4C4C]">*</span>}
                </label>
                <textarea
                  required={isFieldRequired("description")}
                  rows={2}
                  value={formData.description}
                  placeholder="Enter description"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#242424] border border-[#3E3E3E] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#777777] transition-colors text-sm resize-none"
                />
              </div>

              {/* Prompt */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-sm font-medium text-white flex items-center gap-1">
                  Prompt {isFieldRequired("prompt") && <span className="text-[#FF4C4C]">*</span>}
                </label>
                <textarea
                  required={isFieldRequired("prompt")}
                  rows={3}
                  value={formData.prompt}
                  placeholder="Enter prompt"
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  className="w-full bg-[#242424] border border-[#3E3E3E] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#777777] transition-colors text-sm resize-none"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#3E3E3E] flex items-center justify-end gap-4 bg-[#1A1A1A]">
          <button
            onClick={onClose}
            type="button"
            disabled={isLoading}
            className="px-8 py-2.5 rounded-full bg-[#3E3E3E] text-white text-sm font-medium hover:bg-[#4a4a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="templateForm"
            disabled={isLoading}
            className="px-8 py-2.5 rounded-full bg-white text-[#1A1A1A] text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
}
