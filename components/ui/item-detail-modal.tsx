"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ItemDetailModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className
}: ItemDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-white border-burgundy-200 shadow-xl", className)}>
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-burgundy-200">
          <DialogTitle className="text-burgundy-900">{title}</DialogTitle>
          {description && <DialogDescription className="text-burgundy-700">{description}</DialogDescription>}
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-2 scrollbar-hide">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
