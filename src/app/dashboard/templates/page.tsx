/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import TemplateCard, { TemplateData } from "@/components/templates/TemplateCard";
import TemplateModal from "@/components/templates/TemplateModal";
import CategorySidebar, { CategoryData } from "@/components/templates/CategorySidebar";
import { useAllCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation } from "@/redux/feature/categorieSlice";
import { useAllTemplatesForAdminDashboardQuery, useCreateTemplateMutation, useDeleteTemplateMutation, useTemplateConfigQuery, useUpdateTemplateMutation } from "@/redux/feature/teamplateSlice";

// ---- MOCK DATA ----
// Unused mock data datasets removed.

type MediaType = "Video" | "Image";

export default function TemplatesPage() {
  // Navigation State
  const [mediaType, setMediaType] = useState<MediaType>("Video");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeSubcatMap, setActiveSubcatMap] = useState<Record<string, string>>({});

  const { data: templateConfigData, isLoading: templateConfigLoading } = useTemplateConfigQuery(undefined);
  console.log(templateConfigData, '==================TEAPLATE Config DATA');

  // Dynamic categories list from API config or fallback defaults
  const configCategories = useMemo(() => {
    if (templateConfigData?.data?.categories && Array.isArray(templateConfigData.data.categories) && templateConfigData.data.categories.length > 0) {
      return templateConfigData.data.categories;
    }
    return [
      { value: "features", label: "Features" },
      { value: "home", label: "Home" },
      { value: "discover", label: "Discover" },
      { value: "custom", label: "Custom" },
    ];
  }, [templateConfigData]);

  // Keep activeTab in bounds
  useEffect(() => {
    if (activeTab >= configCategories.length && configCategories.length > 0) {
      setActiveTab(0);
    }
  }, [configCategories, activeTab]);

  const activeCategoryObj = configCategories[activeTab] || configCategories[0] || { value: "features", label: "Features" };
  const categoryfor = activeCategoryObj.value;

  const activeSubcatKey = `${mediaType}_${categoryfor}`;
  const currentActiveCat = activeSubcatMap[activeSubcatKey] || "";

  const updateCurrentActiveCat = (id: string) => {
    setActiveSubcatMap((prev) => ({
      ...prev,
      [activeSubcatKey]: id,
    }));
  };

  // ---- Category Api ---
  const { data: categoryData, isLoading: categoryLoading } = useAllCategoriesQuery({ categoryfor });
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const { data: allTemplateAdminData, isLoading: allTemplateAdminLoading } = useAllTemplatesForAdminDashboardQuery(undefined);
  console.log(allTemplateAdminData, '==================ALL TEAPLATE Admin DATA');

  // Template Api 
  const [createTemplate, { isLoading: isCreating }] = useCreateTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateTemplateMutation();
  const [deleteTemplate] = useDeleteTemplateMutation();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateData | null>(null);
  const [deleteTargetCat, setDeleteTargetCat] = useState<CategoryData | null>(null);
  const [deleteTargetTemplate, setDeleteTargetTemplate] = useState<TemplateData | null>(null);

  // Deriving categories list from categoryData API response
  const currentCategories: CategoryData[] = useMemo(() => {
    return (categoryData?.data || []).map((cat: any) => ({
      id: String(cat.id),
      name: cat.name,
    }));
  }, [categoryData]);

  // Deriving templates list from allTemplateAdminData API response and filtering locally
  const currentList: TemplateData[] = useMemo(() => {
    const list = allTemplateAdminData?.data || [];

    const matchesMediaType = (item: any) => {
      const ct = (item.content_type || "").toLowerCase();
      if (ct) {
        return ct === mediaType.toLowerCase();
      }
      const gt = (item.generation_type || "").toLowerCase();
      if (mediaType === "Video") {
        return gt.startsWith("video") || gt.endsWith("video");
      } else {
        return gt.startsWith("image") || gt.startsWith("text");
      }
    };

    const filteredList = list.filter((item: any) => {
      // Safe category retrieval: prefer subcategory_detail.categoryfor to handle mismatches
      const itemCategory = item.subcategory_detail?.categoryfor
        ? String(item.subcategory_detail.categoryfor)
        : (typeof item.category === "object" && item.category !== null
          ? String(item.category.value || item.category.id || "")
          : String(item.category || ""));

      // Safe subcategory retrieval
      const itemSubcatId = item.subcategory_detail?.id
        ? String(item.subcategory_detail.id)
        : (typeof item.subcategory === "object" && item.subcategory !== null
          ? String(item.subcategory.id)
          : String(item.subcategory || ""));

      const matchesCategory = itemCategory === categoryfor;
      const matchesSubcategory = itemSubcatId === String(currentActiveCat);
      const matchesGenType = matchesMediaType(item);
      return matchesCategory && matchesSubcategory && matchesGenType;
    });

    return filteredList.map((item: any) => ({
      id: String(item.id),
      generation_type: item.generation_type || "",
      task_type: item.task_type || "",
      model_name: item.model_name || "",
      title: item.title || "",
      description: item.description || "",
      prompt: item.prompt || "",
      credit_cost: item.credit_cost || 0,
      status: item.status || "active",
      category: item.subcategory_detail?.categoryfor || item.category || "",
      subcategory: item.subcategory_detail?.id ? String(item.subcategory_detail.id) : (item.subcategory ? String(item.subcategory) : ""),
      imageUrl: item.files?.[0]?.file || "",
      thumbnailUrl: item.thumbnail_url || item.files?.[0]?.thumbnail || "",
      content_type: item.content_type || "",
      files: item.files || [],
    }));
  }, [allTemplateAdminData, mediaType, categoryfor, currentActiveCat]);

  const isSplitScreen = () => {
    return true; // All tabs/views are split screens with categories
  };

  const getTabName = (idx: number) => {
    const cat = configCategories[idx];
    if (!cat) return "";
    if (cat.value === "features") {
      return mediaType === "Video" ? "Features Video" : "Features Image";
    }
    return `${cat.label} Item`;
  };

  const getCurrentCategories = () => {
    return currentCategories;
  };

  // Handle active category selection initialization / fallback
  useEffect(() => {
    if (currentCategories.length > 0) {
      // If current active cat is empty or not in the loaded list, set it to the first category
      if (!currentActiveCat || !currentCategories.some(c => c.id === currentActiveCat)) {
        updateCurrentActiveCat(currentCategories[0].id);
      }
    } else {
      if (currentActiveCat !== "") {
        updateCurrentActiveCat("");
      }
    }
  }, [currentCategories, mediaType, activeTab, currentActiveCat]);

  // --- HELPERS ---
  const getErrorMessage = (error: any, fallback: string): string => {
    if (error?.data?.errors) {
      const errObj = error.data.errors;
      const messages = Object.entries(errObj).map(([key, val]) => {
        if (Array.isArray(val)) return val.join(", ");
        return String(val);
      });
      if (messages.length > 0) {
        return messages.join(" | ");
      }
    }
    return error?.data?.message || fallback;
  };

  // --- HANDLERS ---
  const handleOpenModal = (template?: TemplateData) => {
    setEditingTemplate(template || null);
    setIsModalOpen(true);
  };

  const handleSaveTemplate = async (data: any, files: File[], thumbnail: File | null, deletedFileIds: number[], existingFiles: any[]) => {
    const isNew = data.id === "new";
    const toastId = toast.loading(isNew ? "Creating template..." : "Updating template...");
    try {
      const formData = new FormData();
      formData.append("content_type", mediaType.toLowerCase());
      formData.append("generation_type", data.generation_type);
      formData.append("task_type", data.task_type);
      formData.append("model_name", data.model_name || "");
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("prompt", data.prompt || "");
      formData.append("credit_cost", String(data.credit_cost));
      formData.append("status", data.status || "active");
      formData.append("category", data.category);
      formData.append("subcategory", String(data.subcategory));

      // Fetch remaining existing files as binary File objects to send under 'files' field name
      const existingFileObjs: File[] = [];
      if (existingFiles && existingFiles.length > 0) {
        const fetchedFiles = await Promise.all(
          existingFiles.map(async (extFile) => {
            if (!extFile.file) return null;
            try {
              const res = await fetch(extFile.file);
              const blob = await res.blob();
              const filename =
                extFile.file.substring(extFile.file.lastIndexOf("/") + 1).split("?")[0] || "existing_file";
              return new File([blob], filename, { type: blob.type });
            } catch (err) {
              console.error("Failed to fetch existing file as binary:", err);
              return null;
            }
          })
        );
        fetchedFiles.forEach((file) => {
          if (file) existingFileObjs.push(file);
        });
      }

      // Append newly uploaded files under 'files' key
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }

      // Append existing retained files under 'files' key
      if (existingFileObjs.length > 0) {
        existingFileObjs.forEach((file) => {
          formData.append("files", file);
        });
      }

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      let result;
      if (isNew) {
        result = await createTemplate(formData).unwrap();
      } else {
        result = await updateTemplate({ id: data.id, data: formData }).unwrap();
      }

      if (result?.success) {
        toast.success(result.message || (isNew ? "Template created successfully." : "Template updated successfully."), { id: toastId });
        setIsModalOpen(false);
      } else {
        toast.error("Failed to save template.", { id: toastId });
      }
    } catch (error: any) {
      console.error("Failed to save template:", error);
      toast.error(getErrorMessage(error, "Failed to save template."), { id: toastId });
    }
  };

  const handleDeleteTemplate = (id: string) => {
    const target = currentList.find(t => t.id === id);
    if (target) {
      setDeleteTargetTemplate(target);
    }
  };

  const handleConfirmDeleteTemplate = async () => {
    if (!deleteTargetTemplate) return;
    const toastId = toast.loading("Deleting template...");
    try {
      const result = await deleteTemplate({ id: deleteTargetTemplate.id }).unwrap();
      if (result?.success) {
        toast.success(result.message || "Template deleted successfully.", { id: toastId });
        setDeleteTargetTemplate(null);
      } else {
        toast.error("Failed to delete template.", { id: toastId });
      }
    } catch (error: any) {
      console.error("Failed to delete template:", error);
      toast.error(getErrorMessage(error, "Failed to delete template."), { id: toastId });
    }
  };

  // --- CATEGORY HANDLERS ---
  const handleSelectCategory = (id: string) => {
    updateCurrentActiveCat(id);
  };

  const handleAddCategory = async (name: string) => {
    const toastId = toast.loading("Creating category...");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("categoryfor", categoryfor);

      const result = await createCategory(formData).unwrap();
      if (result?.success) {
        toast.success(result.message || "Category created successfully.", { id: toastId });
        if (result?.data?.id) {
          updateCurrentActiveCat(String(result.data.id));
        }
      } else {
        toast.error("Failed to create category.", { id: toastId });
      }
    } catch (error: any) {
      console.error("Failed to create category:", error);
      toast.error(getErrorMessage(error, "Failed to create category."), { id: toastId });
    }
  };

  const handleEditCategory = async (id: string, newName: string) => {
    const toastId = toast.loading("Updating category...");
    try {
      const formData = new FormData();
      formData.append("name", newName);
      formData.append("categoryfor", categoryfor);

      const result = await updateCategory({ id, data: formData }).unwrap();
      if (result?.success) {
        toast.success(result.message || "Category updated successfully.", { id: toastId });
      } else {
        toast.error("Failed to update category.", { id: toastId });
      }
    } catch (error: any) {
      console.error("Failed to update category:", error);
      toast.error(getErrorMessage(error, "Failed to update category."), { id: toastId });
    }
  };

  const handleDeleteCategory = (id: string) => {
    const cat = currentCategories.find(c => c.id === id);
    if (cat) {
      setDeleteTargetCat(cat);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deleteTargetCat) return;
    const toastId = toast.loading("Deleting category...");
    try {
      const result = await deleteCategory({ id: deleteTargetCat.id }).unwrap();
      if (result?.success) {
        toast.success(result.message || "Category deleted successfully.", { id: toastId });
        if (currentActiveCat === deleteTargetCat.id) {
          updateCurrentActiveCat("");
        }
        setDeleteTargetCat(null);
      } else {
        toast.error("Failed to delete category.", { id: toastId });
      }
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      toast.error(getErrorMessage(error, "Failed to delete category."), { id: toastId });
    }
  };

  // Handle Modal Title Logic
  const getModalTitle = () => {
    if (editingTemplate) return `Edit ${getTabName(activeTab)}`;
    if (isSplitScreen() && currentActiveCat) {
      const catName = currentCategories.find(c => c.id === currentActiveCat)?.name;
      return `Add a Template ( ${catName} )`;
    }
    return `Add a Template ( ${getTabName(activeTab)} )`;
  };

  return (
    <div className="bg-[#242424] rounded-xl p-6 lg:p-8 shadow-sm flex flex-col min-h-[600px] text-white">

      {/* 1. TOP TOGGLE (Video / Image) */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => { setMediaType("Video"); setActiveTab(0); }}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${mediaType === "Video" ? "bg-white text-black" : "bg-[#2A2A2A] text-[#A3A3A3] hover:text-white"
            }`}
        >
          Video
        </button>
        <button
          onClick={() => { setMediaType("Image"); setActiveTab(0); }}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${mediaType === "Image" ? "bg-white text-black" : "bg-[#2A2A2A] text-[#A3A3A3] hover:text-white"
            }`}
        >
          Image
        </button>
      </div>

      {/* 2. SUB NAVIGATION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#3E3E3E] pb-4 mb-6">
        <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-none">
          {configCategories.map((cat: any, idx: number) => {
            const tabName = getTabName(idx);
            return (
              <button
                key={cat.value || idx}
                onClick={() => setActiveTab(idx)}
                className={`pb-4 -mb-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === idx ? "text-[#FF9F05]" : "text-[#A3A3A3] hover:text-white"
                }`}
              >
                {tabName}
                {activeTab === idx && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9F05]"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Add Button for list view only */}
        {!isSplitScreen() && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#FF9F05] text-white hover:bg-[#FF9F05]/90 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New {getTabName(activeTab)}
          </button>
        )}
      </div>

      {/* 3. MAIN CONTENT AREA */}

      {/* LAYOUT A: Standard List */}
      {!isSplitScreen() && (
        <div className="flex flex-col gap-4">
          {currentList.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={handleOpenModal}
              onDelete={handleDeleteTemplate}
            />
          ))}
          {currentList.length === 0 && (
            <div className="text-center py-12 text-[#A3A3A3]">No templates found.</div>
          )}
        </div>
      )}

      {/* LAYOUT B: Split Screen */}
      {isSplitScreen() && (
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left Column: Categories */}
          {categoryLoading ? (
            <div className="flex flex-col items-center justify-center w-full lg:w-[280px] shrink-0 p-8 bg-[#2A2A2A] rounded-2xl min-h-[200px] border border-white/5">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF9F05]" />
              <span className="text-xs mt-2 text-[#A3A3A3]">Loading Categories...</span>
            </div>
          ) : (
            <CategorySidebar
              categories={currentCategories}
              activeCategoryId={currentActiveCat}
              onSelectCategory={handleSelectCategory}
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {/* Right Column: Templates */}
          <div className="flex-1 flex flex-col w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-white">{currentList.length} Item</h2>
              <button
                onClick={() => handleOpenModal()}
                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors shadow-lg shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {allTemplateAdminLoading ? (
              <div className="flex flex-col gap-4 w-full">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-[#2C2C2C]/50 border border-[#3E3E3E] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 animate-pulse w-full">
                    {/* Image Block Skeleton */}
                    <div className="w-full sm:w-[200px] h-[140px] shrink-0 rounded-xl bg-[#242424] border border-[#3E3E3E]" />

                    {/* Content Block Skeleton */}
                    <div className="flex flex-col gap-3 flex-1 pr-16 sm:pr-20 w-full">
                      <div className="h-5 bg-[#3E3E3E] rounded w-1/3" />
                      <div className="h-4 bg-[#3E3E3E] rounded w-2/3" />
                      <div className="mt-2 pl-4 border-l-2 border-[#3E3E3E] flex flex-col gap-2 w-full">
                        <div className="h-3 bg-[#3E3E3E] rounded w-full" />
                        <div className="h-3 bg-[#3E3E3E] rounded w-5/6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {currentList.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={handleOpenModal}
                    onDelete={handleDeleteTemplate}
                  />
                ))}
                {currentList.length === 0 && (
                  <div className="text-center py-12 text-[#A3A3A3]">No templates found in this category.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL */}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTemplate}
        template={editingTemplate}
        modalTitle={getModalTitle()}
        submitText={editingTemplate ? "Save Changes" : "Add Now"}
        isLoading={isCreating || isUpdating}
        configData={templateConfigData?.data}
        defaultCategory={categoryfor}
        defaultSubcategory={currentActiveCat}
        mediaType={mediaType}
      />

      {/* DELETE CATEGORY CONFIRMATION MODAL */}
      {deleteTargetCat !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#2C2C2C] border border-[#3E3E3E] rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-white">
            <div className="flex items-center gap-3 text-red-500">
              <div className="bg-red-500/10 p-2.5 rounded-full border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Delete Category?</h3>
            </div>

            <p className="text-sm text-[#A3A3A3] leading-relaxed">
              Are you sure you want to delete category <strong className="text-white">{deleteTargetCat.name}</strong>?
              This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 mt-2 justify-end">
              <button
                onClick={() => setDeleteTargetCat(null)}
                className="px-5 py-2.5 rounded-full bg-[#3E3E3E] text-white text-sm font-medium hover:bg-[#4a4a4a] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteCategory}
                className="px-5 py-2.5 rounded-full bg-[#FF4C4C] hover:bg-[#FF4C4C]/90 text-white text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE TEMPLATE CONFIRMATION MODAL */}
      {deleteTargetTemplate !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#2C2C2C] border border-[#3E3E3E] rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-white">
            <div className="flex items-center gap-3 text-red-500">
              <div className="bg-red-500/10 p-2.5 rounded-full border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Delete Template?</h3>
            </div>

            <p className="text-sm text-[#A3A3A3] leading-relaxed">
              Are you sure you want to delete template <strong className="text-white">{deleteTargetTemplate.title}</strong>?
              This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 mt-2 justify-end">
              <button
                onClick={() => setDeleteTargetTemplate(null)}
                className="px-5 py-2.5 rounded-full bg-[#3E3E3E] text-white text-sm font-medium hover:bg-[#4a4a4a] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteTemplate}
                className="px-5 py-2.5 rounded-full bg-[#FF4C4C] hover:bg-[#FF4C4C]/90 text-white text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
