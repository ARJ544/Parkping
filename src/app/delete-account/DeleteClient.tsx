"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DeleteAccountClient() {
  const { deleting, message, handleAccountDelete } = useDeleteAccount();

  const [confirmText, setConfirmText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== "delete") return;
    const success = await handleAccountDelete(confirmText);
    if (success) {
      setOpenDialog(false);
      setConfirmText("");
    }
  };

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#e8edf8]">
            Delete Account
          </h1>
          <p className="mt-2 text-sm text-[#8a7a5a] dark:text-[#89aee6]">
            Permanently delete your account and all associated data.
          </p>
        </div>

        {/* Danger Card */}
        <div className="rounded-2xl border-2 border-red-200 dark:border-red-900/60 bg-red-50/80 dark:bg-red-950/20 p-8 flex flex-col gap-6">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400">
              Delete Your Account
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
              This action is <strong>permanent and irreversible</strong>.
              Once deleted, your account and all associated data will be removed from our system.
            </p>
            <ul className="text-sm text-red-700 dark:text-red-400 list-disc ml-5 space-y-1.5">
              <li>Your account will be completely removed</li>
              <li>All your data will be permanently deleted</li>
              <li>Your Finder ID will no longer be accessible</li>
              <li>You will need to create a new account to use the service again</li>
            </ul>
          </div>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full h-11 rounded-full font-bold flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete My Account
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md rounded-2xl border border-[#e8dfc4] dark:border-[#1e2a4a] bg-[#fef9ed] dark:bg-[#0a0f1e]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Confirm Account Deletion
                </DialogTitle>
                <DialogDescription className="text-[#8a7a5a] dark:text-[#89aee6]">
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <p className="text-sm text-[#8a7a5a] dark:text-[#89aee6]">
                  Type <span className="font-semibold text-slate-900 dark:text-[#e8edf8]">"delete"</span> to confirm account deletion.
                </p>

                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder='Type "delete"'
                  className="font-semibold rounded-xl border-[#e8dfc4] dark:border-[#1e2a4a] bg-white dark:bg-[#0d1b33] text-slate-900 dark:text-[#e8edf8] placeholder:text-[#8a7a5a] dark:placeholder:text-[#4a6fa5]"
                />

                {message && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpenDialog(false);
                    setConfirmText("");
                  }}
                  disabled={deleting}
                  className="rounded-full border-[#e8dfc4] dark:border-[#1e2a4a] text-[#8a7a5a] dark:text-[#89aee6] hover:border-[#d85a30]/50 dark:hover:border-[#d85a30]/60 hover:text-[#d85a30] dark:hover:text-[#d85a30] bg-transparent transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={confirmText !== "delete" || deleting}
                  onClick={handleDelete}
                  className="rounded-full bg-red-600 hover:bg-red-700 text-white font-bold transition-all duration-200 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Box */}
        <div className="rounded-2xl border border-[#e8dfc4] dark:border-[#1e2a4a] bg-[#fef9ed] dark:bg-[#0d1b33] px-5 py-4">
          <p className="text-sm text-[#8a7a5a] dark:text-[#89aee6] leading-relaxed">
            <span className="font-semibold text-slate-900 dark:text-[#e8edf8]">Note: </span>
            If you're having issues with your account, please contact our support team before deleting.
          </p>
        </div>

      </div>
    </main>
  );
}