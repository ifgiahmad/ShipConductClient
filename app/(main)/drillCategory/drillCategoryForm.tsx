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
  getMsDrillCategoryById,
  saveMsDrillCategory,
} from "@/services/service_api_drillCategory";
import { useToast } from "@/hooks/use-toast";
import {
  saveMsDrillCategoryDto,
  saveMsDrillCategoryZod,
} from "@/lib/types/MsDrillCategory.types";
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

type DataModel = z.infer<typeof saveMsDrillCategoryZod>;

interface DrillCategoryFormProps {
  onClose: () => void;
  onSave: () => void;
  id: number;
  mode: string;
}

const DrillCategoryForm = ({
  onClose,
  onSave,
  id,
  mode,
}: DrillCategoryFormProps) => {
  const { toast } = useToast();
  const [vesselType, setVesselType] = useState<MsVesselType[]>([]);
  const [selectedVesselType, setSelectedVesselType] = useState<
    string | undefined
  >();
  const [selectedItem, setSelectedItem] = useState<string | undefined>();

  const [interval, setInterval] = useState<MsInterval[]>([]);
  const [item, setItem] = useState<MsItem[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<
    string | undefined
  >();
  const [selectedStartMonth, setSelectedStartMonth] = useState<number>();
  const [searchTerms, setSearchTerms] = useState({
    vessel: "",
    ship: "",
    interval: "",
    item: "",
  });

  const methods = useForm<saveMsDrillCategoryDto>({
    resolver: zodResolver(saveMsDrillCategoryZod),
    defaultValues: {
      id: Number(id),
      vslType: "",
      itemDrill: "",
      itemId: 0,
      intervalId: 0,
      interval: "",
      startMonth: 0,
      startMonthString: "",
      /*  shipSection: "", */
      mode: "",
      deleted: false,
    },
  });

  const { setValue, control, handleSubmit } = methods;

  useEffect(() => {
    const fetchData = async () => {
      if (id > 0) {
        try {
          const data = await getMsDrillCategoryById(id);

          setValue("itemDrill", data.itemDrill ?? "");
          setValue("itemId", data.itemId ?? 0);
          setValue("intervalId", data.intervalId ?? 0);
          setValue("startMonth", data.startMonth ?? 0);
          setValue("startMonthString", data.startMonthString ?? "");
          if (data.vslType) {
            setSelectedVesselType(data.vslType);
            setValue("vslType", data.vslType);
          }
          if (data.interval) {
            setValue("interval", data.interval);
            setSelectedInterval(data.interval);
          }
          if (data.itemDrill) {
            setValue("itemDrill", data.itemDrill);
            setSelectedItem(data.itemDrill);
          }
          if (data.startMonth) {
            setValue("startMonth", data.startMonth);
            setSelectedStartMonth(data.startMonth);
          }
        } catch (error) {
          console.error("Error fetching Drill category data:", error);
        }
      } else {
        setValue("mode", "CREATE");
      }
    };

    fetchData();
    fetchVessel();
  }, [id, setValue, setSelectedInterval, setSelectedVesselType]);

  const fetchVessel = async () => {
    try {
      const vesselData = await getMsVesselType();
      setVesselType(vesselData);
      const intervalData = await getMsInterval();
      setInterval(intervalData);
      const itemData: MsItem[] = await getMsItem();
      const filteredItems = itemData.filter(
        (item) => item.type === "Drill" || item.type === "ReportSafety"
      );
      setItem(filteredItems);
    } catch (error) {
      console.error("Error fetching vessel and interval data:", error);
    }
  };

  const fetchShipSection = async (vslType: string) => {
    if (!vslType) {
      console.warn("No vessel type provided for fetching ship sections.");
      return;
    }
  };

  const handleSearchChange = (type: string, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [type]: value }));
  };

  const onSubmit: SubmitHandler<DataModel> = async (data) => {
    data.mode = mode;
    try {
      const response = await saveMsDrillCategory(data);
      if (response.status === 200) {
        onSave();
        toast({ description: "Drill Category updated successfully." });
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
              name="itemDrill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const _selectedItem = item.find(
                        (v) => v.id.toString() === value
                      );
                      if (_selectedItem) {
                        setSelectedItem(_selectedItem.itemName);
                        setValue("itemDrill", _selectedItem.itemName);
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
            {/* <FormField
              control={control}
              name="itemDrill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item</FormLabel>
                  <Textarea placeholder="Enter item" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            {/* <FormField
              control={control}
              name="shipSection"
              render={({ field }) => (
                <FormItem>
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
            /> */}
            <FormField
              control={control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interval</FormLabel>
                  {/* <Select
                    onValueChange={(value) => {
                      setSelectedInterval(value);
                      setValue("intervalId", value ? parseInt(value, 10) : 0);
                    }}
                    value={selectedInterval || field.value}
                  > */}
                  <Select
                    onValueChange={(value) => {
                      if (value) {
                        const _selectedInterval = interval.find(
                          (v) => v.id.toString() === value
                        );
                        if (_selectedInterval) {
                          setSelectedInterval(_selectedInterval.interval); // Simpan nama item ke state
                          setValue("interval", _selectedInterval.interval); // Simpan nama item ke itemDrill
                          setValue("intervalId", _selectedInterval.id); // Simpan ID item ke itemId
                        }
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
            <FormField
              control={control}
              name="startMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Month</FormLabel>
                  <Select
                    value={String(field.value)} // Konversi angka ke string
                    onValueChange={(val) => field.onChange(Number(val))} // Konversi string ke angka
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="January" value="1">
                        January
                      </SelectItem>
                      <SelectItem key="February" value="2">
                        February
                      </SelectItem>
                      <SelectItem key="March" value="3">
                        March
                      </SelectItem>
                      <SelectItem key="April" value="4">
                        April
                      </SelectItem>
                      <SelectItem key="May" value="5">
                        May
                      </SelectItem>
                      <SelectItem key="June" value="6">
                        June
                      </SelectItem>
                      <SelectItem key="July" value="7">
                        July
                      </SelectItem>
                      <SelectItem key="August" value="8">
                        August
                      </SelectItem>
                      <SelectItem key="September" value="9">
                        September
                      </SelectItem>
                      <SelectItem key="October" value="10">
                        October
                      </SelectItem>
                      <SelectItem key="November" value="11">
                        November
                      </SelectItem>
                      <SelectItem key="December" value="12">
                        December
                      </SelectItem>
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
            className={
              mode !== "DELETE"
                ? "bg-green-900 hover:bg-green-600"
                : "bg-red-800 hover:bg-red-600"
            }
          >
            {mode === "DELETE" ? "Delete" : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
};

export default DrillCategoryForm;
