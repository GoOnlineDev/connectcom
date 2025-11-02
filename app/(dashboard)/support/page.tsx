"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, MessageSquare, FileText, BookOpen } from "lucide-react";

export default function SupportPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-burgundy mb-6">Help & Support</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/support/help">
          <Card className="bg-white border-burgundy/10 hover:border-burgundy/30 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-burgundy" />
                <CardTitle className="text-lg text-burgundy">Help Center</CardTitle>
              </div>
              <CardDescription className="text-burgundy/70">
                Browse frequently asked questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-burgundy/60">
                Find answers to common questions
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/support/contact">
          <Card className="bg-white border-burgundy/10 hover:border-burgundy/30 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-burgundy" />
                <CardTitle className="text-lg text-burgundy">Contact Support</CardTitle>
              </div>
              <CardDescription className="text-burgundy/70">
                Get in touch with our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-burgundy/60">
                Submit a support ticket
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/support/report">
          <Card className="bg-white border-burgundy/10 hover:border-burgundy/30 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-burgundy" />
                <CardTitle className="text-lg text-burgundy">Report Issue</CardTitle>
              </div>
              <CardDescription className="text-burgundy/70">
                Report a bug or technical issue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-burgundy/60">
                Help us improve the platform
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
