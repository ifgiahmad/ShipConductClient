import React, { useEffect, useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";

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
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Card, CardContent } from "../ui/card";

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
      itemName: "",
      itemType: "",
      interval: "",
      intervalId: 0,
      fileName: "",
      docName: "",
      smallFileLink: "",
      normalFileLink: "",
      docLink: "",
      videoDescription: "",
      video: null,
      doc: null,
      doc2: null,
      docLink2: "",
      docName2: "",
      doc3: null,
      docLink3: "",
      docName3: "",
      doc4: null,
      docLink4: "",
      docName4: "",
      doc5: null,
      docLink5: "",
      docName5: "",
    },
  });

  const {
    setValue,
    setError,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = methods;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [docPreview2, setDocPreview2] = useState<string | null>(null);
  const [docPreview3, setDocPreview3] = useState<string | null>(null);
  const [docPreview4, setDocPreview4] = useState<string | null>(null);
  const [docPreview5, setDocPreview5] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenDoc, setModalOpenDoc] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedDocPreview, setSelectedDocPreview] = useState<string | null>(
    null
  );
  const extraDocFields = [
    "docName2",
    "docName3",
    "docName4",
    "docName5",
  ] as const;
  const extraDocPreviews = [docPreview2, docPreview3, docPreview4, docPreview5];

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    if (currentId > 0) {
      getDataById(currentId);
    }

    async function getDataById(id: number) {
      try {
        const data = await getTrVesselDrillDetailByIdForCrew(id);
        console.log(data);
        setValue("itemName", data.itemName ?? "");
        setValue("itemType", data.itemType ?? "");
        setValue("fileName", data.fileName ?? "");
        setValue("smallFileLink", data.smallFileLink ?? "");
        setValue("normalFileLink", data.normalFileLink ?? "");
        setValue("videoDescription", data.videoDescription ?? "");
        setValue("id", data.id ?? 0);
        setValue("intervalId", data.intervalId ?? 0);
        setValue("interval", data.interval ?? "");

        if (data.normalFileLink) {
          setImagePreview(data.normalFileLink);
        } else {
          setImagePreview(null);
        }

        if (data.docLink) {
          setDocPreview(data.docLink);
          setValue("docName", data.docName);
        } else {
          setDocPreview(null);
        }
        if (data.docLink2) {
          setDocPreview2(data.docLink2);
          setValue("docName2", data.docName2);
        } else {
          setDocPreview2(null);
        }
        if (data.docLink3) {
          setDocPreview3(data.docLink3);
          setValue("docName3", data.docName3);
        } else {
          setDocPreview3(null);
        }
        if (data.docLink4) {
          setDocPreview4(data.docLink4);
          setValue("docName4", data.docName4);
        } else {
          setDocPreview4(null);
        }
        if (data.docLink5) {
          setDocPreview5(data.docLink5);
          setValue("docName5", data.docName5);
        } else {
          setDocPreview5(null);
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

  const handleDocChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setValue("docName", file.name);
        setValue("doc", file);
        setDocPreview(URL.createObjectURL(file)); // Menyiapkan URL untuk ditampilkan
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a valid PDF file.",
        });
        setValue("docName", "");
        setValue("doc", null);
        setDocPreview(null);
      }
    } else {
      setValue("docName", "");
      setValue("doc", null);
      setDocPreview(null);
    }
  };

  const handleDocChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.type === "application/pdf") {
      setValue("docName2", file.name);
      setValue("doc2", file);
      setDocPreview2(URL.createObjectURL(file));
    } else {
      showInvalidFileToast();
      setValue("docName2", "");
      setValue("doc2", null);
      setDocPreview2(null);
    }
  };

  const handleDocChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.type === "application/pdf") {
      setValue("docName3", file.name);
      setValue("doc3", file);
      setDocPreview3(URL.createObjectURL(file));
    } else {
      showInvalidFileToast();
      setValue("docName3", "");
      setValue("doc3", null);
      setDocPreview3(null);
    }
  };

  const handleDocChange4 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.type === "application/pdf") {
      setValue("docName4", file.name);
      setValue("doc4", file);
      setDocPreview4(URL.createObjectURL(file));
    } else {
      showInvalidFileToast();
      setValue("docName4", "");
      setValue("doc4", null);
      setDocPreview4(null);
    }
  };

  const handleDocChange5 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.type === "application/pdf") {
      setValue("docName5", file.name);
      setValue("doc5", file);
      setDocPreview5(URL.createObjectURL(file));
    } else {
      showInvalidFileToast();
      setValue("docName5", "");
      setValue("doc5", null);
      setDocPreview5(null);
    }
  };

  const extraDocHandlers = [
    handleDocChange2,
    handleDocChange3,
    handleDocChange4,
    handleDocChange5,
  ];

  const showInvalidFileToast = () => {
    toast({
      variant: "destructive",
      title: "Invalid File Type",
      description: "Please upload a valid PDF file.",
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    onClose();
  };

  const handleOpenDocument = (selectedDoc: string) => {
    setModalOpenDoc(true);
    setSelectedDocPreview(selectedDoc);
  };

  const handleCloseDocument = () => {
    setModalOpenDoc(false);
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
    console.log(data);
    if (!data.doc) {
      setError("docName", {
        type: "manual",
        message: "Document is required.",
      });
      return false;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const response = await uploadVideoForCrew(data, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        }
      });

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
      <div className="w-full max-w-[600px] mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md">
        <form
          onSubmit={handleSubmit(onDetailSubmit)}
          className="grid grid-cols-1 gap-4 text-sm"
        >
          {/* Item Name */}
          <FormField
            name="itemName"
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
                <FormMessage>{errors.itemName?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Interval */}
          <FormField
            name="interval"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interval</FormLabel>
                <FormControl>
                  <Input
                    readOnly
                    placeholder="Interval"
                    {...field}
                    className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                  />
                </FormControl>
                <FormMessage>{errors.interval?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Video Upload (Drill Only) */}
          {getValues("itemType") === "Drill" && (
            <>
              <Card className="p-2 mt-2">
                <CardContent>
                  {imagePreview && (
                    <div className="mb-4 flex justify-center">
                      <video
                        src={imagePreview}
                        controls
                        className="rounded-md border border-gray-300"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </div>
                  )}

                  {loading && (
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div
                        className="bg-green-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                      <p className="text-sm mt-1 text-gray-600 text-center">
                        {uploadProgress}%
                      </p>
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
                        <FormMessage>
                          {errors.videoDescription?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </>
          )}

          <Card>
            <CardContent>
              {/* Dokumen Upload */}
              {docPreview && (
                <div className="mt-2 flex items-center space-x-4">
                  <FormField
                    name="docName"
                    control={control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            readOnly
                            placeholder="Document"
                            {...field}
                            className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    onClick={() => handleOpenDocument(docPreview)}
                    className="bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    View Document
                  </Button>
                </div>
              )}

              <FormItem>
                <FormLabel>Upload Document</FormLabel>
                <FormControl>
                  <input
                    type="file"
                    accept="pdf/*"
                    onChange={handleDocChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </FormControl>
                <FormMessage>{errors.docName?.message}</FormMessage>
              </FormItem>
            </CardContent>
          </Card>

          {/* Tambahan Dokumen untuk SafetyReport */}
          {getValues("itemType") === "ReportSafety" && (
            <Card className="mt-4">
              <CardContent className="space-y-4">
                {extraDocPreviews.map(
                  (preview, i) =>
                    preview && (
                      <div
                        key={i}
                        className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4"
                      >
                        <FormField
                          name={extraDocFields[i]}
                          control={control}
                          render={({ field }) => (
                            <FormItem className="w-full md:max-w-xs mt-2">
                              <FormControl>
                                <Input
                                  readOnly
                                  placeholder="Document"
                                  {...field}
                                  className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          onClick={() => handleOpenDocument(preview!)}
                          className="inline-flex justify-center rounded-md border shadow-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2"
                        >
                          View Document
                        </Button>
                      </div>
                    )
                )}

                {extraDocHandlers.map((handler, i) => (
                  <FormItem key={i}>
                    <FormLabel>{`Upload Document ${i + 2}`}</FormLabel>
                    <FormControl>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handler}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </FormControl>
                    <FormMessage>
                      {errors[extraDocFields[i]]?.message}
                    </FormMessage>
                  </FormItem>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Tombol Navigasi */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={handlePrevious}
                disabled={idList.indexOf(currentId) <= 0}
                className="bg-gray-400 hover:bg-gray-300 text-gray-700"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={handleNextWithSave}
                disabled={
                  idList.indexOf(currentId) >= idList.length - 1 || loading
                }
                className="bg-gray-400 hover:bg-gray-300 text-gray-700"
              >
                Next
              </Button>
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={onClose}
                className="bg-white hover:bg-gray-100 text-gray-700 border"
              >
                Close
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={`${
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

        {/* Modal Dokumen */}
        <Dialog open={isModalOpenDoc} onOpenChange={handleCloseDocument}>
          <DialogContent className="lg:max-w-[1200px] max-h-[800px] overflow-auto">
            <DialogTitle>Dokumen Drill</DialogTitle>
            {selectedDocPreview && (
              <div className="flex justify-center mt-4">
                <iframe
                  src={selectedDocPreview}
                  width="100%"
                  height="400"
                  className="rounded"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </FormProvider>
  );
};

export default UploadVideoForm;
