"use client";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  getTrVesselAssessmentDetailByIdForCrew,
  uploadPhotoForCrew,
} from "@/services/service_api_vesselAssessmentForCrew";
import {
  uploadPhotoTrVesselAssessmentDetailDto,
  UploadPhotoTrVesselAssessmentDetailZod,
} from "@/lib/types/TrVesselAssessmentDetail.types";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "../ui/card";
import { getMsItemById } from "@/services/service_api_itemForCrew";

type DetailData = z.infer<typeof UploadPhotoTrVesselAssessmentDetailZod>;

interface UploadPhotoFormProps {
  onClose: () => void;
  onSave: () => void;
  id: number;
  idHeader: number;
  idList: number[];
}

const UploadPhotoForm: React.FC<UploadPhotoFormProps> = ({
  onClose,
  onSave,
  id,
  idHeader,
  idList,
}) => {
  const [currentId, setCurrentId] = useState(id);
  const methods = useForm<uploadPhotoTrVesselAssessmentDetailDto>({
    resolver: zodResolver(UploadPhotoTrVesselAssessmentDetailZod),
    defaultValues: {
      id: Number(id),
      item: "",
      shipSection: "",
      fileName: "",
      smallFileLink: "",
      normalFileLink: "",
      photoDescription: "",
      photo: null,
      itemId: 0,
    },
  });

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePreview2, setImagePreview2] = useState<string | null>(null);
  const [imagePreview3, setImagePreview3] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentId > 0) {
      getDataById(currentId);
    }

    async function getDataById(id: number) {
      try {
        const data = await getTrVesselAssessmentDetailByIdForCrew(id);
        setValue("item", data.item ?? "");
        setValue("itemId", data.itemId ?? 0);
        setValue("shipSection", data.shipSection ?? "");
        setValue("fileName", data.fileName ?? "");
        setValue("smallFileLink", data.smallFileLink ?? "");
        setValue("normalFileLink", data.normalFileLink ?? "");
        setValue("fileName2", data.fileName ?? "");
        setValue("smallFileLink2", data.smallFileLink ?? "");
        setValue("normalFileLink2", data.normalFileLink ?? "");
        setValue("fileName3", data.fileName ?? "");
        setValue("smallFileLink3", data.smallFileLink ?? "");
        setValue("normalFileLink3", data.normalFileLink ?? "");
        setValue("photoDescription", data.photoDescription ?? "");
        setValue("id", data.id ?? 0);

        if (data.normalFileLink) {
          setImagePreview(data.normalFileLink);
        } else {
          setImagePreview(null);
        }

        if (data.normalFileLink2) {
          setImagePreview2(data.normalFileLink2);
        } else {
          setImagePreview2(null);
        }

        if (data.normalFileLink3) {
          setImagePreview3(data.normalFileLink3);
        } else {
          setImagePreview3(null);
        }

        if (data.itemId) {
          const dataItem = await getMsItemById(data.itemId);
        }
      } catch (err) {
        console.error("Failed to fetch data by ID:", err);
      }
    }
  }, [currentId, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("fileName", file.name);
      setValue("photo", file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setValue("fileName", "");
      setValue("photo", null);
      setImagePreview(null);
    }
  };

  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("fileName2", file.name);
      setValue("photo2", file);
      setImagePreview2(URL.createObjectURL(file));
    } else {
      setValue("fileName2", "");
      setValue("photo2", null);
      setImagePreview2(null);
    }
  };

  const handleFileChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("fileName3", file.name);
      setValue("photo3", file);
      setImagePreview3(URL.createObjectURL(file));
    } else {
      setValue("fileName3", "");
      setValue("photo3", null);
      setImagePreview3(null);
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
          setValue("photo", null);
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

  const onDetailSubmit = async (
    data: uploadPhotoTrVesselAssessmentDetailDto
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();
      console.log("dsdassad");

      if (data.photo) {
        const file = data.photo as File;

        // Jika file bertipe HEIC
        if (
          file.type === "image/heic" ||
          file.name.toLowerCase().endsWith(".heic")
        ) {
          if (typeof window !== "undefined") {
            const heic2any = (await import("heic2any")).default;

            const convertedBlob = await heic2any({
              blob: file,
              toType: "image/jpeg",
            });

            const convertedFile = new File(
              [convertedBlob as Blob],
              file.name.replace(/\.heic$/i, ".jpg"),
              { type: "image/jpeg" }
            );
            data.photo = convertedFile;
          } else {
            throw new Error("HEIC conversion is not supported in SSR.");
          }
        } else {
          formData.append("file", file);
        }
      }

      if (data.photo2) {
        const file = data.photo2 as File;

        // Jika file bertipe HEIC
        if (
          file.type === "image/heic" ||
          file.name.toLowerCase().endsWith(".heic")
        ) {
          if (typeof window !== "undefined") {
            const heic2any = (await import("heic2any")).default;

            const convertedBlob = await heic2any({
              blob: file,
              toType: "image/jpeg",
            });

            const convertedFile = new File(
              [convertedBlob as Blob],
              file.name.replace(/\.heic$/i, ".jpg"),
              { type: "image/jpeg" }
            );
            data.photo2 = convertedFile;
          } else {
            throw new Error("HEIC conversion is not supported in SSR.");
          }
        } else {
          formData.append("file", file);
        }
      }

      if (data.photo3) {
        const file = data.photo3 as File;

        // Jika file bertipe HEIC
        if (
          file.type === "image/heic" ||
          file.name.toLowerCase().endsWith(".heic")
        ) {
          if (typeof window !== "undefined") {
            const heic2any = (await import("heic2any")).default;

            const convertedBlob = await heic2any({
              blob: file,
              toType: "image/jpeg",
            });

            const convertedFile = new File(
              [convertedBlob as Blob],
              file.name.replace(/\.heic$/i, ".jpg"),
              { type: "image/jpeg" }
            );
            data.photo3 = convertedFile;
          } else {
            throw new Error("HEIC conversion is not supported in SSR.");
          }
        } else {
          formData.append("file", file);
        }
      }

      const response = await uploadPhotoForCrew(data);

      if (response.status === 200) {
        toast({
          description: "Photo Assessment Detail updated successfully.",
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload photo.",
        });
        return false;
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error uploading photo: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onDetailSubmit)}
            className="grid grid-cols-1 gap-6"
          >
            <Card className="p-2 mt-2">
              <CardContent>
                {imagePreview && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={imagePreview}
                      alt="Photo Preview"
                      className="rounded-md border border-gray-300"
                      style={{ maxWidth: "620px", height: "auto" }}
                    />
                  </div>
                )}

                <FormItem>
                  <FormLabel>
                    Close-up or mid-range photos(Foto jarak dekat atau menengah)
                    <span className="text-red-500"> *</span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </FormControl>
                  <FormMessage>{errors.photo?.message}</FormMessage>
                </FormItem>
              </CardContent>
            </Card>

            <Card className="p-2">
              <CardContent>
                {imagePreview2 && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={imagePreview2}
                      alt="Photo Preview"
                      className="rounded-md border border-gray-300"
                      style={{ maxWidth: "620px", height: "auto" }}
                    />
                  </div>
                )}

                <FormItem>
                  <FormLabel>Overall photo (Foto keseluruhan)</FormLabel>
                  <span className="text-red-500"> *</span>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange2}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </FormControl>
                  <FormMessage>{errors.photo2?.message}</FormMessage>
                </FormItem>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                {imagePreview3 && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={imagePreview3}
                      alt="Photo Preview"
                      className="rounded-md border border-gray-300"
                      style={{ maxWidth: "620px", height: "auto" }}
                    />
                  </div>
                )}

                <FormItem>
                  <FormLabel>Additional Photo (Optional)</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange3}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </FormControl>
                  <FormMessage>{errors.fileName3?.message}</FormMessage>
                </FormItem>
              </CardContent>
            </Card>

            <FormField
              name="photoDescription"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Photo Description"
                      {...field}
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage>{errors.photoDescription?.message}</FormMessage>
                </FormItem>
              )}
            />

            {errors.root && (
              <p className="text-red-500">{errors.root.message}</p>
            )}

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
                  onClick={handleSave} // Use handleSave for the "Save" button
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
      </CardContent>
    </Card>
  );
};

export default UploadPhotoForm;
