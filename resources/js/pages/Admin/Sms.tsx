import React, { useState } from "react";
import { AdminLayout } from "@/layouts/admin-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageProps } from "@/types";
import { router } from "@inertiajs/react";
import { MessageSquare, Send } from "lucide-react";

interface SmsPageProps extends PageProps {
  totalUsers: number;
}

const SmsPage = ({ auth, totalUsers, flash }: SmsPageProps) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    
    if (!confirm(`Are you sure you want to send this SMS to all ${totalUsers} users?`)) {
      return;
    }

    setSending(true);
    router.post(route("admin.sms.send"), { message }, {
      onFinish: () => {
        setSending(false);
        setMessage("");
      },
    });
  };

  return (
    <AdminLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Send SMS to All Users
        </h2>
      }
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg mb-6 border border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/20 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Total Recipients</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalUsers} users</p>
        </div>

        {flash?.success && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4">
            {flash.success}
          </div>
        )}

        {flash?.error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {flash.error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              maxLength={500}
              className="w-full"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {message.length}/500 characters
            </p>
          </div>

          <Button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {sending ? "Sending..." : "Send SMS to All Users"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SmsPage;
