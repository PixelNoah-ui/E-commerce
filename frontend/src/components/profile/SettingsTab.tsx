"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Eye, Lock } from "lucide-react";

export default function SettingsTab() {
  return (
    <div className="space-y-4">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Receive updates about your orders and account
                </CardDescription>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardHeader>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control who can see your profile and activity
                </CardDescription>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardHeader>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-slate-400 mt-1" />
            <div>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>
                Manage your personal data and privacy preferences
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Download My Data
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
