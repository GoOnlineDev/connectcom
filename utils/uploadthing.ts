import {
    generateUploadButton,
    generateUploadDropzone,
    generateUploader,
  } from "@uploadthing/react";
  
  import type { OurFileRouter } from "@/app/api/uploadthing/core";
  
  export const UploadButton = generateUploadButton<OurFileRouter>();
  export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
  
  // Product/Service image uploader hook
  export const useProductImageUploader = generateUploader<OurFileRouter>();

  // Shop image uploader hook
  export const useShopImageUploader = generateUploader<OurFileRouter>();

  // Specific upload components for product images
  export const ProductImageUploadButton = generateUploadButton<OurFileRouter>();
  export const ProductImageUploadDropzone = generateUploadDropzone<OurFileRouter>();