"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTrVesselAssessmentZod,
  createTrVesselAssessmentDto,
} from "@/lib/types/TrVesselAssessment.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { getMsVessel } from "@/services/service_api_master";
import { MsVessel } from "@/lib/types/Master.types";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { saveTrVesselAssessment } from "@/services/service_api_vesselAssessment";
import { Toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMsAssessmentCategoryByVslType } from "@/services/service_api";
import { MsAssessmentCategory } from "@/lib/types/MsAssessmentCategory.types";
import { MsInterval } from "@/lib/types/MsInterval.types";
import { getMsInterval } from "@/services/service_api_interval";

const AddVesselAssessmentForm: React.FC = () => {
  const [vesselName, setVesselName] = useState<MsVessel[]>([]);
  const [assessmentCategory, setAssessmentCategory] = useState<
    MsAssessmentCategory[]
  >([]);
  const [selectedVesselName, setSelectedVesselName] = useState<string>("");
  const [searchVesselName, setSearchVesselName] = useState<string>("");
  const [isOpenCalender, setIsOpenCalender] = useState(false);
  const [isOpenCalenderFinal, setIsOpenCalenderFinal] = useState(false);
  const [interval, setInterval] = useState<MsInterval[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<
    string | undefined
  >();
  const [searchTerms, setSearchTerms] = useState({
    interval: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (type: string, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [type]: value }));
  };

  const methods = useForm<createTrVesselAssessmentDto>({
    resolver: zodResolver(createTrVesselAssessmentZod),
    defaultValues: {
      vslName: "",
      vslType: "",
      periodDate: new Date(),
      finalDate: new Date(),
      id: 0,
      createdBy: "",
      modifiedBy: "",
      description: "",
      linkShared: "",
      status: "",
      gradeTotal: 0,
      mode: "",
      interval: "",
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  const { toast } = useToast();
  const router = useRouter();
  const periodDateValue = watch("periodDate");

  useEffect(() => {
    const fetchVessel = async () => {
      try {
        const data = await getMsVessel();
        setVesselName(data);
      } catch (error) {
        console.error("Failed to fetch vessel types:", error);
      }
    };
    const finalDateValue = getValues("finalDate");
    if (
      finalDateValue &&
      periodDateValue &&
      new Date(finalDateValue) <= new Date(periodDateValue)
    ) {
      setValue("finalDate", new Date()); // Reset finalDate if it's invalid
    }
    const fetchInterval = async () => {
      try {
        const interval = await getMsInterval();
        console.log(interval);
        setInterval(interval);
      } catch (error) {
        console.error("Error fetching interval:", error);
      }
    };
    fetchVessel();
    fetchInterval();
  }, [periodDateValue, setValue, getValues]);

  const onSubmit = async (data: createTrVesselAssessmentDto) => {
    setLoading(true);
    console.log(data);
    data.mode = "CREATE";
    data.vslName = selectedVesselName ?? "";
    try {
      const dataAssessmentCategory = await getMsAssessmentCategoryByVslType(
        data.vslType
      );
      console.log(dataAssessmentCategory);
      setAssessmentCategory(dataAssessmentCategory);
      if (dataAssessmentCategory.length > 0) {
        const ret = await saveTrVesselAssessment(data);
        if (ret.status === 200) {
          const newId = ret.data.returnId;
          console.log(newId);
          router.push(`editById/${newId}`);
          toast({
            description: "Vessel Assessment was updated successfully.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Failed to generate data",
            description: "Failed to save data",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Category Assesment for vessel Type " + data.vslType + " not found",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Error saving data: " +
          (err instanceof Error ? err.message : "Unknown error"),
      });
      console.error("Error saving data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter vessels based on search input
  const filteredVesselName = vesselName.filter((vessel) =>
    vessel.vslName.toLowerCase().includes(searchVesselName.toLowerCase())
  );

  const handleVesselSelect = (value: string) => {
    const selectedVessel = vesselName.find(
      (vessel) => vessel.vslCode === value
    );
    if (selectedVessel) {
      console.log(selectedVessel);
      setSelectedVesselName(selectedVessel.vslName); // Pastikan ini benar
      setValue("vslCode", selectedVessel.vslCode);
      setValue("vslType", selectedVessel.vslType);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vessel Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            <Card className="p-2">
              <FormField
                control={control}
                name="vslName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vessel Name</FormLabel>
                    <Select
                      onValueChange={handleVesselSelect}
                      value={selectedVesselName} // Controlled value
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {selectedVesselName || "Select Vessel Name"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <Input
                            type="text"
                            placeholder="Search Vessel Name..."
                            value={searchVesselName}
                            onChange={(e) =>
                              setSearchVesselName(e.target.value)
                            }
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        {filteredVesselName.map((vessel) => (
                          <SelectItem
                            key={vessel.vslCode}
                            value={vessel.vslCode}
                          >
                            {vessel.vslName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="vslType"
                control={control}
                render={({ field }) => (
                  <FormItem className="md:col-span-1">
                    <FormLabel>Vessel Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Vessel Type"
                        {...field}
                        readOnly
                        className="w-full p-2 border border-gray-300 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage>{errors.vslType?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                name="vslCode"
                control={control}
                render={({ field }) => (
                  <FormItem className="md:col-span-1">
                    <FormLabel>Vessel Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Vessel Code"
                        {...field}
                        readOnly
                        className="w-full p-2 border border-gray-300 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage>{errors.vslCode?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </Card>
            <Card className="p-2">
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
                            className="w-full p-2 border rounded-md mb-2"
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
                name="periodDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-2">
                    <FormLabel>Period Date</FormLabel>
                    <Popover
                      open={isOpenCalender}
                      onOpenChange={setIsOpenCalender}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            onClick={() => setIsOpenCalender(true)}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal mt-2",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            field.onChange(date ? date : "");
                            setIsOpenCalender(false); // Close the popover on date selection
                          }}
                          /* disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          } */
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage>{errors.periodDate?.message}</FormMessage>
                  </FormItem>
                )}
              />
              {/* Final Date Field */}
              <FormField
                control={control}
                name="finalDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-2">
                    <FormLabel>Final Date</FormLabel>
                    <Popover
                      open={isOpenCalenderFinal}
                      onOpenChange={setIsOpenCalenderFinal}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            onClick={() => setIsOpenCalenderFinal(true)}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            field.onChange(date ? date : ""); // Set the selected date
                            setIsOpenCalenderFinal(false); // Close the calendar popover
                          }}
                          disabled={(date) => {
                            // Disable dates before 1900-01-01 or before periodDateValue
                            return (
                              date < new Date("1900-01-01") ||
                              (periodDateValue &&
                                date <= new Date(periodDateValue))
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage>{errors.finalDate?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </Card>
            <Card className="p-2">
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        {...field}
                        className="resize-none h-24"
                      />
                    </FormControl>
                    <FormMessage>{errors.description?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </Card>
            <div className="md:col-span-3 flex justify-end mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full md:w-auto mr-2"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="w-full md:w-auto bg-green-800 hover:bg-green-400"
                disabled={loading}
              >
                {loading ? "Generate Detail..." : "Generate Detail"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default AddVesselAssessmentForm;
