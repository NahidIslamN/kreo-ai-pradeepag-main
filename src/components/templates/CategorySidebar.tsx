import React, { useState } from "react";
import { Pencil, Trash2, Plus, Check } from "lucide-react";

export interface CategoryData {
  id: string;
  name: string;
}

interface CategorySidebarProps {
  categories: CategoryData[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  onAddCategory: (name: string) => void;
  onEditCategory: (id: string, newName: string) => void;
  onDeleteCategory: (id: string) => void;
}

export default function CategorySidebar({
  categories,
  activeCategoryId,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: CategorySidebarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAddSubmit = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName("");
      setIsAdding(false);
    }
  };

  const handleEditSubmit = (id: string) => {
    if (editName.trim()) {
      onEditCategory(id, editName.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full lg:w-[280px] shrink-0">
      
      {categories.map((cat) => {
        const isActive = cat.id === activeCategoryId;
        const isEditing = cat.id === editingId;

        return (
          <div 
            key={cat.id}
            onClick={() => !isEditing && onSelectCategory(cat.id)}
            className={`flex items-center justify-between p-4 rounded-2xl transition-colors cursor-pointer group ${
              isActive 
                ? "bg-white text-black" 
                : "bg-[#2A2A2A] text-white hover:bg-[#323232]"
            }`}
          >
            {isEditing ? (
              <div className="flex items-center w-full gap-2" onClick={(e) => e.stopPropagation()}>
                <input 
                  autoFocus
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit(cat.id)}
                  className="bg-transparent border-b border-[#555555] focus:border-white focus:outline-none w-full text-sm py-1"
                />
                <button onClick={() => handleEditSubmit(cat.id)} className="p-1 hover:bg-black/10 rounded">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <span className="font-medium text-sm">{cat.name}</span>
                <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "text-[#555555]" : "text-[#A3A3A3]"}`}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(cat.id);
                      setEditName(cat.name);
                    }}
                    className={`p-1 rounded-md ${isActive ? "hover:bg-black/10 hover:text-black" : "hover:bg-white/10 hover:text-white"}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(cat.id);
                    }}
                    className={`p-1 rounded-md ${isActive ? "hover:bg-black/10 hover:text-red-600" : "hover:bg-white/10 hover:text-red-400"}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Add Category Block */}
      {isAdding ? (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#2A2A2A] text-white">
          <div className="flex items-center w-full gap-2">
            <input 
              autoFocus
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubmit()}
              className="bg-transparent border-b border-[#555555] focus:border-white focus:outline-none w-full text-sm py-1"
            />
            <button onClick={handleAddSubmit} className="p-1 hover:bg-white/10 rounded text-white">
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-2">
          <button 
            onClick={() => setIsAdding(true)}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}

    </div>
  );
}
