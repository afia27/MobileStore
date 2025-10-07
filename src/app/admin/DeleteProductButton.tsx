"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogActions, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function DeleteProductButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { show } = useToast();

  async function onDelete() {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) { setOpen(false); show("Deleted successfully"); router.refresh(); }
    else { show("Failed to delete"); }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="secondary" className="ml-2 text-red-400 border-red-400">
        Delete
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle>Delete product “{title}”?</DialogTitle>
        <DialogDescription>This action cannot be undone.</DialogDescription>
        <DialogActions>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={async () => { await onDelete(); setOpen(false); }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}


