"use client";

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { compressImage, formatFileSize } from "@/lib/image-utils";
import { Loader2, Camera, Store } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

interface LogoUploadCircleProps {
  endpoint: "imageUploader" | "shopImageUploader";
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: Error) => void;
  currentLogoUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LogoUploadCircle({
  endpoint,
  onUploadComplete,
  onUploadError,
  currentLogoUrl,
  className = "",
  size = "md",
}: LogoUploadCircleProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  const iconSizes = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative group">
        {/* Circle container */}
        <div
          className={`${sizeClasses[size]} rounded-full border-4 border-burgundy-200 overflow-hidden bg-beige-50 flex items-center justify-center relative`}
        >
          {isCompressing ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-burgundy-700 animate-spin" />
            </div>
          ) : currentLogoUrl ? (
            <>
              <img
                src={currentLogoUrl}
                alt="Shop logo"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </>
          ) : (
            <Store className={`text-burgundy-400`} size={iconSizes[size]} />
          )}
        </div>

        {/* Upload overlay badge */}
        {!isCompressing && (
          <div className="absolute -bottom-2 -right-2 bg-burgundy-700 rounded-full p-2 shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
            <Camera className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Upload button */}
      <div className="relative">
        {isCompressing ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-burgundy-100 rounded-lg">
            <Loader2 className="h-4 w-4 text-burgundy-700 animate-spin" />
            <span className="text-sm text-burgundy-700 font-medium">
              Optimizing...
            </span>
          </div>
        ) : (
          <UploadButton
            endpoint={endpoint}
            onUploadProgress={(p: number) => setProgress(p)}
            appearance={{
              button: {
                background: "#7C2D32",
                color: "#FFFFFF",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                transition: "all 0.2s",
              },
              container: {
                display: "inline-block",
              },
              allowedContent: {
                display: "none",
              },
            }}
            content={{
              button: currentLogoUrl ? "Change Logo" : "Upload Logo",
            }}
            onClientUploadComplete={(res: any) => {
              const url = res?.[0]?.ufsUrl || res?.[0]?.url;
              if (url) {
                console.log("[UploadThing] logo: upload complete", res);
                onUploadComplete(url);
                toast({
                  title: "Success",
                  description: "Logo uploaded successfully!",
                });
              }
            }}
            onUploadError={(error: Error) => {
              console.error("Upload error:", error);
              toast({
                title: "Upload Failed",
                description: error.message || "Failed to upload logo. Please try again.",
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
                      maxSizeMB: 0.5, // Smaller for logos
                      maxWidthOrHeight: 800, // Smaller dimensions for logos
                      quality: 0.8, // Higher quality for logos
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
                  description: "Could not optimize logo. Uploading original...",
                  variant: "destructive",
                });
                return files;
              }
            }}
          />
        )}
      </div>

      {progress > 0 && progress < 100 && (
        <div className="h-2 w-40 rounded-full bg-burgundy-100">
          <div
            className="h-2 rounded-full bg-burgundy-700 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {progress > 0 && progress < 100 && (
        <div className="mt-1 text-xs text-burgundy-700">{Math.round(progress)}% Uploading…</div>
      )}

      <p className="text-xs text-burgundy-600 text-center max-w-xs">
        {currentLogoUrl
          ? "Click to change your shop logo"
          : "Upload your shop logo (square image recommended)"}
      </p>
    </div>
  );
}

