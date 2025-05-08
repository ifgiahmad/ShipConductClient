"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveMsAssessmentCategoryDto,
  saveMsAssessmentCategoryZod,
} from "@/lib/types/MsAssessmentCategory.types";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getMsAssessmentCategoryById,
  saveMsAssessmentCategory,
  uploadPhoto,
} from "@/services/service_api";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MsVesselType } from "@/lib/types/Master.types";
import { MsItem } from "@/lib/types/MsItem.types";
import { MsShipSection } from "@/lib/types/MsShipSection.types";
import { MsInterval } from "@/lib/types/MsInterval.types";
import { MsRoleCategory } from "@/lib/types/MsRoleCategory.types";
import { useToast } from "@/hooks/use-toast";
import { getMsVesselType } from "@/services/service_api_master";
import { getMsInterval } from "@/services/service_api_interval";
import { getMsItem } from "@/services/service_api_item";
import { getMsRoleCategory } from "@/services/service_api_roleCategory";
import { getMsShipSectionByVslType } from "@/services/service_api_shipSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

type DataModel = z.infer<typeof saveMsAssessmentCategoryZod>;

interface AssessmentCategoryFormProps {
  onClose: () => void;
  onSave: () => void;
  id: number;
  mode: string;
}

const DialogEditAssessmentCategory = ({
  onClose,
  onSave,
  id,
  mode,
}: AssessmentCategoryFormProps) => {
  const { toast } = useToast();
  const [vesselType, setVesselType] = useState<MsVesselType[]>([]);
  const [selectedVesselType, setSelectedVesselType] = useState<
    string | undefined
  >();
  const [item, setItem] = useState<MsItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | undefined>();
  const [shipSection, setShipSection] = useState<MsShipSection[]>([]);
  const [selectedShipSection, setSelectedShipSection] = useState<
    string | undefined
  >();
  const [interval, setInterval] = useState<MsInterval[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<
    string | undefined
  >();

  const [roleCategory, setRoleCategory] = useState<MsRoleCategory[]>([]);
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<
    string | undefined
  >();
  const [searchTerms, setSearchTerms] = useState({
    vessel: "",
    ship: "",
    interval: "",
    item: "",
    roleCategory: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<saveMsAssessmentCategoryDto>({
    resolver: zodResolver(saveMsAssessmentCategoryZod),
    defaultValues: {
      id: Number(id),
      vslType: "",
      item: "",
      itemId: Number(0),
      interval: "",
      intervalId: Number(0),
      shipSection: "",
      shipSectionId: Number(0),
      roleCategory: "",
      roleCategoryId: Number(0),
      categorySection: "",
      mode: "",
      deleted: false,
    },
  });
  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      console.log("🔄 Initializing component with ID:", id);

      if (id > 0) {
        try {
          const data = await getMsAssessmentCategoryById(id);
          if (!isMounted) return;

          console.log("✅ Data fetched from API:", data);

          setValue("categorySection", data.categorySection);

          if (typeof data.vslType === "string" && data.vslType.trim() !== "") {
            console.log("🚢 Vessel type found:", data.vslType);

            setSelectedVesselType(data.vslType); // Ini untuk form
            setValue("vslType", data.vslType); // Ini untuk form

            // Panggil langsung dengan data.vslType
            console.log(
              "👉 Passing vslType to loadShipSections:",
              data.vslType
            );
            await loadShipSections(data.vslType);
          } else {
            console.warn("⚠️ Vessel type is missing or invalid:", data.vslType);
          }

          if (data.shipSection) {
            setValue("shipSection", data.shipSection);
            setValue("shipSectionId", data.shipSectionId);
            setSelectedShipSection(data.shipSection);
          }

          if (data.startMonth) {
            setValue("startMonth", data.startMonth);
            setValue("startMonthString", data.startMonthString);
          }

          if (data.item) {
            setValue("item", data.item);
            setValue("itemId", data.itemId ?? 0);
            setSelectedItem(data.item);
          }

          if (data.interval) {
            setValue("interval", data.interval);
            setValue("intervalId", data.intervalId);
            setSelectedInterval(data.interval);
          }

          if (data.roleCategory) {
            setValue("roleCategory", data.roleCategory);
            setValue("roleCategoryId", data.roleCategoryId);
            setSelectedRoleCategory(data.roleCategory);
          }

          setImagePreview(data.fileLink || null);
        } catch (error) {
          console.error("❌ Error fetching assessment category data:", error);
        }
      } else {
        console.log("🆕 New entry mode: CREATE");
        setValue("mode", "CREATE");
      }

      try {
        await Promise.all([
          loadVesselAndIntervalData(),
          loadItemData(),
          loadRoleCategoryData(),
        ]);
      } catch (err) {
        console.error("❌ Error initializing supporting data:", err);
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, [
    id,
    setValue,
    setSelectedInterval,
    setSelectedShipSection,
    setSelectedVesselType,
    setSelectedItem,
    setSelectedRoleCategory,
  ]);

  // ====================
  // SUPPORTING FUNCTIONS
  // ====================

  const loadVesselAndIntervalData = async () => {
    try {
      const [vesselData, intervalData] = await Promise.all([
        getMsVesselType(),
        getMsInterval(),
      ]);
      console.log("✅ Vessel types:", vesselData);
      console.log("✅ Intervals:", intervalData);
      setVesselType(vesselData);
      setInterval(intervalData);
    } catch (error) {
      console.error("❌ Error loading vessel or interval data:", error);
    }
  };

  const loadItemData = async () => {
    try {
      const itemData = await getMsItem();
      console.log("✅ Items loaded:", itemData);
      setItem(itemData);
    } catch (error) {
      console.error("❌ Error loading item data:", error);
    }
  };

  const loadRoleCategoryData = async () => {
    try {
      const roleData = await getMsRoleCategory();
      console.log("✅ Role categories loaded:", roleData);
      setRoleCategory(roleData);
    } catch (error) {
      console.error("❌ Error loading role category data:", error);
    }
  };

  const loadShipSections = async (vslType: string) => {
    if (!vslType || vslType.trim() === "") {
      console.warn(
        "⚠️ Invalid vessel type passed to loadShipSections:",
        vslType
      );
      return;
    }

    try {
      const data = await getMsShipSectionByVslType(vslType);
      console.log(`✅ Ship sections for vessel type '${vslType}':`, data);
      setShipSection(data);
    } catch (error) {
      console.error(`❌ Error fetching ship sections for '${vslType}':`, error);
    }
  };

  const handleSearchChange = (type: string, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [type]: value }));
  };

  const handleShipSectionSelect = (value: string) => {
    console.log("Selected Ship Section Value:", value);
    if (value) {
      const selectedShipSection = shipSection.find(
        (shipSection) => shipSection.sectionName === value
      );
      if (selectedShipSection) {
        setSelectedShipSection(selectedShipSection.sectionName); // Pastikan ini benar
        setValue("categorySection", selectedShipSection.categorySection || "");
        setValue("shipSectionId", selectedShipSection.id || 0);
      }
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

  const onSubmit: SubmitHandler<DataModel> = async (data) => {
    data.mode = mode;
    try {
      setIsLoading(true);
      const response = await saveMsAssessmentCategory(data);
      if (response.status === "OK") {
        if (data.photo) {
          data.id = response.returnId;
          const resPhoto = await uploadPhoto(data);
          console.log(resPhoto);
          if (resPhoto.status === 200) {
            onSave();
            toast({
              description:
                "Assessment Category and Photo updated successfully.",
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
          toast({ description: "Assessment Category updated successfully." });
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
    setIsLoading(false);
  };
  return (
    <>
      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Card className="mb-2 p-2">
          <CardHeader className="pb-2">
            {/*  <CardTitle className="text-lg">
              {mode} Assessment Category
            </CardTitle> */}
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {mode === "DELETE" ? (
                  <div className="md:col-span-2">
                    <Alert>
                      <Terminal className="h-4 w-4" />
                      <AlertTitle className="text-sm">Delete Data!</AlertTitle>
                      <AlertDescription className="text-sm">
                        Are you sure you want to delete this data?
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <>
                    {/* Vessel Type */}
                    <Card className="p-2">
                      <FormField
                        control={control}
                        name="vslType"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">
                              Vessel Type
                            </FormLabel>
                            <Select
                              onValueChange={(value) => {
                                if (value && value.trim() !== "") {
                                  console.log(
                                    "✅ Selected vessel type:",
                                    value
                                  );
                                  setSelectedVesselType(value);
                                  setValue("vslType", value);
                                  loadShipSections(value);
                                } else {
                                  console.warn(
                                    "⚠️ Attempted to select empty vessel type"
                                  );
                                }
                              }}
                              // Hanya ambil dari field, biarkan react-hook-form mengatur state
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Vessel Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="p-2">
                                  <Input
                                    type="text"
                                    placeholder="Search Vessel Type..."
                                    value={searchTerms.vessel}
                                    onChange={(e) =>
                                      handleSearchChange(
                                        "vessel",
                                        e.target.value
                                      )
                                    }
                                    className="w-full p-1 text-sm"
                                  />
                                </div>
                                {vesselType
                                  .filter((v) =>
                                    v.keterangan
                                      ?.toLowerCase()
                                      .includes(
                                        searchTerms.vessel.toLowerCase()
                                      )
                                  )
                                  .map((v) => (
                                    <SelectItem
                                      key={v.vslType}
                                      value={v.vslType}
                                    >
                                      {v.keterangan}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Ship Section */}
                      <FormField
                        control={control}
                        name="shipSection"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Ship Section</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                if (value && value.trim() !== "") {
                                  console.log(
                                    "✅ Selected Ship Section:",
                                    value
                                  );
                                  setSelectedShipSection(value);
                                  setValue("shipSection", value);
                                  handleShipSectionSelect(value);
                                } else {
                                  console.warn(
                                    "⚠️ Attempted to select empty vessel type"
                                  );
                                }
                              }}
                              value={field.value}
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
                                    <SelectItem
                                      key={s.id}
                                      value={s.sectionName}
                                    >
                                      {s.sectionName}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Interval */}
                      <FormField
                        control={control}
                        name="interval"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">Interval</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                const _selected = interval.find(
                                  (v) => v.id.toString() === value
                                );
                                if (_selected) {
                                  setSelectedInterval(_selected.interval);
                                  setValue("interval", _selected.interval);
                                  setValue("intervalId", _selected.id);
                                }
                              }}
                              value={
                                interval
                                  .find((v) => v.interval === selectedInterval)
                                  ?.id.toString() || field.value
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Interval" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="p-2">
                                  <Input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerms.interval}
                                    onChange={(e) =>
                                      handleSearchChange(
                                        "interval",
                                        e.target.value
                                      )
                                    }
                                    className="w-full p-1 text-sm"
                                  />
                                </div>
                                {interval
                                  .filter((i) =>
                                    i.interval
                                      ?.toLowerCase()
                                      .includes(
                                        searchTerms.interval.toLowerCase()
                                      )
                                  )
                                  .map((i) => (
                                    <SelectItem
                                      key={i.id}
                                      value={i.id.toString()}
                                    >
                                      {i.interval}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Start Month */}
                      <FormField
                        control={control}
                        name="startMonth"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">
                              Start Month
                            </FormLabel>
                            <Select
                              value={String(field.value)}
                              onValueChange={(val) =>
                                field.onChange(Number(val))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Month" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "January",
                                  "February",
                                  "March",
                                  "April",
                                  "May",
                                  "June",
                                  "July",
                                  "August",
                                  "September",
                                  "October",
                                  "November",
                                  "December",
                                ].map((month, idx) => (
                                  <SelectItem
                                    key={month}
                                    value={(idx + 1).toString()}
                                  >
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Card>
                    <Card className="p-2">
                      {/* Item */}
                      <FormField
                        control={control}
                        name="item"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">Item</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                const _selectedItem = item.find(
                                  (v) => v.id.toString() === value
                                );
                                if (_selectedItem) {
                                  setSelectedItem(_selectedItem.itemName);
                                  setValue("item", _selectedItem.itemName);
                                  setValue("itemId", _selectedItem.id);
                                }
                              }}
                              value={
                                item
                                  .find((v) => v.itemName === selectedItem)
                                  ?.id.toString() || field.value
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Item" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="p-2">
                                  <Input
                                    type="text"
                                    placeholder="Search Item..."
                                    value={searchTerms.item}
                                    onChange={(e) =>
                                      handleSearchChange("item", e.target.value)
                                    }
                                    className="w-full p-1 text-sm"
                                  />
                                </div>
                                {item
                                  .filter((v) =>
                                    v.itemName
                                      ?.toLowerCase()
                                      .includes(searchTerms.item.toLowerCase())
                                  )
                                  .map((v) => (
                                    <SelectItem
                                      key={v.id}
                                      value={v.id.toString()}
                                    >
                                      {v.itemName}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Category Section */}
                      <FormField
                        control={control}
                        name="categorySection"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">
                              Category Section
                            </FormLabel>
                            <Input
                              readOnly
                              className="w-full text-sm bg-gray-100 border border-gray-300 rounded-md"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Role Category */}
                      <FormField
                        control={control}
                        name="roleCategory"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm">
                              Role Category
                            </FormLabel>
                            <Select
                              onValueChange={(value) => {
                                const _selected = roleCategory.find(
                                  (v) => v.id.toString() === value
                                );
                                if (_selected) {
                                  setSelectedRoleCategory(
                                    _selected.roleCategory
                                  );
                                  setValue(
                                    "roleCategory",
                                    _selected.roleCategory
                                  );
                                  setValue("roleCategoryId", _selected.id);
                                }
                              }}
                              value={
                                roleCategory
                                  .find(
                                    (v) =>
                                      v.roleCategory === selectedRoleCategory
                                  )
                                  ?.id.toString() || field.value
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Role Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="p-2">
                                  <Input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerms.roleCategory}
                                    onChange={(e) =>
                                      handleSearchChange(
                                        "roleCategory",
                                        e.target.value
                                      )
                                    }
                                    className="w-full p-1 text-sm"
                                  />
                                </div>
                                {roleCategory
                                  .filter((i) =>
                                    i.roleCategory
                                      ?.toLowerCase()
                                      .includes(
                                        searchTerms.roleCategory.toLowerCase()
                                      )
                                  )
                                  .map((i) => (
                                    <SelectItem
                                      key={i.id}
                                      value={i.id.toString()}
                                    >
                                      {i.roleCategory}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="md:col-span-2 flex justify-center mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-64 h-40 object-cover border rounded-md"
                          />
                        </div>
                      )}
                      {/* Upload File */}
                      <div className="md:col-span-2">
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm">
                            Upload Photo
                          </FormLabel>
                          <FormControl>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                          </FormControl>
                          <FormMessage>{errors.fileName?.message}</FormMessage>
                        </FormItem>
                      </div>
                    </Card>
                  </>
                )}

                {/* Buttons */}
                <div className="md:col-span-2 flex justify-end gap-2 mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    className="bg-green-800 hover:bg-green-600"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Saving..."
                      : mode === "DELETE"
                      ? "Delete"
                      : "Save"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DialogEditAssessmentCategory;
