"use client";

import { useState, useRef } from "react";
import { Modal } from "@/app/components/ui/Modal";
import { Button } from "@/app/components/ui/Button";
import { FiUploadCloud, FiFile, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { useToast } from "@/app/components/ui/Toast";

type ReceiptParserModalProps = {
  open: boolean;
  onClose: () => void;
  onParseComplete: (data: any) => void;
};

export default function ReceiptParserModal({ open, onClose, onParseComplete }: ReceiptParserModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = async (selectedFile: File) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Unsupported file format. Please upload JPG, PNG, WebP, or PDF.");
      return;
    }

    // Validate size (max 4.5MB)
    const maxSize = 4.5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("File is too large. Max file size is 4.5MB.");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setLoading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64String = reader.result?.toString().split(",")[1];
        if (!base64String) {
          throw new Error("Failed to read file contents.");
        }

        const response = await fetch("/api/ai/parse-receipt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileData: base64String,
            mimeType: selectedFile.type,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to parse receipt");
        }

        toast.success("Receipt parsed successfully!");
        onParseComplete(data);
        handleClose();
      };
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to scan receipt. Please verify your API key and file contents.");
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setLoading(false);
    onClose();
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal open={open} onClose={handleClose} title="AI Scan Receipt" size="md">
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="w-14 h-14 bg-[#355834]/10 dark:bg-[#355834]/20 text-[#355834] dark:text-green-400 rounded-2xl flex items-center justify-center animate-spin">
              <FiRefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-dark dark:text-white">Analyzing Document...</h4>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 max-w-[280px]">
                Invoxa AI is parsing text, matching products in your inventory, and extracting quantities.
              </p>
            </div>
            {file && (
              <div className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 font-mono text-zinc-500 max-w-[250px] truncate">
                <FiFile className="shrink-0" />
                <span>{file.name}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3.5 text-xs text-red-700 dark:text-red-400">
                <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={[
                "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[220px]",
                isDragActive
                  ? "border-[#355834] bg-[#355834]/5 dark:bg-[#1C2C22]/10"
                  : "border-slate-200 dark:border-zinc-800/80 hover:border-slate-350 dark:hover:border-zinc-700/80 bg-slate-50/50 dark:bg-zinc-900/10",
              ].join(" ")}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                className="hidden"
              />
              <div className="w-12 h-12 bg-[#355834]/10 dark:bg-[#355834]/20 text-[#355834] dark:text-green-400 rounded-xl flex items-center justify-center mb-3">
                <FiUploadCloud className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-dark dark:text-white">
                Drag and drop your file here
              </p>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 max-w-[280px]">
                Supports PDFs, receipts images (JPG, PNG, WebP) up to 4.5MB.
              </p>
              <Button type="button" variant="outline" className="mt-4 text-xs font-semibold px-4 py-2">
                Browse Files
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
