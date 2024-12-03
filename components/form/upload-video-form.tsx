import React, { useEffect, useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  getTrVesselDrillDetailByIdForCrew,
  uploadVideoForCrew,
} from "@/services/service_api_vesselDrillForCrew";
import {
  uploadVideoTrVesselDrillDetailDto,
  uploadVideoTrVesselDrillDetailZod,
} from "@/lib/types/TrVesselDrillDetail.types";
import { toast } from "@/hooks/use-toast";

interface UploadVideoFormProps {
  onClose: () => void;
  onSave: () => void;
  id: number;
  idHeader: number;
  idList: number[];
}

const UploadVideoForm: React.FC<UploadVideoFormProps> = ({
  onClose,
  onSave,
  id,
  idHeader,
  idList,
}) => {
  const [currentId, setCurrentId] = useState(id);
  const methods = useForm<uploadVideoTrVesselDrillDetailDto>({
    resolver: zodResolver(uploadVideoTrVesselDrillDetailZod),
    defaultValues: {
      id: Number(id),
      item: "",
      shipSection: "",
      fileName: "",
      smallFileLink: "",
      normalFileLink: "",
      videoDescription: "",
      video: null,
    },
  });

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentId > 0) {
      getDataById(currentId);
    }

    async function getDataById(id: number) {
      try {
        const data = await getTrVesselDrillDetailByIdForCrew(id);
        setValue("item", data.item ?? "");
        setValue("shipSection", data.shipSection ?? "");
        setValue("fileName", data.fileName ?? "");
        setValue("smallFileLink", data.smallFileLink ?? "");
        setValue("normalFileLink", data.normalFileLink ?? "");
        setValue("videoDescription", data.videoDescription ?? "");
        setValue("id", data.id ?? 0);

        if (data.normalFileLink) {
          setImagePreview(data.normalFileLink);
        } else {
          setImagePreview(null);
        }
      } catch (err) {
        console.error("Failed to fetch data by ID:", err);
      }
    }
  }, [currentId, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith("video/")) {
        setValue("fileName", file.name);
        setValue("video", file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a valid video file.",
        });
        setValue("fileName", "");
        setValue("video", null);
        setImagePreview(null);
      }
    } else {
      setValue("fileName", "");
      setValue("video", null);
      setImagePreview(null);
    }
  };

  const handleSave = async () => {
    return await handleSubmit(async (data) => {
      const success = await onDetailSubmit(data);
      if (success) {
        onSave();
      }
      return success;
    })();
  };

  const handleNextWithSave = async () => {
    return await handleSubmit(async (data) => {
      const success = await onDetailSubmit(data);
      if (success) {
        const nextIndex = idList.indexOf(currentId) + 1;
        if (nextIndex < idList.length) {
          setCurrentId(idList[nextIndex]);

          const fileInput = document.querySelector("input[type='file']");
          if (fileInput) {
            (fileInput as HTMLInputElement).value = "";
          }
          setImagePreview(null);
          setValue("fileName", "");
          setValue("video", null);
        }
      }
      return success;
    })();
  };

  const handlePrevious = () => {
    const currentIndex = idList.indexOf(currentId);
    if (currentIndex > 0) {
      setCurrentId(idList[currentIndex - 1]);
    }
  };

  const onDetailSubmit = async (data: uploadVideoTrVesselDrillDetailDto) => {
    setLoading(true);
    try {
      const response = await uploadVideoForCrew(data);
      if (response.status === 200) {
        toast({
          description: "Video Drill Detail updated successfully.",
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload video.",
        });
        return false;
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error uploading video: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onDetailSubmit)}
        className="grid grid-cols-1 gap-6"
      >
        <FormField
          name="item"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item</FormLabel>
              <FormControl>
                <Textarea
                  readOnly
                  placeholder="Item Category"
                  {...field}
                  className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                />
              </FormControl>
              <FormMessage>{errors.item?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          name="shipSection"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ship Section</FormLabel>
              <FormControl>
                <Input
                  readOnly
                  placeholder="Ship Section"
                  {...field}
                  className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                />
              </FormControl>
              <FormMessage>{errors.shipSection?.message}</FormMessage>
            </FormItem>
          )}
        />

        {imagePreview && (
          <div className="mb-4 flex justify-center">
            <video
              src={imagePreview}
              controls
              className="rounded-md border border-gray-300"
              style={{ maxWidth: "620px", height: "auto" }}
            />
          </div>
        )}

        <FormItem>
          <FormLabel>Upload Video</FormLabel>
          <FormControl>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </FormControl>
          <FormMessage>{errors.fileName?.message}</FormMessage>
        </FormItem>

        <FormField
          name="videoDescription"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Video Description"
                  {...field}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormMessage>{errors.videoDescription?.message}</FormMessage>
            </FormItem>
          )}
        />

        <div className="flex justify-between mt-4">
          <div className="flex space-x-4">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={idList.indexOf(currentId) <= 0}
              className="mt-3 inline-flex justify-center rounded-md border shadow-sm px-4 py-2  bg-gray-400 hover:bg-gray-200 text-gray-700"
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={handleNextWithSave}
              disabled={
                idList.indexOf(currentId) >= idList.length - 1 || loading
              }
              className="mt-3 inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-gray-400 hover:bg-gray-200 text-gray-700"
            >
              Next
            </Button>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-white hover:bg-gray-200 text-gray-700"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className={`mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-900 hover:bg-green-600 text-white"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default UploadVideoForm;
