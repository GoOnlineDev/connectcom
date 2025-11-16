"use client";

import React, { useState, useRef } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import { compressImage, formatFileSize } from "@/lib/image-utils";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

interface ShopImageDropzoneProps {
  endpoint: "imageUploader" | "productImageUploader" | "shopImageUploader";
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: Error) => void;
  currentImageUrl?: string;
  className?: string;
}

export function ShopImageDropzone({
  endpoint,
  onUploadComplete,
  onUploadError,
  currentImageUrl,
  className = "",
}: ShopImageDropzoneProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={`relative ${className}`}>
      {isUploading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 text-burgundy-700 animate-spin mb-2" />
          <div className="h-2 w-1/2 rounded-full bg-burgundy-100">
            <div
              className="h-2 rounded-full bg-burgundy-700 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-burgundy-700">{Math.round(progress)}% Uploading…</div>
        </div>
      )}
      {isCompressing ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-burgundy-300 rounded-xl p-8 bg-beige-50 min-h-[200px]">
          <Loader2 className="h-12 w-12 text-burgundy-700 animate-spin mb-4" />
          <p className="text-burgundy-700 font-medium">Optimizing your image...</p>
          <p className="text-burgundy-600 text-sm mt-2">
            This will only take a moment
          </p>
        </div>
      ) : currentImageUrl ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-burgundy-200">
            <img
              src={currentImageUrl}
              alt="Current image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none" />
          </div>
          <div className="mt-3">
            <UploadDropzone
              endpoint={endpoint}
              onUploadProgress={(p: number) => setProgress(p)}
              onUploadBegin={() => {
                setIsUploading(true);
                setProgress(0);
                console.log("[UploadThing] shop image: upload begin");
              }}
              appearance={{
                button: {
                  background: "#7C2D32",
                  color: "#FFFFFF",
                  borderRadius: "0.75rem",
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                },
                container: {
                  border: "2px dashed #E5C8A8",
                  borderRadius: "1rem",
                  padding: "1rem",
                  background: "#FFF9F0",
                },
                uploadIcon: { color: "#7C2D32" },
                label: { color: "#7C2D32", fontWeight: "600", fontSize: "0.875rem" },
                allowedContent: { color: "#92400E", fontSize: "0.75rem" },
              }}
              content={{
                label: "Select a new banner (uploads immediately)",
                allowedContent: "Max 4MB • Optimized automatically",
                button: "Choose image",
              }}
              onClientUploadComplete={(res: any) => {
                const url = res?.[0]?.ufsUrl || res?.[0]?.url;
                if (url) {
                  console.log("[UploadThing] shop image: upload complete", res);
                  onUploadComplete(url);
                  toast({
                    title: "Success",
                    description: "Image updated successfully!",
                  });
                }
                setIsUploading(false);
                setProgress(0);
              }}
              onUploadError={(error: Error) => {
                console.error("Upload error:", error);
                toast({
                  title: "Upload Failed",
                  description: error.message || "Failed to upload image. Please try again.",
                  variant: "destructive",
                });
                onUploadError?.(error);
                setIsUploading(false);
                setProgress(0);
              }}
              onBeforeUploadBegin={async (files: File[]) => {
                setIsCompressing(true);
                try {
                  const compressedFiles = await Promise.all(
                    files.map(async (file: File) => {
                      const compressed = await compressImage(file, {
                        maxSizeMB: 0.8,
                        maxWidthOrHeight: 1920,
                        quality: 0.7,
                      });
                      return compressed;
                    })
                  );
                  setIsCompressing(false);
                  return compressedFiles;
                } catch (error) {
                  setIsCompressing(false);
                  console.error("Compression error:", error);
                  toast({
                    title: "Compression Failed",
                    description: "Could not optimize image. Uploading original...",
                    variant: "destructive",
                  });
                  return files;
                }
              }}
            />
          </div>
        </div>
      ) : (
        <UploadDropzone
          endpoint={endpoint}
          onUploadProgress={(p: number) => setProgress(p)}
          onUploadBegin={() => {
            setIsUploading(true);
            setProgress(0);
            console.log("[UploadThing] shop image: upload begin");
          }}
          appearance={{
            button: {
              background: "#7C2D32",
              color: "#FFFFFF",
              borderRadius: "0.75rem",
              padding: "0.75rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: "600",
            },
            container: {
              border: "2px dashed #E5C8A8",
              borderRadius: "1rem",
              padding: "2rem",
              background: "#FFF9F0",
              minHeight: "200px",
            },
            uploadIcon: {
              color: "#7C2D32",
              width: "48px",
              height: "48px",
            },
            label: {
              color: "#7C2D32",
              fontWeight: "600",
              fontSize: "1rem",
              marginTop: "1rem",
            },
            allowedContent: {
              color: "#92400E",
              fontSize: "0.75rem",
              marginTop: "0.5rem",
            },
          }}
          content={{
            label: "Drop your image here or click to browse",
            allowedContent: "Max 4MB • Will be optimized automatically",
            button: "Choose image",
          }}
          onClientUploadComplete={(res) => {
            const url = (res as any)?.[0]?.ufsUrl || (res as any)?.[0]?.url;
            if (url) {
              console.log("[UploadThing] shop image: upload complete", res);
              onUploadComplete(url);
              toast({
                title: "Success",
                description: "Image uploaded successfully!",
              });
            }
            setIsUploading(false);
            setProgress(0);
          }}
          onUploadError={(error: Error) => {
            console.error("Upload error:", error);
            toast({
              title: "Upload Failed",
              description: error.message || "Failed to upload image. Please try again.",
              variant: "destructive",
            });
            onUploadError?.(error);
            setIsUploading(false);
            setProgress(0);
          }}
          onBeforeUploadBegin={async (files) => {
            setIsCompressing(true);
            try {
              const compressedFiles = await Promise.all(
                files.map(async (file) => {
                  const originalSize = file.size;
                  const compressed = await compressImage(file, {
                    maxSizeMB: 0.8,
                    maxWidthOrHeight: 1920,
                    quality: 0.7,
                  });
                  const newSize = compressed.size;
                  
                  if (newSize < originalSize) {
                    console.log(
                      `Compressed ${file.name}: ${formatFileSize(originalSize)} → ${formatFileSize(newSize)}`
                    );
                  }
                  
                  return compressed;
                })
              );
              setIsCompressing(false);
              return compressedFiles;
            } catch (error) {
              setIsCompressing(false);
              console.error("Compression error:", error);
              toast({
                title: "Compression Failed",
                description: "Could not optimize image. Uploading original...",
                variant: "destructive",
              });
              return files;
            }
          }}
        />
      )}
      {progress > 0 && progress < 100 && (
        <div className="mt-2 h-2 w-full rounded-full bg-burgundy-100">
          <div
            className="h-2 rounded-full bg-burgundy-700 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {progress > 0 && progress < 100 && (
        <div className="mt-1 text-xs text-burgundy-700">{Math.round(progress)}% Uploading…</div>
      )}
    </div>
  );
}

