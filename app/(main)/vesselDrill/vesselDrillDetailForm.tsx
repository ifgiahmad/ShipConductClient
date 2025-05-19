import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
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
  getTrVesselDrillDetailById,
  saveTrVesselDrillDetail,
  uploadVideo,
} from "@/services/service_api_vesselDrillDetail";
import {
  saveTrVesselDrillDetailDto,
  saveTrVesselDrillDetailZod,
} from "@/lib/types/TrVesselDrillDetail.types";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MsShipSection } from "@/lib/types/MsShipSection.types";
import { getMsShipSectionByVslType } from "@/services/service_api_shipSection";
import { MsInterval } from "@/lib/types/MsInterval.types";
import { getMsInterval } from "@/services/service_api_interval";
import { MsGradeCriteria } from "@/lib/types/MsGradeCriteria.types";
import { getMsGradeCriteriaByGrade } from "@/services/service_api_gradeCriteria";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
type DetailData = z.infer<typeof saveTrVesselDrillDetailZod>;

interface VesselDrillDetailFormProps {
  onClose: () => void;
  onSave: () => void;
  id: number;
  idHeader: number;
  vslType: string;
  mode: string;
  idList: number[];
}

const VesselDrillDetailForm: React.FC<VesselDrillDetailFormProps> = ({
  onClose,
  onSave,
  id,
  idHeader,
  vslType,
  mode,
  idList,
}) => {
  const [currentId, setCurrentId] = useState(id);
  const [currentMode, setCurrentMode] = useState(mode);
  const methods = useForm<saveTrVesselDrillDetailDto>({
    resolver: zodResolver(saveTrVesselDrillDetailZod),
    defaultValues: {
      id: Number(id),
      vesselDrillId: Number(idHeader),
      itemName: "",
      interval: "",
      grade: "",
      gradeDescription: "",
      fileName: "",
      smallFileLink: "",
      normalFileLink: "",
      videoDescription: "",
      uploadedBy: "",
      assessedBy: "",
      createdBy: "",
      modifiedBy: "",
      mode: "",
      isDeleted: false,
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

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [docPreview2, setDocPreview2] = useState<string | null>(null);
  const [docPreview3, setDocPreview3] = useState<string | null>(null);
  const [docPreview4, setDocPreview4] = useState<string | null>(null);
  const [docPreview5, setDocPreview5] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [shipSection, setShipSection] = useState<MsShipSection[]>([]);
  const [selectedShipSection, setSelectedShipSection] = useState<
    string | undefined
  >();
  const [interval, setInterval] = useState<MsInterval[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<
    string | undefined
  >();
  const [gradeCriteria, setGradeCriteria] = useState<MsGradeCriteria[]>([]);

  const [selectedGradeCriteria, setSelectedGradeCriteria] = useState<string[]>(
    []
  );
  const [selectedGrade, setSelectedGrade] = useState<number | undefined>();
  const [selectedCategorySection, setSelectedCategorySection] = useState<
    string | undefined
  >();
  const [searchTerms, setSearchTerms] = useState({
    ship: "",
    interval: "",
    criteria: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [isModalOpenDoc, setModalOpenDoc] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<string | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const extraDocFields = [
    "docName2",
    "docName3",
    "docName4",
    "docName5",
  ] as const;
  const extraDocPreviews = [docPreview2, docPreview3, docPreview4, docPreview5];

  const handleSearchChange = (type: string, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [type]: value }));
  };

  const handleCloseDocument = () => {
    setModalOpenDoc(false);
  };

  const handleOpenDocument = (selectedDoc: string) => {
    setModalOpenDoc(true);
    setSelectedDocPreview(selectedDoc);
  };

  const handlePrevious = () => {
    const currentIndex = idList.indexOf(currentId);
    if (currentIndex > 0) {
      setCurrentId(idList[currentIndex - 1]);
      setCurrentMode("");
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
          setCurrentMode("");
        }
      }
      return success;
    })();
  };

  const applySelection = () => {
    const joinedData = selectedGradeCriteria.join(", ");
    setValue("gradeDescription", joinedData); // Masukkan ke inputan gradedescription
    setIsDialogOpen(false);
  };

  const handleCheckboxChange = (item: string) => {
    setSelectedGradeCriteria((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleValueChange = (value: string) => {
    setSelectedGradeCriteria(
      (prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value) // Remove if already selected
          : [...prev, value] // Add if not selected
    );
  };

  const handleShipSectionSelect = (value: string) => {
    const selectedShipSection = shipSection.find(
      (shipSection) => shipSection.sectionName === value
    );
    if (selectedShipSection) {
      setSelectedShipSection(selectedShipSection.sectionName);
    } else {
      setSelectedShipSection("");
    }
  };

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

  const {
    setValue,
    setError,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const fetchData = async () => {
      if (currentId > 0) {
        await getDataById(Number(currentId));
        if (
          currentMode === "" ||
          currentMode === undefined ||
          currentMode === null
        ) {
          mode = currentMode;
        }
      } else {
        setValue("mode", "CREATE");

        if (!vslType) {
          console.warn("No vessel type provided for fetching ship sections.");
          return;
        }

        try {
          const shipSections = await getMsShipSectionByVslType(vslType);
          setShipSection(shipSections);
        } catch (error) {
          console.error(
            "Error fetching ship sections for vessel type:",
            vslType,
            error
          );
        }
      }
    };
    fetchInterval();
    fetchData();

    async function getDataById(Id: Number) {
      try {
        const data = await getTrVesselDrillDetailById(Number(Id));
        setValue("itemName", data.itemName ?? "");
        setValue("itemType", data.itemType ?? "");
        setValue("interval", data.interval ?? "");
        setValue("itemId", data.itemId ?? 0);
        setValue("intervalId", data.intervalId ?? 0);
        setValue("grade", data.grade ?? "");
        setValue("gradeDescription", data.gradeDescription ?? "");

        setValue("fileName", data.fileName ?? "");
        setValue("smallFileLink", data.smallFileLink ?? "");
        setValue("normalFileLink", data.normalFileLink ?? "");
        setValue("videoDescription", data.videoDescription ?? "");
        setValue("vesselDrillId", data.vesselDrillId ?? 0);
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

        if (vslType) {
          try {
            const shipSections = await getMsShipSectionByVslType(vslType);
            setShipSection(shipSections);
          } catch (error) {
            console.error(
              "Error fetching ship sections for vessel type:",
              vslType,
              error
            );
          }
        }
      } catch (err) {
        console.error("Error fetching data grade criteria:", err);
      }
    }
  }, [currentId, vslType, setValue, currentMode]);

  const fetchGradeCriteria = async (grade: number, categorySection: string) => {
    console.log(grade, categorySection);
    if (!grade || !categorySection) {
      console.warn(
        "No grade and categorysection provided for fetching grade criteria."
      );
      return;
    }
  };

  const fetchInterval = async () => {
    try {
      const interval = await getMsInterval();
      setInterval(interval);
    } catch (error) {
      console.error("Error fetching interval:", error);
    }
  };

  const onDetailSubmit = async (data: DetailData) => {
    console.log(data);
    setLoading(true);
    data.mode = mode;
    if (data.id === 0) {
      data.vesselDrillId = idHeader;
    }
    try {
      if (currentMode === "UPLOAD VIDEO") {
        const response = await uploadVideo(data);
        if (response.status === 200) {
          toast({
            description: "Video Drill updated successfully.",
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
      } else {
        const ret = await saveTrVesselDrillDetail(data);
        if (ret.status === 200) {
          if (currentMode !== "INPUT GRADE") {
            onSave();
          }
          toast({
            description: "Vessel Drill Detail updated successfully.",
          });
          return true;
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update data",
          });
          return false;
        }
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Error updating data: " +
          (err instanceof Error ? err.message : "Unknown error"),
      });
      return false;
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onDetailSubmit)}
        className="grid grid-cols-1 gap-6"
      >
        {currentMode === "DELETE" ? (
          <>
            {" "}
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Delete Data!</AlertTitle>
              <AlertDescription>
                Are you sure you want to delete this data?
              </AlertDescription>
            </Alert>
          </>
        ) : currentMode === "INPUT GRADE" ? (
          <>
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
                      className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage>{errors.itemName?.message}</FormMessage>
                </FormItem>
              )}
            />
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
                      className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <FormField
              control={control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="DONE" value="DONE">
                        DONE
                      </SelectItem>
                      <SelectItem key="PERINGATAN SP" value="PERINGATAN SP">
                        PERINGATAN
                      </SelectItem>
                      <SelectItem key="DOCKING" value="DOCKING">
                        DOCKING
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="gradeDescription"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Grade Description"
                      {...field}
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>

                  <FormMessage>{errors.gradeDescription?.message}</FormMessage>
                </FormItem>
              )}
            />
          </>
        ) : currentMode === "UPLOAD VIDEO" ? (
          <>
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
          </>
        ) : (
          <>
            <FormField
              name="itemName"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Item Category"
                      {...field}
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage>{errors.itemName?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interval</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setSelectedInterval(value);
                      setValue("interval", value);
                      field.onChange(value);
                    }}
                    value={selectedInterval || field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          type="text"
                          placeholder="Search Interval..."
                          value={searchTerms.interval}
                          onChange={(e) =>
                            handleSearchChange("interval", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      {interval
                        .filter((s) =>
                          s.interval
                            ?.toLowerCase()
                            .includes(searchTerms.interval.toLowerCase())
                        )
                        .map((s) => (
                          <SelectItem key={s.id} value={s.interval}>
                            {s.interval}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Select Criteria</DialogTitle>
          <div>
            <Card>
              <CardContent>
                {gradeCriteria.length > 0 ? (
                  <>
                    {gradeCriteria.map((item) => (
                      <div key={item.id}>
                        <Checkbox
                          checked={selectedGradeCriteria.includes(
                            item.criteria
                          )}
                          onCheckedChange={() =>
                            handleCheckboxChange(item.criteria)
                          }
                          className="mr-2"
                        />
                        <span>{item.criteria}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <p>
                      Data Not Found for Grade {selectedGrade} and Category
                      Section {selectedCategorySection}{" "}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              className="bg-green-800 hover:bg-green-500"
              type="button"
              onClick={applySelection}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/*  <Dialog open={isModalOpenDoc} onOpenChange={handleCloseDocument}>
        <DialogContent className="lg:max-w-[1200px] max-h-[800px] overflow-auto">
          <DialogTitle>Dokumen Drill</DialogTitle>

          {docPreview && (
            <div className="flex justify-center mt-4">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  docPreview
                )}&embedded=true`}
                width="1000"
                height="700"
                className="mt-4"
                loading="lazy"
              />
            </div>
          )}
        </DialogContent>
      </Dialog> */}
      <Dialog open={isModalOpenDoc} onOpenChange={handleCloseDocument}>
        <DialogContent className="lg:max-w-[1200px] max-h-[800px] overflow-auto">
          <DialogTitle>Dokumen Drill</DialogTitle>
          {selectedDocPreview && (
            <div className="flex justify-center mt-4">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  selectedDocPreview
                )}&embedded=true`}
                width="100%"
                height="400"
                className="rounded"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};

export default VesselDrillDetailForm;
