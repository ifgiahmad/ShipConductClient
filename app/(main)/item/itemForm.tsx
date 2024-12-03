import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  getMsItemById,
  saveMsItem,
  uploadPhoto,
} from "@/services/service_api_item";
import { useToast } from "@/hooks/use-toast";
import { saveMsItemDto, saveMsItemZod } from "@/lib/types/MsItem.types";
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
import { Textarea } from "@/components/ui/textarea";

type DataModel = z.infer<typeof saveMsItemZod>;

interface ItemFormProps {
  onClose: () => void;
  onSave: () => void;
  id: number;
  mode: string;
}

const ItemForm = ({ onClose, onSave, id, mode }: ItemFormProps) => {
  const { toast } = useToast();

  const methods = useForm<saveMsItemDto>({
    resolver: zodResolver(saveMsItemZod),
    defaultValues: {
      id: Number(id),
      itemName: "",
      mode: "",
      isDeleted: false,
    },
  });

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id > 0) {
        try {
          const data = await getMsItemById(id);
          setValue("itemName", data.itemName ?? "");
          setImagePreview(data.fileLink || null);
        } catch (error) {
          console.error("Error fetching Item data:", error);
        }
      } else {
        setValue("mode", "CREATE");
      }
    };

    fetchData();
  }, [id, setValue]);

  const onSubmit: SubmitHandler<DataModel> = async (data) => {
    data.mode = mode;
    console.log(data);
    try {
      const response = await saveMsItem(data);
      if (response.status === "OK") {
        if (data.photo) {
          data.id = response.returnId;
          const resPhoto = await uploadPhoto(data);
          if (resPhoto.status === 200) {
            onSave();
            toast({
              description: "Photo Item updated successfully.",
            });
            return true;
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Photo Item failed to Save.",
            });
          }
        } else {
          onSave();
          toast({ description: "Item updated successfully." });
        }
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("fileName", file.name);
      setValue("photo", file);
      setImagePreview(URL.createObjectURL(file)); // Update the preview when a file is selected
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
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item</FormLabel>
                  <Textarea required placeholder="Enter Item" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Photo Preview"
                  className="w-80 h-60 rounded-md border border-gray-300"
                  width={0}
                  height={0}
                />
              </div>
            )}

            {/* Upload Photo Field */}
            <FormItem>
              <FormLabel>Upload Photo</FormLabel>
              <FormControl>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </FormControl>
              <FormMessage>{errors.fileName?.message}</FormMessage>
            </FormItem>
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

export default ItemForm;
