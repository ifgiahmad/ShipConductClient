"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Pastikan Textarea diimport
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MsAssessmentCategory } from "@/lib/type";
import {
  getMsAssessmentCategoryById,
  saveMsAssessmentCategory,
} from "@/services/service_api";
import { toast } from "sonner";

// Define the form schema
const formSchema = z.object({
  vslType: z.string().min(1, "Vessel Type is required"),
  item: z.string().min(1, "Item is required"),
  interval: z.string().min(1, "Interval is required"),
  shipSection: z.string().min(1, "Ship Section is required"),
});

export default function EditFormAssessmentItem({
  Id,
  setIsOpen,
}: {
  Id: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [formData, setFormData] = useState<MsAssessmentCategory>({
    vslType: "",
    item: "",
    interval: "",
    id: 0,
    shipSection: "",
    createdBy: "",
    modifiedBy: "",
    mode: "",
    deleted: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    if (parseInt(Id) > 0) {
      getDataById(parseInt(Id));
    }

    async function getDataById(Id: number) {
      try {
        const data = await getMsAssessmentCategoryById(Id);
        setFormData(data);
        form.reset(data);
      } catch (err) {
        console.error(err);
      }
    }
  }, [Id, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const ret = await saveMsAssessmentCategory(values);
      console.log(ret);
      if (ret.status === 200) {
        setIsOpen(false);
      } else {
        toast.error("Failed to save data");
        throw new Error("Failed to save data");
      }
    } catch (error) {
      toast.error("Error saving data");
      console.error("Error saving data:", error);
    }
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="vslType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vessel Type</FormLabel>
              <FormControl>
                <Input placeholder="Enter vessel type" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="item"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter item" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interval</FormLabel>
              <FormControl>
                <Input placeholder="Enter interval" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shipSection"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ship Section</FormLabel>
              <FormControl>
                <Input placeholder="Enter ship section" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <Button
            type="submit"
            className=" sm:ml-3 sm:w-auto sm:text-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Close
          </Button>
        </div>
      </form>
    </Form>
  );
}
