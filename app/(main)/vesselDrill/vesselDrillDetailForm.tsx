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
      item: "",
      interval: "",
      shipSection: "",
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
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  /* const [selectedGradeCriteria, setSelectedGradeCriteria] = useState([]);
   */
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
      setValue("fileName", file.name);
      setValue("video", file);
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
        setValue("item", data.item ?? "");
        setValue("interval", data.interval ?? "");

        setValue("grade", data.grade ?? "");
        setValue("gradeDescription", data.gradeDescription ?? "");

        setValue("fileName", data.fileName ?? "");
        setValue("smallFileLink", data.smallFileLink ?? "");
        setValue("normalFileLink", data.normalFileLink ?? "");
        setValue("videoDescription", data.videoDescription ?? "");
        setValue("vesselDrillId", data.vesselDrillId ?? 0);
        setValue("shipSection", data.shipSection ?? "");

        setSelectedShipSection(data.shipSection || "");
        setImagePreview(data.normalFileLink || null);
        if (currentMode === "" || currentMode === null) {
          setCurrentMode(data.fileName ? "INPUT GRADE" : "UPLOAD VIDEO");
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

    try {
      const data = await getMsGradeCriteriaByGrade(grade, categorySection);
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
            description: "Failed to upload photo.",
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
              <div className="mb-4 flex justify-center">
                <video
                  src={imagePreview}
                  controls
                  className="rounded-md border border-gray-300"
                  style={{ maxWidth: "320px", height: "auto" }}
                />
              </div>
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
                      <SelectItem
                        key="Video is appropriate"
                        value="Video is appropriate"
                      >
                        Video is appropriate
                      </SelectItem>
                      <SelectItem
                        key="Video is not appropriate"
                        value="Video is not appropriate"
                      >
                        Video is not appropriate
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

            <FormItem>
              <FormLabel>Upload Video</FormLabel>
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

            <FormField
              control={control}
              name="shipSection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ship Section</FormLabel>
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
    </FormProvider>
  );
};

export default VesselDrillDetailForm;
