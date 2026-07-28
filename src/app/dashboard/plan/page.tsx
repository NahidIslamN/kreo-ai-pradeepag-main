"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, X, Check, ChevronDown } from "lucide-react";

// Types
interface Plan {
  id: string;
  name: string;
  coin: number;
  rate: string;
  status: "Active" | "Inactive";
  priceId: string;
  productId: string;
  descriptions: string[];
}

// Initial Mock Data
const INITIAL_PLANS: Plan[] = [
  { id: "1", name: "Monthly", coin: 9500, rate: "$4500", status: "Active", priceId: "prc_1", productId: "prod_1", descriptions: ["Write here", "Write here"] },
  { id: "2", name: "Weekly", coin: 9500, rate: "$4500", status: "Inactive", priceId: "prc_2", productId: "prod_2", descriptions: ["Write here"] },
  { id: "3", name: "One time", coin: 9500, rate: "$4500", status: "Active", priceId: "prc_3", productId: "prod_3", descriptions: ["Write here"] },
];

export default function PlanPage() {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [activeTab, setActiveTab] = useState("Subscription Package");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  
  // Dropdown State
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Plan, "id">>({
    name: "",
    coin: 0,
    rate: "",
    status: "Active",
    priceId: "",
    productId: "",
    descriptions: ["", "", "", ""],
  });

  // Open modal for Create
  const handleAddNew = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      coin: 0,
      rate: "",
      status: "Active",
      priceId: "",
      productId: "",
      descriptions: ["", "", "", ""], // 4 default empty description slots
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      coin: plan.coin,
      rate: plan.rate,
      status: plan.status,
      priceId: plan.priceId,
      productId: plan.productId,
      // Ensure we have at least 4 description slots for the UI
      descriptions: [...plan.descriptions, "", "", "", ""].slice(0, 4),
    });
    setIsModalOpen(true);
  };

  // Delete plan
  const handleDelete = (id: string) => {
    if(confirm("Are you sure you want to delete this plan?")) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  // Save changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up empty descriptions
    const cleanDescriptions = formData.descriptions.filter(d => d.trim() !== "");

    if (editingPlan) {
      // Update
      setPlans(plans.map(p => p.id === editingPlan.id ? { ...formData, descriptions: cleanDescriptions, id: p.id } : p));
    } else {
      // Create
      const newPlan: Plan = {
        ...formData,
        descriptions: cleanDescriptions,
        id: Math.random().toString(36).substr(2, 9),
      };
      setPlans([...plans, newPlan]);
    }
    setIsModalOpen(false);
  };

  const handleDescChange = (index: number, value: string) => {
    const newDesc = [...formData.descriptions];
    newDesc[index] = value;
    setFormData({ ...formData, descriptions: newDesc });
  };

  const toggleStatusDropdown = (id: string) => {
    if (openDropdownId === id) setOpenDropdownId(null);
    else setOpenDropdownId(id);
  };

  const changeStatus = (id: string, newStatus: "Active" | "Inactive") => {
    setPlans(plans.map(p => p.id === id ? { ...p, status: newStatus } : p));
    setOpenDropdownId(null);
  };

  return (
    <div className="bg-[#242424] rounded-xl p-6 shadow-sm flex flex-col h-full min-h-[600px] text-white relative">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#3E3E3E] w-full sm:w-auto">
          {["Subscription Package", "Credit"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab ? "text-[#FF9F05]" : "text-[#A3A3A3] hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#FF9F05]"></span>
              )}
            </button>
          ))}
        </div>

        {/* Add New Plan Button */}
        <button 
          onClick={handleAddNew}
          className="bg-white text-[#242424] hover:bg-gray-100 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Plan
        </button>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-[#A3A3A3] text-sm border-b border-[#3E3E3E]">
              <th className="py-4 px-4 font-medium">Name</th>
              <th className="py-4 px-4 font-medium">Coin</th>
              <th className="py-4 px-4 font-medium">Rate</th>
              <th className="py-4 px-4 font-medium">Status</th>
              <th className="py-4 px-4 font-medium w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-b border-[#3E3E3E] hover:bg-white/5 transition-colors group">
                <td className="py-4 px-4 text-sm font-medium text-white">{plan.name}</td>
                <td className="py-4 px-4 text-sm text-[#CCCCCC]">{plan.coin}</td>
                <td className="py-4 px-4 text-sm text-[#CCCCCC]">{plan.rate}</td>
                <td className="py-4 px-4 relative">
                  {/* Status Dropdown */}
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => toggleStatusDropdown(plan.id)}
                      className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-xs font-medium min-w-[90px] border ${
                        plan.status === "Active" 
                          ? "bg-[#054F31]/20 text-[#00E573] border-[#00E573]/20" 
                          : "bg-[#3E3E3E]/50 text-[#A3A3A3] border-[#3E3E3E]"
                      }`}
                    >
                      {plan.status}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openDropdownId === plan.id && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-[#1A1A1A] border border-[#3E3E3E] rounded-lg shadow-xl z-50 overflow-hidden">
                        <button
                          onClick={() => changeStatus(plan.id, "Active")}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-[#00E573] hover:bg-white/5 transition-colors"
                        >
                          Active
                        </button>
                        <button
                          onClick={() => changeStatus(plan.id, "Inactive")}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-[#A3A3A3] hover:bg-white/5 transition-colors"
                        >
                          Inactive
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEdit(plan)} className="text-[#A3A3A3] hover:text-white transition-colors p-1">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(plan.id)} className="text-[#A3A3A3] hover:text-[#FF4C4C] transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {plans.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#A3A3A3]">No plans found. Create one to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          
          {/* Modal Content */}
          <div className="bg-[#1F1F1F] rounded-2xl w-full max-w-2xl border border-[#3E3E3E] shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#3E3E3E]">
              <h2 className="text-xl font-medium text-white">
                {editingPlan ? "Edit Plan" : "Add New Plan"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#A3A3A3] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Plan Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white block">Plan name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Monthly"
                  className="w-full px-4 py-3 bg-transparent border border-[#3E3E3E] rounded-xl text-white placeholder:text-[#666666] focus:outline-none focus:border-[#777777] focus:ring-1 focus:ring-[#777777] transition-all"
                />
              </div>

              {/* Price & Coin Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white block">Price</label>
                  <input
                    type="text"
                    required
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    placeholder="$99.00"
                    className="w-full px-4 py-3 bg-transparent border border-[#3E3E3E] rounded-xl text-white placeholder:text-[#666666] focus:outline-none focus:border-[#777777] focus:ring-1 focus:ring-[#777777] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white block">Coin</label>
                  <input
                    type="number"
                    required
                    value={formData.coin || ""}
                    onChange={(e) => setFormData({ ...formData, coin: parseInt(e.target.value) || 0 })}
                    placeholder="4500"
                    className="w-full px-4 py-3 bg-transparent border border-[#3E3E3E] rounded-xl text-white placeholder:text-[#666666] focus:outline-none focus:border-[#777777] focus:ring-1 focus:ring-[#777777] transition-all"
                  />
                </div>
              </div>

              {/* Price ID & Product ID Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white block">Price ID</label>
                  <input
                    type="text"
                    required
                    value={formData.priceId}
                    onChange={(e) => setFormData({ ...formData, priceId: e.target.value })}
                    placeholder="prc_..."
                    className="w-full px-4 py-3 bg-transparent border border-[#3E3E3E] rounded-xl text-white placeholder:text-[#666666] focus:outline-none focus:border-[#777777] focus:ring-1 focus:ring-[#777777] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white block">Product ID</label>
                  <input
                    type="text"
                    required
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    placeholder="prod_..."
                    className="w-full px-4 py-3 bg-transparent border border-[#3E3E3E] rounded-xl text-white placeholder:text-[#666666] focus:outline-none focus:border-[#777777] focus:ring-1 focus:ring-[#777777] transition-all"
                  />
                </div>
              </div>

              {/* Add Description List */}
              <div className="space-y-3 bg-[#1A1A1A] p-5 rounded-xl border border-[#3E3E3E]">
                <label className="text-sm font-medium text-white block mb-2">Add Description</label>
                {formData.descriptions.map((desc, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#3E3E3E] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#A3A3A3]" />
                    </div>
                    <input
                      type="text"
                      value={desc}
                      onChange={(e) => handleDescChange(index, e.target.value)}
                      placeholder="Write here"
                      className="w-full bg-transparent border-none text-sm text-white placeholder:text-[#666666] focus:outline-none focus:ring-0"
                    />
                  </div>
                ))}
              </div>

            </form>

            {/* Footer Actions */}
            <div className="p-6 border-t border-[#3E3E3E] flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-[#3E3E3E] text-white font-medium py-3.5 rounded-full hover:bg-[#4a4a4a] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                type="button"
                className="flex-1 bg-white text-[#242424] font-medium py-3.5 rounded-full hover:bg-gray-100 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
