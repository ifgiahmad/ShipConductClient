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
  const [shipSection, setShipSection] = useState<MsShipSection[]>([]);
  const [selectedShipSection, setSelectedShipSection] = useState<
    string | undefined
  >();
  const [interval, setInterval] = useState<MsInterval[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<
    string | undefined
  >();
  const [searchTerms, setSearchTerms] = useState({
    vessel: "",
    ship: "",
    interval: "",
  });

  const methods = useForm<saveMsAssessmentCategoryDto>({
    resolver: zodResolver(saveMsAssessmentCategoryZod),
    defaultValues: {
      id: Number(id),
      vslType: "",
      item: "",
      interval: "",
      shipSection: "",
      categorySection: "",
      mode: "",
      deleted: false,
    },
  });

  const { setValue, control, handleSubmit } = methods;

  useEffect(() => {
    const fetchData = async () => {
      if (id > 0) {
        try {
          const data = await getMsAssessmentCategoryById(id);

          setValue("item", data.item ?? "");
          setValue("categorySection", data.categorySection ?? "");

          if (data.vslType) {
            setSelectedVesselType(data.vslType);
            setValue("vslType", data.vslType);
            await fetchShipSection(data.vslType);
          }

          if (data.shipSection) {
            setValue("shipSection", data.shipSection);
            setSelectedShipSection(data.shipSection);
          }

          if (data.interval) {
            setValue("interval", data.interval);
            setSelectedInterval(data.interval);
          }
        } catch (error) {
          console.error("Error fetching assessment category data:", error);
        }
      } else {
        setValue("mode", "CREATE");
      }
    };

    fetchData();
    fetchVessel();
  }, [
    id,
    setValue,
    setSelectedInterval,
    setSelectedShipSection,
    setSelectedVesselType,
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
      console.log("a");
    } else {
      setSelectedShipSection("");
      setValue("categorySection", "");
    }
  };

  const onSubmit: SubmitHandler<DataModel> = async (data) => {
    console.log(data);
    data.mode = mode;
    try {
      const response = await saveMsAssessmentCategory(data);
      if (response.status === 200) {
        onSave();
        toast({ description: "Assessment Category updated successfully." });
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
            <Terminal className="h-4 w-4" />
            <AlertTitle>Delete Data!</AlertTitle>
            <AlertDescription>
              Are you sure you want to delete this data?
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <FormField
              control={control}
              name="vslType"
              render={({ field }) => (
                <FormItem>
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
            <FormField
              control={control}
              name="item"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item</FormLabel>
                  <Textarea placeholder="Enter item" {...field} />
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
                        .filter((i) =>
                          i.interval
                            ?.toLowerCase()
                            .includes(searchTerms.interval.toLowerCase())
                        )
                        .map((i) => (
                          <SelectItem key={i.id} value={i.interval}>
                            {i.interval}
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
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
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

export default AssessmentCategoryForm;
