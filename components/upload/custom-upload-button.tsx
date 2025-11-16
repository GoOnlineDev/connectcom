"use client";

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { compressImage, formatFileSize } from "@/lib/image-utils";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CustomUploadButtonProps {
  endpoint: "imageUploader" | "productImageUploader" | "shopImageUploader";
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  buttonText?: string;
  disabled?: boolean;
}

export function CustomUploadButton({
  endpoint,
  onUploadComplete,
  onUploadError,
  className = "",
  buttonText = "Upload Image",
  disabled = false,
}: CustomUploadButtonProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  return (
    <div className={`relative ${className}`}>
      {isCompressing ? (
        <Button
          disabled
          className="w-full bg-burgundy-700 hover:bg-burgundy-800 text-white rounded-xl"
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Optimizing image...
        </Button>
      ) : (
        <UploadButton
          endpoint={endpoint}
          onUploadProgress={(p: number) => setProgress(p)}
          onUploadBegin={() => {
            setProgress(0);
            console.log("[UploadThing] button: upload begin");
          }}
          appearance={{
            button: {
              background: "#7C2D32",
              color: "#FFFFFF",
              borderRadius: "0.75rem",
              padding: "0.75rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              width: "100%",
              transition: "all 0.2s",
            },
            container: {
              width: "100%",
            },
            allowedContent: {
              color: "#92400E",
              fontSize: "0.75rem",
              marginTop: "0.5rem",
            },
          }}
          content={{
            button: buttonText,
            allowedContent: "Max 4MB (will be optimized)",
          }}
          onClientUploadComplete={(res: any) => {
            const url = res?.[0]?.ufsUrl || res?.[0]?.url;
            if (url) {
              console.log("[UploadThing] button: upload complete", res);
              onUploadComplete(url);
              toast({
                title: "Success",
                description: "Image uploaded successfully!",
              });
            }
          }}
          onUploadError={(error: Error) => {
            console.error("Upload error:", error);
            toast({
              title: "Upload Failed",
              description: error.message || "Failed to upload image. Please try again.",
              variant: "destructive",
            });
            onUploadError?.(error);
          }}
          onBeforeUploadBegin={async (files: File[]) => {
            setIsCompressing(true);
            try {
              const compressedFiles = await Promise.all(
                files.map(async (file: File) => {
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
          disabled={disabled}
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

