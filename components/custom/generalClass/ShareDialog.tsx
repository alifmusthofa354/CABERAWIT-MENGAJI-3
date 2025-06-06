import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function ShareDialog({
  open,
  onOpenChange,
  idUserClassroom,
  nameClass,
  codeClass,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idUserClassroom: string;
  nameClass: string;
  codeClass: string;
}) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeClass);
      toast.success("Class code has been copied to clipboard.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to copy link. Please try again.");
    }
  };
  const copyLinkToClipboard = async () => {
    const link = `https://caberawitmengajiv3.vercel.app/join/${codeClass}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Class Link has been copied to clipboard.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to copy link. Please try again.");
    }
  };

  return (
    <>
      <span hidden>{idUserClassroom}</span>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share {nameClass}</DialogTitle>
            <DialogDescription>
              Anyone who has this code will be able to join this class.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue={codeClass} readOnly />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" onClick={copyToClipboard}>
              Copy
              <Copy />
            </Button>
            <Button type="button" onClick={copyLinkToClipboard}>
              Link
              <Copy />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
