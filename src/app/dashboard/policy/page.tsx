"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Pencil, Loader2 } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";
import { useGetLegacyPolicyQuery, useUpdateLegacyPolicyMutation } from "@/redux/feature/settingSlice";
import { toast } from "sonner";

// Dynamically import ReactQuill to avoid SSR issues with Next.js
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type TabType = "About Kreo AI" | "Privacy Policy" | "Terms & Service";

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState<TabType>("About Kreo AI");
  const [isEditing, setIsEditing] = useState(false);
  const [policies, setPolicies] = useState<Record<TabType, string>>({
    "About Kreo AI": "",
    "Privacy Policy": "",
    "Terms & Service": "",
  });

  // Temporary state while editing
  const [editContent, setEditContent] = useState("");

  // Queries & Mutations
  const { data: policyResponse, isLoading: isFetching } = useGetLegacyPolicyQuery(undefined);
  const [updateLegacyPolicy, { isLoading: isUpdating }] = useUpdateLegacyPolicyMutation();

  const policyData = policyResponse?.data;

  // Initialize/Sync policies state from fetched data
  useEffect(() => {
    if (policyData) {
      setPolicies({
        "About Kreo AI": policyData.about_kreo_ai || "",
        "Privacy Policy": policyData.privacy_policy || "",
        "Terms & Service": policyData.term_service || "",
      });
    }
  }, [policyData]);

  const handleEditClick = () => {
    setEditContent(policies[activeTab]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    const updatedPolicies = {
      ...policies,
      [activeTab]: editContent
    };

    const payload = {
      about_kreo_ai: updatedPolicies["About Kreo AI"],
      privacy_policy: updatedPolicies["Privacy Policy"],
      term_service: updatedPolicies["Terms & Service"],
    };

    try {
      const res = await updateLegacyPolicy(payload).unwrap();
      toast.success(res?.message || "Policies updated successfully!");
      setPolicies(updatedPolicies);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Update policy error:", error);
      toast.error(error?.data?.message || "Failed to update legacy policy");
    }
  };

  const handleTabChange = (tab: TabType) => {
    setIsEditing(false);
    setActiveTab(tab);
  };

  // Configure Quill modules for all the functionality requested
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      ['link'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'align': [] }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      ['clean']                                         // remove formatting button
    ]
  }), []);

  if (isFetching) {
    return (
      <div className="bg-[#242424] rounded-xl p-6 lg:p-8 shadow-sm flex flex-col items-center justify-center min-h-[600px] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF9F05] mb-2" />
        <p className="text-sm text-[#A3A3A3]">Loading policies...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#242424] rounded-xl p-6 lg:p-8 shadow-sm flex flex-col min-h-[600px] text-white">

      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#3E3E3E] w-full sm:w-auto">
          {(["About Kreo AI", "Privacy Policy", "Terms & Service"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab ? "text-[#FF9F05]" : "text-[#A3A3A3] hover:text-white"
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#FF9F05]"></span>
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="bg-[#FF9F05] text-white hover:bg-[#FF9F05]/90 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
          >
            <Pencil className="w-4 h-4" />
            Edit {activeTab}
          </button>
        ) : (
          <div className="flex items-center gap-4 w-full sm:w-auto z-10">
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#3E3E3E] text-white text-sm font-medium hover:bg-[#4a4a4a] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#FF9F05] text-white text-sm font-medium hover:bg-[#FF9F05]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-[#2A2A2A] rounded-2xl border border-[#3E3E3E] overflow-hidden flex flex-col">
        {isEditing ? (
          <div className="custom-quill-container flex-1 flex flex-col">
            <ReactQuill
              theme="snow"
              value={editContent}
              onChange={setEditContent}
              modules={modules}
              className="flex-1 flex flex-col h-full text-white"
            />
          </div>
        ) : (
          <div
            className="w-full h-full p-6 md:p-8 text-[#CCCCCC] text-sm md:text-base leading-relaxed rich-text-content"
            dangerouslySetInnerHTML={{ __html: policies[activeTab] || "<p class='text-[#A3A3A3] italic'>No policy content defined.</p>" }}
          />
        )}
      </div>

      {/* Custom Styles for React-Quill to match dark theme */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-quill-container .ql-toolbar {
          background-color: #2A2A2A;
          border: none !important;
          border-bottom: 1px solid #3E3E3E !important;
          padding: 16px 24px;
        }
        
        .custom-quill-container .ql-container {
          border: none !important;
          font-family: inherit;
          font-size: 16px;
          min-height: 400px;
        }
        
        .custom-quill-container .ql-editor {
          padding: 24px 32px;
          color: #CCCCCC;
        }

        /* Toolbar Icons and Text matching dark theme */
        .custom-quill-container .ql-toolbar .ql-stroke {
          stroke: #A3A3A3;
        }
        .custom-quill-container .ql-toolbar .ql-fill {
          fill: #A3A3A3;
        }
        .custom-quill-container .ql-toolbar .ql-picker {
          color: #A3A3A3;
        }
        
        /* Active States */
        .custom-quill-container .ql-toolbar button:hover .ql-stroke,
        .custom-quill-container .ql-toolbar button.ql-active .ql-stroke {
          stroke: #FFFFFF;
        }
        .custom-quill-container .ql-toolbar button:hover .ql-fill,
        .custom-quill-container .ql-toolbar button.ql-active .ql-fill {
          fill: #FFFFFF;
        }
        
        .custom-quill-container .ql-toolbar .ql-picker-label:hover,
        .custom-quill-container .ql-toolbar .ql-picker-label.ql-active {
          color: #FFFFFF;
        }
        .custom-quill-container .ql-toolbar .ql-picker-label:hover .ql-stroke,
        .custom-quill-container .ql-toolbar .ql-picker-label.ql-active .ql-stroke {
          stroke: #FFFFFF;
        }
        
        /* Dropdowns */
        .custom-quill-container .ql-picker-options {
          background-color: #1F1F1F !important;
          border: 1px solid #3E3E3E !important;
          color: #FFFFFF;
        }

        /* View Mode List and Heading Styles */
        .rich-text-content h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .rich-text-content h2 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #FFFFFF;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .rich-text-content h3 {
          font-size: 1.2rem;
          font-weight: 500;
          color: #FFFFFF;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .rich-text-content ul {
          list-style-type: disc;
          padding-left: 2rem;
          margin-bottom: 1rem;
        }
        .rich-text-content ol {
          list-style-type: decimal;
          padding-left: 2rem;
          margin-bottom: 1rem;
        }
        .rich-text-content p {
          margin-bottom: 0.5rem;
        }
      `}} />
    </div>
  );
}
