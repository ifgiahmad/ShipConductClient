import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  getMsIntervalById,
  saveMsInterval,
} from "@/services/service_api_interval";
import { useToast } from "@/hooks/use-toast";
import {
  saveMsIntervalDto,
  saveMsIntervalZod,
} from "@/lib/types/MsInterval.types";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type DataModel = z.infer<typeof saveMsIntervalZod>;

interface IntervalFormProps {
  onClose: () => void;
  onSave: () => void;
  id: number;
  mode: string;
}

const IntervalForm = ({ onClose, onSave, id, mode }: IntervalFormProps) => {
  const { toast } = useToast();

  const methods = useForm<saveMsIntervalDto>({
    resolver: zodResolver(saveMsIntervalZod),
    defaultValues: {
      id: Number(id),
      interval: "",
      mode: "",
      isDeleted: false,
    },
  });

  const { setValue, control, handleSubmit } = methods;

  useEffect(() => {
    const fetchData = async () => {
      if (id > 0) {
        try {
          const data = await getMsIntervalById(id);
          setValue("interval", data.interval ?? "");
        } catch (error) {
          console.error("Error fetching interval data:", error);
        }
      } else {
        setValue("mode", "CREATE");
      }
    };

    fetchData();
  }, [id, setValue]);

  const onSubmit: SubmitHandler<DataModel> = async (data) => {
    console.log(data);
    data.mode = mode;
    try {
      const response = await saveMsInterval(data);
      if (response.status === 200) {
        onSave();
        toast({ description: "Interval updated successfully." });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update data",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error updating data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6"
      >
        {mode === "DELETE" ? (
          <Alert>
            <Trash2Icon className="h-5 w-5 bg-red-600" />
            <AlertTitle>Delete Data !</AlertTitle>
            <AlertDescription>
              Are you sure you want to delete this data?
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <FormField
              control={control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interval</FormLabel>
                  <Input required placeholder="Enter interval" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            className="bg-green-900 hover:bg-green-600"
          >
            {mode === "DELETE" ? "Delete" : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
};

export default IntervalForm;
