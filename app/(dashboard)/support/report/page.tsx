"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReportIssuePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createTicket = useMutation(api.support.createSupportTicket);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createTicket({
        subject: subject.trim(),
        message: message.trim(),
        category: "bug_report",
        priority: "high",
      });
      
      toast({
        title: "Issue reported",
        description: "Thank you for reporting this issue. We'll investigate and fix it soon.",
      });
      
      // Reset form
      setSubject("");
      setMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to report issue.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-burgundy">Report an Issue</h1>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="text-burgundy border-burgundy hover:bg-burgundy/10"
        >
          Back
        </Button>
      </div>

      <Card className="bg-white border-burgundy/10">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-burgundy" />
            <CardTitle className="text-lg text-burgundy">Bug Report</CardTitle>
          </div>
          <CardDescription className="text-burgundy/70">
            Help us improve by reporting bugs and technical issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-burgundy-900">
                Issue Summary *
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of the issue"
                required
                className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-burgundy-900">
                Details *
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe the issue in detail, including steps to reproduce, expected behavior, and actual behavior..."
                rows={10}
                required
                className="border-burgundy-300 focus:border-burgundy-500 focus:ring-burgundy-500"
              />
              <p className="text-xs text-burgundy/60">
                Include steps to reproduce the issue, what you expected to happen, and what actually happened.
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-burgundy/20">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="text-burgundy border-burgundy hover:bg-burgundy/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-burgundy-600 text-white hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
