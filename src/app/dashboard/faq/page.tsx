/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, AlertTriangle } from "lucide-react";
import {
    useAllFaqsQuery,
    useCreateFaqMutation,
    useDeleteFaqMutation,
    useUpdateFaqMutation
} from "@/redux/feature/faqSlice";
import { toast } from "sonner";

interface FAQ {
    id: string | number;
    question: string;
    answer: string;
    lastUpdated?: string;
    updated_at?: string;
}

export default function FaqPage() {
    const [editingId, setEditingId] = useState<string | number | null>(null);
    const [localNewFaq, setLocalNewFaq] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);

    // Form states
    const [editForm, setEditForm] = useState({ question: "", answer: "" });

    // Queries & Mutations
    const { data: faqResponse, isLoading: isFetching } = useAllFaqsQuery(undefined);
    const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
    const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
    const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

    const faqs = faqResponse?.data || [];

    const handleAddNew = () => {
        if (editingId || localNewFaq) return;
        setLocalNewFaq(true);
        setEditForm({ question: "", answer: "" });
    };

    const handleEdit = (faq: FAQ) => {
        if (localNewFaq) return;
        setEditingId(faq.id);
        setEditForm({ question: faq.question, answer: faq.answer });
    };

    const handleConfirmDelete = async () => {
        if (deleteId === null) return;
        try {
            await deleteFaq(deleteId).unwrap();
            toast.success("FAQ deleted successfully!");
            if (editingId === deleteId) setEditingId(null);
            setDeleteId(null);
        } catch (error: any) {
            console.error("Delete FAQ error:", error);
            toast.error(error?.data?.message || "Failed to delete FAQ");
        }
    };

    const handleCancel = (id: string | number | "new") => {
        if (id === "new") {
            setLocalNewFaq(false);
        } else {
            setEditingId(null);
        }
    };

    const handleSave = async (id: string | number | "new") => {
        if (!editForm.question.trim() || !editForm.answer.trim()) {
            toast.error("Please fill in both question and answer fields");
            return;
        }

        try {
            if (id === "new") {
                await createFaq({
                    question: editForm.question,
                    answer: editForm.answer
                }).unwrap();
                toast.success("FAQ created successfully!");
                setLocalNewFaq(false);
            } else {
                await updateFaq({
                    id,
                    data: {
                        question: editForm.question,
                        answer: editForm.answer
                    }
                }).unwrap();
                toast.success("FAQ updated successfully!");
                setEditingId(null);
            }
        } catch (error: any) {
            console.error("Save FAQ error:", error);
            toast.error(error?.data?.message || "Failed to save FAQ");
        }
    };

    const displayDate = (faq: FAQ) => {
        if (faq.lastUpdated) return faq.lastUpdated;
        if (faq.updated_at) {
            return new Date(faq.updated_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });
        }
        return new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    };

    return (
        <div className="bg-[#242424] rounded-xl p-6 lg:p-8 shadow-sm flex flex-col min-h-[600px] text-white relative">

            {/* Top Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-lg font-medium">Total : {faqs.length} Questions</h2>

                <button
                    onClick={handleAddNew}
                    disabled={editingId !== null || localNewFaq || isFetching}
                    className="bg-[#FF9F05] text-white hover:bg-[#FF9F05]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add New FAQ Question
                </button>
            </div>

            {/* FAQ List */}
            <div className="flex flex-col gap-4">
                {isFetching && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#A3A3A3]">
                        <Loader2 className="w-8 h-8 animate-spin text-[#FF9F05]" />
                        <p className="text-sm">Fetching FAQs...</p>
                    </div>
                )}

                {!isFetching && (
                    <>
                        {/* NEW FAQ ROW (CREATION MODE) */}
                        {localNewFaq && (
                            <div className="bg-[#2C2C2C] border border-[#3E3E3E] rounded-2xl p-6 transition-all shadow-md">
                                <div className="flex flex-col gap-4">
                                    {/* Question Input */}
                                    <div className="relative">
                                        <div className="absolute top-4 left-5 text-[#A3A3A3] font-medium">Q :</div>
                                        <input
                                            type="text"
                                            value={editForm.question}
                                            onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                                            placeholder="Enter your question here..."
                                            className="w-full bg-[#1F1F1F] border border-[#3E3E3E] rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#777777] focus:ring-1 focus:ring-[#777777] transition-all"
                                        />
                                    </div>

                                    {/* Answer Input */}
                                    <div className="relative">
                                        <div className="absolute top-4 left-5 text-[#A3A3A3] font-medium">A :</div>
                                        <input
                                            type="text"
                                            value={editForm.answer}
                                            onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                                            placeholder="Enter the answer here..."
                                            className="w-full bg-[#1F1F1F] border border-[#3E3E3E] rounded-xl py-4 pl-12 pr-4 text-[#A3A3A3] focus:outline-none focus:border-[#777777] focus:ring-1 focus:ring-[#777777] transition-all"
                                        />
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-4">
                                        <span className="text-[#A3A3A3] text-sm">
                                            Last Updated : Just now
                                        </span>
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <button
                                                onClick={() => handleCancel("new")}
                                                disabled={isCreating}
                                                className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#3E3E3E] text-white text-sm font-medium hover:bg-[#4a4a4a] transition-colors disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleSave("new")}
                                                disabled={isCreating}
                                                className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-white text-[#242424] text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isCreating && <Loader2 className="w-4 h-4 animate-spin text-[#242424]" />}
                                                Save FAQ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* LIST ITEMS */}
                        {faqs.map((faq: FAQ) => {
                            const isEditing = editingId === faq.id;

                            if (isEditing) {
                                // EDIT MODE
                                return (
                                    <div key={faq.id} className="bg-[#2C2C2C] border border-[#3E3E3E] rounded-2xl p-6 transition-all shadow-md">
                                        <div className="flex flex-col gap-4">
                                            {/* Question Input */}
                                            <div className="relative">
                                                <div className="absolute top-4 left-5 text-[#A3A3A3] font-medium">Q :</div>
                                                <input
                                                    type="text"
                                                    value={editForm.question}
                                                    onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                                                    placeholder="How does AI image generation work?"
                                                    className="w-full bg-[#1F1F1F] border border-[#3E3E3E] rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#777777] focus:ring-1 focus:ring-[#777777] transition-all"
                                                />
                                            </div>

                                            {/* Answer Input */}
                                            <div className="relative">
                                                <div className="absolute top-4 left-5 text-[#A3A3A3] font-medium">A :</div>
                                                <input
                                                    type="text"
                                                    value={editForm.answer}
                                                    onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                                                    placeholder="Our engine uses advanced AI models..."
                                                    className="w-full bg-[#1F1F1F] border border-[#3E3E3E] rounded-xl py-4 pl-12 pr-4 text-[#A3A3A3] focus:outline-none focus:border-[#777777] focus:ring-1 focus:ring-[#777777] transition-all"
                                                />
                                            </div>

                                            {/* Footer Actions */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-4">
                                                <span className="text-[#A3A3A3] text-sm">
                                                    Last Updated : {displayDate(faq)}
                                                </span>
                                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                                    <button
                                                        onClick={() => handleCancel(faq.id)}
                                                        disabled={isUpdating}
                                                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#3E3E3E] text-white text-sm font-medium hover:bg-[#4a4a4a] transition-colors disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleSave(faq.id)}
                                                        disabled={isUpdating}
                                                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-white text-[#242424] text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                                    >
                                                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-[#242424]" />}
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            // VIEW MODE
                            return (
                                <div key={faq.id} className="bg-transparent border border-[#3E3E3E] rounded-2xl p-6 flex items-start justify-between gap-4 group hover:bg-[#2C2C2C]/50 transition-colors">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start gap-2 text-white font-medium">
                                            <span className="shrink-0 text-white">Q :</span>
                                            <p>{faq.question}</p>
                                        </div>
                                        <div className="flex items-start gap-2 text-[#A3A3A3]">
                                            <span className="shrink-0 text-[#A3A3A3]">A :</span>
                                            <p>{faq.answer}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 shrink-0 pt-1">
                                        <button
                                            onClick={() => handleEdit(faq)}
                                            disabled={editingId !== null || localNewFaq || isDeleting}
                                            className="text-[#A3A3A3] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                            aria-label="Edit FAQ"
                                        >
                                            <Pencil className="w-[18px] h-[18px]" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(faq.id)}
                                            disabled={editingId !== null || localNewFaq || isDeleting}
                                            className="text-[#A3A3A3] hover:text-[#FF4C4C] transition-colors p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                            aria-label="Delete FAQ"
                                        >
                                            <Trash2 className="w-[18px] h-[18px]" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {faqs.length === 0 && !localNewFaq && (
                            <div className="text-center py-12 text-[#A3A3A3]">
                                No FAQs found. Click "Add New FAQ Question" to get started.
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Custom Delete Confirmation Modal */}
            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-[#2C2C2C] border border-[#3E3E3E] rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-white">
                        <div className="flex items-center gap-3 text-red-500">
                            <div className="bg-red-500/10 p-2.5 rounded-full border border-red-500/20">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Delete FAQ Question?</h3>
                        </div>

                        <p className="text-sm text-[#A3A3A3] leading-relaxed">
                            Are you sure you want to delete this FAQ question? This action cannot be undone and the question will be permanently removed.
                        </p>

                        <div className="flex items-center gap-3 mt-2 justify-end">
                            <button
                                onClick={() => setDeleteId(null)}
                                disabled={isDeleting}
                                className="px-5 py-2.5 rounded-full bg-[#3E3E3E] text-white text-sm font-medium hover:bg-[#4a4a4a] transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="px-5 py-2.5 rounded-full bg-[#FF4C4C] text-white text-sm font-medium hover:bg-[#FF4C4C]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
