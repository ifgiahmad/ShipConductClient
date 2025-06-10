"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createTrVesselDrillDto,
  createTrVesselDrillZod,
} from "@/lib/types/TrVesselDrill.types";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { TrVesselDrillDetail } from "@/lib/types/TrVesselDrillDetail.types";
import VesselDrillDetailForm from "./vesselDrillDetailForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  getTrVesselDrillById,
  saveTrVesselDrill,
} from "../../../services/service_api_vesselDrill";
import { getTrVesselDrillDetail } from "@/services/service_api_vesselDrillDetail";
import DataTableDrillDetail from "@/components/Data-Table/data-table-vesselDrillDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrVesselDrillFormProps {
  onClose: () => void;
  onSave: () => void;
  id: number;
}

const DialogViewVesselDrill = ({
  onClose,
  onSave,
  id,
}: TrVesselDrillFormProps) => {
  const [baseUrl, setBaseUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const methods = useForm<createTrVesselDrillDto>({
    resolver: zodResolver(createTrVesselDrillZod),
    defaultValues: {
      vslName: "",
      vslType: "",
      periodDate: new Date(),
      finalDate: new Date(),
      id: Number(id),
      createdBy: "",
      modifiedBy: "",
      description: "",
      linkShared: "",
      linkCode: "",
      status: "",
      grade: "",
      mode: "",
      vslCode: "",
    },
  });
  const [drillDetail, setDrillDetail] = useState<TrVesselDrillDetail[]>([]);
  const [reportDetail, setReportDetail] = useState<TrVesselDrillDetail[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [idHeader, setIdHeader] = useState<number | null>(null);
  const [vslType, setVslType] = useState<string | null>(null);
  const [idList, setIdList] = useState<number[]>([]);

  const {
    setValue,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { toast } = useToast();

  /*   const columnsDetail = [
    { header: "ItemName", accessorKey: "itemName" },
    { header: "Interval", accessorKey: "interval" },
    { header: "Grade", accessorKey: "grade" },
    { header: "Grade Description", accessorKey: "gradeDescription" },
    {
      header: "Video",
      accessorKey: "normalFileLink",
      cell: ({ row }: { row: { original: TrVesselDrillDetail } }) =>
        row.original.normalFileLink ? (
          <video
            src={row.original.normalFileLink}
            controls
            poster={row.original.normalFileLink}
            style={{ width: "120px", height: "auto" }}
          />
        ) : (
          <></>
        ),
    },
    { header: "Video Description", accessorKey: "videoDescription" },
  ]; */

  const columnsDetail = [
    { header: "ItemName", accessorKey: "itemName" },
    { header: "Interval", accessorKey: "interval" },
    { header: "Grade", accessorKey: "grade" },
    { header: "Grade Description", accessorKey: "gradeDescription" },
    {
      header: "File",
      accessorKey: "normalFileLink",
      cell: ({ row }: { row: { original: TrVesselDrillDetail } }) =>
        row.original.itemType === "Drill" && row.original.normalFileLink ? (
          <>
            <span
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              Video Uploaded
            </span>
          </>
        ) : row.original.itemType === "ReportSafety" && row.original.docLink ? (
          <>
            <span
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              Document Uploaded
            </span>
          </>
        ) : (
          <></>
        ),
    },
    { header: "File Description", accessorKey: "videoDescription" },
  ];
  useEffect(() => {
    fetchData();
    fetchDetail();
    setBaseUrl(`${window.location.protocol}//${window.location.host}/`);
  }, [id, setValue, setStatus, setIdHeader, vslType, setVslType]);

  const fetchData = async () => {
    try {
      const data = await getTrVesselDrillById(Number(id));
      setIdHeader(data.id);
      console.log("Fetched vslType:", data.vslType);
      setVslType(data.vslType || null);

      // Populate form with fetched data
      setValue("vslName", data.vslName ?? "");
      setValue("vslType", data.vslType ?? "");
      setValue("vslCode", data.vslCode ?? "");
      /* setValue("interval", data.interval ?? ""); */
      setValue("linkShared", data.linkShared ?? "");
      setValue("grade", data.grade ?? "");
      setValue(
        "periodDate",
        data.periodDate ? new Date(data.periodDate) : new Date()
      );
      setValue(
        "finalDate",
        data.finalDate ? new Date(data.finalDate) : new Date()
      );
      setValue("description", data.description);
      setValue("status", data.status);
      setStatus(data.status ?? "");
    } catch (error) {
      console.error("Failed to fetch Drill data", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load vessel Drill data.",
      });
    }
  };

  const fetchDetail = async () => {
    const dataDetail = await getTrVesselDrillDetail(Number(id));
    const drillDetail = dataDetail.filter((item) => item.itemType === "Drill");
    const reportDetail = dataDetail.filter(
      (item) => item.itemType === "ReportSafety"
    );
    setDrillDetail(drillDetail);
    setReportDetail(reportDetail);

    const ids = dataDetail.map((detail: { id: number }) => detail.id);
    setIdList(ids);
  };

  const handleSaveDetail = () => {
    fetchData();
    fetchDetail();
  };

  const onSubmit = async (data: createTrVesselDrillDto) => {
    setLoading(true);
    if (status === "OPEN") {
      data.mode = "GENERATE LINK";
      data.linkShared = baseUrl + "vesselDrillUpload/";
    } else {
      data.mode = "CLOSED";
    }
    try {
      const ret = await saveTrVesselDrill(data);
      if (ret.status === 200) {
        onSave();
        toast({
          description: "Vessel Drill updated successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update data",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Error updating data: " +
          (err instanceof Error ? err.message : "Unknown error"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ height: "80vh", overflowY: "auto" }}>
        <Card className="mb-2">
          <CardHeader>
            <CardTitle>Vessel Drill</CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-6 md:grid-cols-3"
              >
                <Card className="p-2">
                  <FormField
                    name="vslName"
                    control={control}
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>Vessel Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Vessel Name"
                            {...field}
                            readOnly
                            className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                          />
                        </FormControl>
                        <FormMessage>{errors.vslType?.message}</FormMessage>
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
                            className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
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
                            className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
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
                    name="periodDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Period Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                  "bg-gray-300 cursor-not-allowed"
                                )}
                                disabled
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
                              onSelect={(date) =>
                                field.onChange(date ? date : "")
                              }
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage>{errors.periodDate?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="finalDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Final Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                  "bg-gray-300 cursor-not-allowed"
                                )}
                                disabled
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
                              onSelect={(date) =>
                                field.onChange(date ? date : "")
                              }
                              disabled={(date) => {
                                const periodDateValue = getValues("periodDate");
                                return (
                                  date > new Date() ||
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
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            readOnly
                            placeholder="Description"
                            {...field}
                            className="w-full border border-gray-300 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage>{errors.description?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="linkShared"
                    control={control}
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>Link Share</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Link Share"
                            {...field}
                            readOnly
                            className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                          />
                        </FormControl>
                        <FormMessage>{errors.linkShared?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </Card>

                <div className="md:col-span-3 flex justify-end mt-4">
                  <Button
                    type="button"
                    onClick={onClose}
                    className="inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-white hover:bg-gray-200 text-gray-700"
                  >
                    Back
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vessel Report Safety Detail</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="drill">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="drill">Drill</TabsTrigger>
                <TabsTrigger value="reportSafety">Report Safety</TabsTrigger>
              </TabsList>
              <TabsContent value="drill">
                <>
                  <DataTableDrillDetail
                    data={drillDetail}
                    columns={columnsDetail}
                    modalContent={
                      <VesselDrillDetailForm
                        onClose={function (): void {
                          throw new Error("Function not implemented.");
                        }}
                        onSave={function (): void {
                          throw new Error("Function not implemented.");
                        }}
                        id={0}
                        idHeader={Number(idHeader)}
                        vslType={String(vslType)}
                        mode={""}
                        idList={idList}
                      />
                    }
                    idHeader={Number(idHeader)}
                    vslType={String(vslType)}
                    onSaveData={() => handleSaveDetail()}
                    status={status ?? ""}
                    mode={""}
                  />
                </>
              </TabsContent>
              <TabsContent value="reportSafety">
                <>
                  <DataTableDrillDetail
                    data={reportDetail}
                    columns={columnsDetail}
                    modalContent={
                      <VesselDrillDetailForm
                        onClose={function (): void {
                          throw new Error("Function not implemented.");
                        }}
                        onSave={function (): void {
                          throw new Error("Function not implemented.");
                        }}
                        id={0}
                        idHeader={Number(idHeader)}
                        vslType={String(vslType)}
                        mode={""}
                        idList={idList}
                      />
                    }
                    idHeader={Number(idHeader)}
                    vslType={String(vslType)}
                    onSaveData={() => handleSaveDetail()}
                    status={status ?? ""}
                    mode={""}
                  />
                </>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DialogViewVesselDrill;
