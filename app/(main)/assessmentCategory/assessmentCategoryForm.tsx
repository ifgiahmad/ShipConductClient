import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getMsAssessmentCategoryById,
  saveMsAssessmentCategory,
  uploadPhoto,
} from "@/services/service_api";
import { useToast } from "@/hooks/use-toast";
import {
  saveMsAssessmentCategoryDto,
  saveMsAssessmentCategoryZod,
} from "@/lib/types/MsAssessmentCategory.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Terminal } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MsVesselType } from "@/lib/types/Master.types";
import { getMsVesselType } from "@/services/service_api_master";
import {
  getMsShipSection,
  getMsShipSectionByVslType,
} from "@/services/service_api_shipSection";
import { MsShipSection } from "@/lib/types/MsShipSection.types";
import { MsInterval } from "@/lib/types/MsInterval.types";
import { getMsInterval } from "@/services/service_api_interval";
import { MsItem } from "@/lib/types/MsItem.types";
import { getMsItem } from "@/services/service_api_item";
import { getMsRoleCategory } from "@/services/service_api_roleCategory";
import { MsRoleCategory } from "@/lib/types/MsRoleCategory.types";

type DataModel = z.infer<typeof saveMsAssessmentCategoryZod>;

interface AssessmentCategoryFormProps {
  onClose: () => void;
  onSave: () => void;
  id: number;
  mode: string;
}

const AssessmentCategoryForm = ({
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
    const fetchData = async () => {
      if (id > 0) {
        try {
          const data = await getMsAssessmentCategoryById(id);
          console.log(data);
          console.log(mode);

          setValue("categorySection", data.categorySection);

          if (data.vslType) {
            setSelectedVesselType(data.vslType);
            setValue("vslType", data.vslType);
            await fetchShipSection(data.vslType);
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
          console.error("Error fetching assessment category data:", error);
        }
      } else {
        setValue("mode", "CREATE");
      }
    };

    fetchData();
    fetchVessel();
    fetchItem();
    fetchRoleCategory();
  }, [
    id,
    setValue,
    setSelectedInterval,
    setSelectedShipSection,
    setSelectedVesselType,
    setSelectedItem,
    setSelectedRoleCategory,
  ]);

  const fetchVessel = async () => {
    try {
      const vesselData = await getMsVesselType();
      setVesselType(vesselData);
      const intervalData = await getMsInterval();
      setInterval(intervalData);
    } catch (error) {
      console.error("Error fetching vessel and interval data:", error);
    }
  };

  const fetchItem = async () => {
    try {
      const itemData = await getMsItem();
      setItem(itemData);
    } catch (error) {
      console.error("Error fetching Item data:", error);
    }
  };

  const fetchRoleCategory = async () => {
    try {
      const roleData = await getMsRoleCategory();
      setRoleCategory(roleData);
    } catch (error) {
      console.error("Error fetching Role Category data:", error);
    }
  };

  const fetchShipSection = async (vslType: string) => {
    if (!vslType) {
      console.warn("No vessel type provided for fetching ship sections.");
      return;
    }

    try {
      const data = await getMsShipSectionByVslType(vslType);
      setShipSection(data);
    } catch (error) {
      console.error(
        "Error fetching ship section for vessel type:",
        vslType,
        error
      );
    }
  };

  const handleSearchChange = (type: string, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [type]: value }));
  };

  const handleShipSectionSelect = (value: string) => {
    const selectedShipSection = shipSection.find(
      (shipSection) => shipSection.sectionName === value
    );
    if (selectedShipSection) {
      setSelectedShipSection(selectedShipSection.sectionName); // Pastikan ini benar
      setValue("categorySection", selectedShipSection.categorySection || "");
      setValue("shipSectionId", selectedShipSection.id || 0);
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
    console.log(data);
    data.mode = mode;
    try {
      const response = await saveMsAssessmentCategory(data);
      console.log(response);
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
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4"
      >
        {mode === "Delete" ? (
          <div className="md:col-span-2">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Delete Data!</AlertTitle>
              <AlertDescription>
                Are you sure you want to delete this data?
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <>
            {/* Vessel Type */}
            <FormField
              control={control}
              name="vslType"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Vessel Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setSelectedVesselType(value);
                      setValue("vslType", value);
                      fetchShipSection(value);
                    }}
                    value={selectedVesselType || field.value}
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
                            handleSearchChange("vessel", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      {vesselType
                        .filter((v) =>
                          v.keterangan
                            ?.toLowerCase()
                            .includes(searchTerms.vessel.toLowerCase())
                        )
                        .map((v) => (
                          <SelectItem key={v.vslType} value={v.vslType}>
                            {v.keterangan}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Item */}
            <FormField
              control={control}
              name="item"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Item</FormLabel>
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
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      {item
                        .filter((v) =>
                          v.itemName
                            ?.toLowerCase()
                            .includes(searchTerms.item.toLowerCase())
                        )
                        .map((v) => (
                          <SelectItem key={v.id} value={v.id.toString()}>
                            {v.itemName}
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
                      field.onChange(value);
                      handleShipSectionSelect(value);
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

            {/* Category Section */}
            <FormField
              control={control}
              name="categorySection"
              render={({ field }) => (
                <FormItem className="space-y-1">
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

            {/* Interval */}
            <FormField
              control={control}
              name="interval"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Interval</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const _selectedInterval = interval.find(
                        (v) => v.id.toString() === value
                      );
                      if (_selectedInterval) {
                        setSelectedInterval(_selectedInterval.interval);
                        setValue("interval", _selectedInterval.interval);
                        setValue("intervalId", _selectedInterval.id);
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
                          placeholder="Search Interval..."
                          value={searchTerms.interval}
                          onChange={(e) =>
                            handleSearchChange("interval", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      {interval
                        .filter((i) =>
                          i.interval
                            ?.toLowerCase()
                            .includes(searchTerms.interval.toLowerCase())
                        )
                        .map((i) => (
                          <SelectItem key={i.id} value={i.id.toString()}>
                            {i.interval}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
                  <FormLabel>Role Category</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const _selected = roleCategory.find(
                        (v) => v.id.toString() === value
                      );
                      if (_selected) {
                        setSelectedRoleCategory(_selected.roleCategory);
                        setValue("roleCategory", _selected.roleCategory);
                        setValue("roleCategoryId", _selected.id);
                      }
                    }}
                    value={
                      roleCategory
                        .find((v) => v.roleCategory === selectedRoleCategory)
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
                          placeholder="Search Role Category..."
                          value={searchTerms.roleCategory}
                          onChange={(e) =>
                            handleSearchChange("roleCategory", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      {roleCategory
                        .filter((i) =>
                          i.roleCategory
                            ?.toLowerCase()
                            .includes(searchTerms.roleCategory.toLowerCase())
                        )
                        .map((i) => (
                          <SelectItem key={i.id} value={i.id.toString()}>
                            {i.roleCategory}
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
                  <FormLabel>Start Month</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(val) => field.onChange(Number(val))}
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
                        <SelectItem key={month} value={(idx + 1).toString()}>
                          {month}
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
              <div className="md:col-span-2">
                <img
                  src={imagePreview}
                  alt="Photo Preview"
                  className="w-80 h-60 rounded-md border border-gray-300"
                />
              </div>
            )}

            {/* Upload File */}
            <div className="md:col-span-2">
              <FormItem className="space-y-1">
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
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            type="submit"
            variant="default"
            className="bg-green-900 hover:bg-green-600"
          >
            {mode === "Delete" ? "Delete" : "Save"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AssessmentCategoryForm;
