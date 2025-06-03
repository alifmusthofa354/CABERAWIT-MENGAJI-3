import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function EditDialog({
  open, // Menerima prop 'open'
  onOpenChange, // Menerima prop 'onOpenChange'
  idClass,
  nameClass,
  descriptionClass,
  link_wa,
  image_url,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idClass: string;
  nameClass: string;
  descriptionClass: string;
  link_wa: string;
  image_url: string;
}) {
  return (
    <>
      <span hidden>{idClass}</span>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit {nameClass}</DialogTitle>
            <DialogDescription>
              Make changes to your class here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue={nameClass}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Description" className="text-right">
                Description
              </Label>
              <Textarea
                id="Description"
                defaultValue={descriptionClass}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="GrupWhatsApp" className="text-right">
                GrupWhatsApp
              </Label>
              <Input
                id="GrupWhatsApp"
                defaultValue={link_wa}
                type="url"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Image" className="text-right">
                Image
              </Label>
              <input id="Image" type="file" className="col-span-3" />
            </div>
            <div>
              <Image src={image_url} width={100} height={100} alt="Image" />
            </div>
          </div>

          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" variant="default">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
