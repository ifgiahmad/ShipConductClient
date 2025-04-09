"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createTrVesselAssessmentDto,
  createTrVesselAssessmentZod,
} from "@/lib/types/TrVesselAssessment.types";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  getTrVesselAssessmentById,
  getTrVesselAssessmentByNameAndPeriod,
  saveTrVesselAssessment,
} from "@/services/service_api_vesselAssessment";
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
import { TrVesselAssessmentDetail } from "@/lib/types/TrVesselAssessmentDetail.types";
import { getTrVesselAssessmentDetail } from "@/services/service_api_vesselAssessmentDetail";
import VesselAssessmentDetailForm from "./vesselAssessmentDetailForm";
import DataTableAssessmentDetail from "@/components/Data-Table/data-table-vesselAssessmentDetail";
import { UserRole } from "@/lib/type";
import { getUser } from "@/services/auth";
import { TrVesselAssessment } from "@/lib/types/TrVesselAssessment.types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface TrVesselAssessmentFormProps {
  onClose: () => void;
  onSave: () => void;
  id: number;
}

const DialogEditVesselAssessment = ({
  onClose,
  onSave,
  id,
}: TrVesselAssessmentFormProps) => {
  const [baseUrl, setBaseUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const methods = useForm<createTrVesselAssessmentDto>({
    resolver: zodResolver(createTrVesselAssessmentZod),
    defaultValues: {
      vslName: "",
      vslType: "",
      vslCode: "",
      vslMate: "",
      periodDate: new Date(),
      finalDate: new Date(),
      month: 0,
      year: 0,
      id: Number(id),
      createdBy: "",
      modifiedBy: "",
      description: "",
      linkShared: "",
      linkCode: "",
      status: "",
      scoreItemGeneral: 0,
      scoreItemTechnical: 0,
      scoreItemMarine: 0,
      downtimeGeneral: 0,
      downtimeTechnical: 0,
      downtimeMarine: 0,
      downtimeDaysGeneral: 100,
      downtimeDaysTechnical: 100,
      downtimeDaysMarine: 100,
      scoreGeneral: 0,
      scoreTechnical: 0,
      scoreMarine: 0,
      totalScore: 0,
      mode: "",
      role: "",
      closedDpaby: "",
      closedTsby: "",
      closedMsby: "",
    },
  });
  const [detail, setDetail] = useState<TrVesselAssessmentDetail[]>([]);
  const [dataVslMate, setDataVslMate] = useState<TrVesselAssessment>();
  const [status, setStatus] = useState<string | null>(null);
  const [idHeader, setIdHeader] = useState<number | null>(null);
  const [vslType, setVslType] = useState<string | null>(null);
  const [idList, setIdList] = useState<number[]>([]);
  const [user, setUser] = useState<UserRole>();
  const [allowInputGrade, setAllowInputGrade] = useState<boolean>(true);
  const [isClosed, setIsClosed] = useState<boolean>(false);

  const {
    setValue,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { toast } = useToast();

  const columnsDetail = [
    { header: "Item", accessorKey: "item" },
    { header: "Interval", accessorKey: "interval" },
    { header: "Category Section", accessorKey: "categorySection" },
    { header: "Ship Section", accessorKey: "shipSection" },
    { header: "Grade", accessorKey: "grade" },
    { header: "Grade Description", accessorKey: "gradeDescription" },
    {
      header: "Photo",
      cell: ({ row }: { row: { original: TrVesselAssessmentDetail } }) => {
        const smallFileLinks = [
          row.original.smallFileLink,
          row.original.smallFileLink2,
          row.original.smallFileLink3,
        ].filter(Boolean);

        const largeFileLinks = [
          row.original.normalFileLink,
          row.original.normalFileLink2,
          row.original.normalFileLink3,
        ].filter(Boolean);

        // State untuk mengontrol modal
        const [isOpen, setIsOpen] = useState(false);

        return (
          <div style={{ textAlign: "center" }} className="mr-5">
            {smallFileLinks.length > 0 ? (
              <>
                {/* Carousel tanpa membuka modal */}
                <Carousel className="w-[200px]">
                  <CarouselContent>
                    {smallFileLinks.map((src, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={src}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-[200px] h-auto rounded-md cursor-pointer"
                          onClick={() => setIsOpen(true)} // Modal terbuka hanya saat gambar diklik
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>

                {/* Modal terbuka hanya saat gambar diklik */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogContent className="max-w-2xl">
                    <DialogTitle className="sr-only">Photo Preview</DialogTitle>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {largeFileLinks.map((src, index) => (
                          <CarouselItem key={index}>
                            <img
                              src={src}
                              alt={`Large Photo ${index + 1}`}
                              className="w-full h-auto rounded-lg"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <p></p>
            )}
          </div>
        );
      },
    },
    /*  {
      header: "Photo",
      accessorKey: "smallFileLink",
      cell: ({ row }: { row: { original: TrVesselAssessmentDetail } }) => (
        <img
          src={row.original.smallFileLink}
          alt=""
          style={{ width: "100px", height: "auto" }}
        />
      ),
    }, */
    { header: "Photo Description", accessorKey: "photoDescription" },
  ];

  useEffect(() => {
    fetchData();
    fetchDetail();
    fetchUser();
    setBaseUrl(`${window.location.protocol}//${window.location.host}/`);
  }, [id, setValue, setStatus, setIdHeader, vslType, setVslType]);

  const fetchData = async () => {
    try {
      const data = await getTrVesselAssessmentById(Number(id));
      console.log(data);
      setIdHeader(data.id);
      setVslType(data.vslType || null);

      // Populate form with fetched data
      setValue("vslName", data.vslName ?? "");
      setValue("vslType", data.vslType ?? "");
      setValue("vslMate", data.vslMate ?? "");
      setValue("vslCode", data.vslCode ?? "");
      setValue("linkShared", data.linkShared ?? "");
      setValue("scoreItemGeneral", data.scoreItemGeneral ?? 0);
      setValue("scoreItemTechnical", data.scoreItemTechnical ?? 0);
      setValue("scoreItemMarine", data.scoreItemMarine ?? 0);

      setValue("scoreGeneral", data.scoreGeneral ?? 0);
      setValue("scoreTechnical", data.scoreTechnical ?? 0);
      setValue("scoreMarine", data.scoreMarine ?? 0);

      setValue("downtimeDaysGeneral", data.downtimeDaysGeneral ?? 100);
      setValue("downtimeDaysTechnical", data.downtimeDaysTechnical ?? 100);
      setValue("downtimeDaysMarine", data.downtimeDaysMarine ?? 100);

      setValue("downtimeGeneral", data.downtimeGeneral ?? 0);
      setValue("downtimeTechnical", data.downtimeTechnical ?? 0);
      setValue("downtimeMarine", data.downtimeMarine ?? 0);

      setValue("scoreItemGeneral", data.scoreItemGeneral ?? 0);
      setValue("scoreItemTechnical", data.scoreItemTechnical ?? 0);
      setValue("scoreItemMarine", data.scoreItemMarine ?? 0);
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
      setValue("closedDpaby", data.closedDpaby ?? "");
      setValue("closedTsby", data.closedTsby ?? "");
      setValue("closedMsby", data.closedMsby ?? "");
      setStatus(data.status ?? "");

      if (data.vslMate) {
        console.log("asd");
        const dataVslMate = await getTrVesselAssessmentByNameAndPeriod(
          data.vslMate || "",
          data.month || 0,
          data.year || 0
        );
        console.log(dataVslMate);
        setDataVslMate(dataVslMate);

        if (dataVslMate && data.vslType !== "TB") {
          if (user) {
            if (user?.roleCode === "DPA") {
              if (!dataVslMate.closedDpaby) {
                setAllowInputGrade(false);
              }
            } else if (user?.roleCode === "CRW-TS") {
              if (!dataVslMate.closedTsby) {
                setAllowInputGrade(false);
              }
            } else if (user?.roleCode === "CRW-MS") {
              if (!dataVslMate.closedMsby) {
                setAllowInputGrade(false);
              }
            }
          }
        }
      }

      if (user) {
        if (user?.roleCode === "DPA") {
          if (data.closedDpaby) {
            setIsClosed(true);
          }
        } else if (user?.roleCode === "CRW-TS") {
          if (data.closedTsby) {
            setIsClosed(true);
          }
        } else if (user?.roleCode === "CRW-MS") {
          if (data.closedMsby) {
            setIsClosed(true);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch assessment data", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load vessel assessment data.",
      });
    }
  };

  const fetchDetail = async () => {
    const dataDetail = await getTrVesselAssessmentDetail(Number(id));
    setDetail(dataDetail);

    const ids = dataDetail.map((detail: { id: number }) => detail.id);
    setIdList(ids);
  };

  const fetchUser = async () => {
    const result = await getUser();
    setUser(result);
  };

  const handleSaveDetail = () => {
    fetchData();
    fetchDetail();
  };

  const onSubmit = async (data: createTrVesselAssessmentDto) => {
    data.role = user?.roleCode || "";
    setLoading(true);
    if (status === "OPEN") {
      data.mode = "GENERATE LINK";
      data.linkShared = baseUrl + "crewUpload/";
    } else {
      data.mode = "CLOSED";
    }
    if (
      (data.mode === "CLOSED" &&
        typeof data.downtimeDaysGeneral === "number" &&
        data.downtimeDaysGeneral >= 0) ||
      data.mode !== "CLOSED"
    ) {
      try {
        const ret = await saveTrVesselAssessment(data);
        if (ret.status === 200) {
          onSave();
          toast({
            description: "Vessel Assessment updated successfully.",
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
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "downtime must be filled",
      });
    }
  };

  return (
    <>
      <div style={{ height: "80vh", overflowY: "auto" }}>
        {getValues("vslType") === "TB" &&
        getValues("vslMate") !== "" &&
        !isClosed ? (
          <Card className="mb-2">
            <p className="text-red-500 text-center">
              Untuk Kapal TugBoat yang memiliki kapal pasangan, penginputan
              nilai downtime akan berada di kapal pasangannya.
            </p>
          </Card>
        ) : (
          <></>
        )}
        {getValues("vslType") !== "TB" &&
        getValues("vslMate") !== null &&
        allowInputGrade === false &&
        !isClosed ? (
          <Card className="mb-2">
            <p className="text-red-500 text-center">
              Silahkan selesaikan penginputan nilai di kapal{" "}
              {dataVslMate?.vslName} terlebih dahulu
            </p>
          </Card>
        ) : (
          <></>
        )}
        <Card className="mb-2">
          <CardHeader>
            <CardTitle>Vessel Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-6 md:grid-cols-4"
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
                    name="vslMate"
                    control={control}
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>Vessel Mate</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Vessel Mate"
                            {...field}
                            readOnly
                            className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                          />
                        </FormControl>
                        <FormMessage>{errors.vslMate?.message}</FormMessage>
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
                {getValues("vslType") === "TB" &&
                getValues("vslMate") !== "" ? (
                  <></>
                ) : (
                  <>
                    {(user?.superUser || user?.roleCode === "DPA") &&
                    allowInputGrade &&
                    !isClosed ? (
                      <>
                        <Card className="p-2">
                          <FormField
                            name="scoreItemGeneral"
                            control={control}
                            render={({ field }) => (
                              <FormItem className="md:col-span-1">
                                <FormLabel>Score Item General</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Score Item General"
                                    {...field}
                                    readOnly
                                    className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                                  />
                                </FormControl>
                                <FormMessage>
                                  {errors.scoreItemGeneral?.message}
                                </FormMessage>
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="downtimeDaysGeneral"
                            control={control}
                            render={({ field }) => (
                              <FormItem className="md:col-span-1">
                                <FormLabel>Downtime Days General</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Downtime Days General"
                                    {...field}
                                    onKeyDown={(e) => {
                                      if (
                                        !(
                                          (e.key >= "0" && e.key <= "9") ||
                                          e.key === "." ||
                                          e.key === "-" ||
                                          e.key === "Backspace" ||
                                          e.key === "Delete" ||
                                          e.key === "ArrowLeft" ||
                                          e.key === "ArrowRight"
                                        )
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={{
                                      MozAppearance: "textfield",
                                      WebkitAppearance: "none",
                                    }}
                                  />
                                </FormControl>
                                <FormMessage>
                                  {errors.downtimeDaysGeneral?.message}
                                </FormMessage>
                              </FormItem>
                            )}
                          />
                        </Card>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}

                <div className="md:col-span-4 flex justify-end items-center mt-4 gap-2">
                  <Button
                    type="button"
                    onClick={onClose}
                    className="inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-white hover:bg-gray-200 text-gray-700"
                  >
                    Close
                  </Button>

                  {(status === "CLOSED" ||
                    status === "UPLOADING PHOTO" ||
                    status === "PROCESS CLOSED" ||
                    status === "READY" ||
                    status === "PHOTO COMPLETED") &&
                  allowInputGrade &&
                  !isClosed ? (
                    <Button
                      type="submit"
                      className="w-full md:w-auto bg-orange-700 hover:bg-orange-500"
                      disabled={loading}
                    >
                      {loading ? "Closing..." : "Closed"}
                    </Button>
                  ) : status === "OPEN" ? (
                    <Button
                      type="submit"
                      className="w-full md:w-auto bg-orange-700 hover:bg-orange-500"
                      disabled={loading}
                    >
                      {loading ? "Generate Link..." : "Generate Link"}
                    </Button>
                  ) : null}
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vessel Assessment Detail</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTableAssessmentDetail
              data={detail}
              columns={columnsDetail}
              modalContent={
                <VesselAssessmentDetailForm
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
              allowInputGrade={allowInputGrade}
              isClosed={isClosed}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DialogEditVesselAssessment;
