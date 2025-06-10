"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateClass from "./CreateClass";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JoinClass from "./JoinClass";

export default function AddClass({ mobile = false, circle = false }) {
  const [open, setOpen] = useState(false); // State untuk mengontrol dialog

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div>
            {mobile ? (
              circle ? (
                <div className="md:hidden">
                  <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold rounded-full w-16 h-16 flex items-center justify-center shadow-md">
                    <Plus className="w-8 h-8" />
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <Button variant="outline">
                      <span>
                        <Plus />
                      </span>
                      Add Class
                    </Button>
                  </div>
                </>
              )
            ) : (
              <div className="hidden md:block">
                <Button variant="outline">
                  <span>
                    <Plus />
                  </span>
                  Add Class
                </Button>
              </div>
            )}
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-11/12 grid-cols-2">
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="join">Join</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <CreateClass onCloseDialog={handleClose} />
            </TabsContent>
            <TabsContent value="join">
              <JoinClass onCloseDialog={handleClose} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
