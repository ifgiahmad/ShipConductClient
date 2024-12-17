import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  getPreviousTrVesselAssessmentDetail,
  getTrVesselAssessmentDetailById,
  saveTrVesselAssessmentDetail,
  uploadPhoto,
} from "@/services/service_api_vesselAssessmentDetail";
import {
  saveTrVesselAssessmentDetailDto,
  saveTrVesselAssessmentDetailZod,
} from "@/lib/types/TrVesselAssessmentDetail.types";
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
import {
  getMsGradeCriteriaByGrade,
  getMsGradeCriteriaById,
} from "@/services/service_api_gradeCriteria";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrVesselAssessmentDetail } from "@/lib/types/TrVesselAssessmentDetail.types";
import { VwAssessmentDetailCompare } from "@/lib/types/VwAssessmentDetailCompare";
type DetailData = z.infer<typeof saveTrVesselAssessmentDetailZod>;

interface VesselAssessmentDetailFormProps {
  onClose: () => void;
  onSave: () => void;
  id: number;
  idHeader: number;
  vslType: string;
  mode: string;
  idList: number[];
}

const VesselAssessmentDetailForm: React.FC<VesselAssessmentDetailFormProps> = ({
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
  const methods = useForm<saveTrVesselAssessmentDetailDto>({
    resolver: zodResolver(saveTrVesselAssessmentDetailZod),
    defaultValues: {
      id: Number(id),
      vesselAssessmentId: Number(idHeader),
      item: "",
      interval: "",
      shipSection: "",
      categorySection: "",
      grade: 0,
      gradeDescription: "",
      fileName: "",
      smallFileLink: "",
      normalFileLink: "",
      photoDescription: "",
      uploadedBy: "",
      assessedBy: "",
      createdBy: "",
      modifiedBy: "",
      mode: "",
      isDeleted: false,
      /*  categorySectionId: 0, */
    },
  });

  /*   const [previousAssessment, setPreviousAssessment] =
    useState<TrVesselAssessmentDetail[]>(); */
  const [previousAssessment, setPreviousAssessment] =
    useState<VwAssessmentDetailCompare>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [shipSection, setShipSection] = useState<MsShipSection[]>([]);
  const [selectedShipSection, setSelectedShipSection] = useState<
    string | undefined
  >();
  const [interval, setInterval] = useState<MsInterval[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<string>();
  const [gradeCriteria, setGradeCriteria] = useState<MsGradeCriteria[]>([]);

  const [selectedGradeCriteria, setSelectedGradeCriteria] = useState<string[]>(
    []
  );
  const [selectedGrade, setSelectedGrade] = useState<number | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  const [searchTerms, setSearchTerms] = useState({
    ship: "",
    interval: "",
    criteria: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearchChange = (type: string, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [type]: value }));
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
    setValue("gradeDescription", joinedData);
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
      setSelectedCategoryId(selectedShipSection.categoryId);
      setValue("categorySection", selectedShipSection.categorySection || "");
    } else {
      setSelectedShipSection("");
      setValue("categorySection", "");
      setSelectedCategoryId(0);
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

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const fetchData = async () => {
      if (currentId > 0) {
        await getDataById(Number(currentId));
        await getPreviousData(Number(currentId));
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

    async function getPreviousData(Id: Number) {
      try {
        const data = await getPreviousTrVesselAssessmentDetail(Number(Id));
        console.log(data);
        setPreviousAssessment(data);
      } catch (e) {
        console.error("Error fetching data previousAssessment:", e);
      }
    }

    async function getDataById(Id: Number) {
      try {
        const data = await getTrVesselAssessmentDetailById(Number(Id));
        setValue("item", data.item ?? "");
        setValue("interval", data.interval ?? "");

        setValue("grade", data.grade ?? 0);
        setValue("gradeDescription", data.gradeDescription ?? "");

        setValue("fileName", data.fileName ?? "");
        setValue("smallFileLink", data.smallFileLink ?? "");
        setValue("normalFileLink", data.normalFileLink ?? "");
        setValue("photoDescription", data.photoDescription ?? "");
        setValue("vesselAssessmentId", data.vesselAssessmentId ?? 0);
        setValue("shipSection", data.shipSection ?? "");
        setValue("categorySection", data.categorySection ?? "");
        setValue("categorySectionId", data.categorySectionId ?? 0);

        setValue("itemId", data.itemId ?? 0);
        setValue("intervalId", data.intervalId ?? 0);
        setValue("shipSectionId", data.shipSectionId ?? 0);

        setSelectedShipSection(data.shipSection || "");
        setImagePreview(data.normalFileLink || null);
        if (currentMode === "" || currentMode === null) {
          setCurrentMode(data.fileName ? "INPUT GRADE" : "UPLOAD PHOTO");
        }

        if (data.categorySectionId) {
          setSelectedCategoryId(data.categorySectionId);
        }

        if (data.interval) {
          console.log(data.interval);
          setSelectedInterval(data.interval);
          console.log(selectedInterval);
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

        if (data.categorySectionId && data.grade) {
          try {
            const gradeCriteria = await getMsGradeCriteriaByGrade(
              data.grade,
              data.categorySectionId
            );
            setGradeCriteria(gradeCriteria);
          } catch (error) {
            console.error("Error fetching grade criteria:", error);
          }
        }
      } catch (err) {
        console.error("Error fetching data grade criteria:", err);
      }
    }
  }, [currentId, vslType, setValue, currentMode]);

  const fetchGradeCriteria = async (grade: number, categoryId: number) => {
    console.log(grade, categoryId);
    if (!grade || !categoryId) {
      console.warn(
        "No grade and categorysection provided for fetching grade criteria."
      );
      return;
    }

    try {
      const data = await getMsGradeCriteriaByGrade(grade, categoryId);
      setGradeCriteria(data);
    } catch (error) {
      console.error("Error fetching grade criteria:", error);
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
    setLoading(true);
    data.mode = mode;
    if (data.id === 0) {
      data.vesselAssessmentId = idHeader;
    }
    try {
      if (currentMode === "UPLOAD PHOTO") {
        const response = await uploadPhoto(data);
        if (response.status === 200) {
          /*  onSave(); */
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
      } else {
        const ret = await saveTrVesselAssessmentDetail(data);
        if (ret.status === 200) {
          if (currentMode !== "INPUT GRADE") {
            onSave();
          }
          toast({
            description: "Vessel Assessment Detail updated successfully.",
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
    <Tabs defaultValue="currentForm">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="currentForm">Detail Form</TabsTrigger>
        {currentMode === "INPUT GRADE" ? (
          <>
            {" "}
            <TabsTrigger value="previousForm">previous assessment</TabsTrigger>
          </>
        ) : (
          <></>
        )}
      </TabsList>
      <TabsContent value="currentForm">
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
                  <AlertTitle>Delete Data !</AlertTitle>
                  <AlertDescription>
                    Are you sure you want to delete this data?
                  </AlertDescription>
                </Alert>
              </>
            ) : currentMode === "INPUT GRADE" ? (
              <>
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
                          className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage>{errors.item?.message}</FormMessage>
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
                <FormField
                  name="categorySection"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Section</FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          placeholder="Category Section"
                          {...field}
                          className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage>
                        {errors.categorySection?.message}
                      </FormMessage>
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
                          className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage>{errors.shipSection?.message}</FormMessage>
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
                <FormField
                  control={control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const numericValue = Number(value);
                          setSelectedGrade(numericValue);
                          setValue("grade", numericValue);
                          field.onChange(numericValue);
                          fetchGradeCriteria(
                            numericValue,
                            selectedCategoryId ?? 0
                          );
                        }}
                        value={
                          selectedGrade?.toString() || field.value?.toString()
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, index) => {
                            const gradeValue = (index + 1).toString();
                            return (
                              <SelectItem key={gradeValue} value={gradeValue}>
                                {gradeValue}
                              </SelectItem>
                            );
                          })}
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
                      <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="ml-2 bg-orange-600 hover:bg-orange-400 flex justify-end mt-2"
                        type="button"
                      >
                        Select Criteria
                      </Button>
                      <FormMessage>
                        {errors.gradeDescription?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </>
            ) : currentMode === "UPLOAD PHOTO" ? (
              <>
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

                {/* Ship Section Field */}
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

                {/* Image Preview Section */}
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

                {/* Photo Description Field */}
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
                      <FormMessage>
                        {errors.photoDescription?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  name="item"
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
                      <FormMessage>{errors.item?.message}</FormMessage>
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
                          console.log(selectedInterval);
                          setSelectedInterval(value);
                          setValue("interval", value);

                          const _selectedInterval = interval.find(
                            (v) => v.id === parseInt(value, 10)
                          );
                          if (_selectedInterval) {
                            setValue("intervalId", _selectedInterval.id);
                            setValue("interval", _selectedInterval.interval);
                          }
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
                              <SelectItem key={s.id} value={s.id.toString()}>
                                {s.interval}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="shipSection"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ship Section</FormLabel>
                      {/*  <Select
                    onValueChange={(value) => {
                      setSelectedShipSection(value);
                      setValue("shipSection", value);
                      field.onChange(value);
                    }}
                    value={selectedShipSection || field.value}
                  > */}
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value); // Bind form value with field
                          handleShipSectionSelect(value); // Handle additional side effects
                        }}
                        value={field.value} // Controlled value from react-hook-form
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Ship Section" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="p-2">
                            <Input
                              type="text"
                              placeholder="Search Ship Section..."
                              value={searchTerms.ship}
                              onChange={(e) =>
                                handleSearchChange("ship", e.target.value)
                              }
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          {shipSection
                            .filter((s) =>
                              s.sectionName
                                ?.toLowerCase()
                                .includes(searchTerms.ship.toLowerCase())
                            )
                            .map((s) => (
                              <SelectItem key={s.id} value={s.sectionName}>
                                {s.sectionName}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="categorySection"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Section</FormLabel>
                      <Input
                        readOnly
                        className="w-full p-2 border border-gray-300 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Category Section"
                        {...field}
                      />
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
                          Section {selectedCategoryId}{" "}
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
        </FormProvider>
      </TabsContent>
      <TabsContent value="previousForm">
        <div className="mb-2">
          <label
            htmlFor="Item"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Item
          </label>
          <textarea
            readOnly
            name="Item"
            id="Item"
            className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Item Category"
            value={previousAssessment?.item}
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="Item"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Interval
          </label>
          <input
            readOnly
            name="Interval"
            id="Interval"
            className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Interval"
            value={previousAssessment?.interval}
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="categorySection"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Category Section
          </label>
          <input
            readOnly
            name="Interval"
            id="Interval"
            className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Interval"
            value={previousAssessment?.categorySection}
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="shipSection"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Ship Section
          </label>
          <input
            readOnly
            name="shipSection"
            id="shipSection"
            className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ship Section"
            value={previousAssessment?.shipSection}
          />
        </div>
        {previousAssessment?.normalFileLink && (
          <div className="mb-4">
            <img
              src={previousAssessment?.normalFileLink}
              alt="Photo Preview"
              className="w-80 h-60 rounded-md border border-gray-300"
              width={0}
              height={0}
            />
          </div>
        )}
        <div className="mb-2">
          <label
            htmlFor="grade"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Grade
          </label>
          <input
            readOnly
            name="grade"
            id="grade"
            className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Grade"
            value={previousAssessment?.grade}
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="gradeDescription"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Grade Description
          </label>
          <textarea
            readOnly
            name="gradeDescription"
            id="gradeDescription"
            className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Grade Description"
            value={previousAssessment?.gradeDescription}
          />
        </div>
        <></>
      </TabsContent>
    </Tabs>
  );
};

export default VesselAssessmentDetailForm;
