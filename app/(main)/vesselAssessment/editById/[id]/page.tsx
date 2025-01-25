"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createTrVesselAssessmentDto,
  createTrVesselAssessmentZod,
} from "../../../../../lib/types/TrVesselAssessment.types";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  getTrVesselAssessmentById,
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
import DataTable from "@/components/Data-Table/data-table";
import VesselAssessmentDetailForm from "../../vesselAssessmentDetailForm";
import DataTableAssessmentDetail from "@/components/Data-Table/data-table-vesselAssessmentDetail";
import { UserRole } from "@/lib/type";
import { getUser } from "@/services/auth";

const EditVesselAssessmentForm = () => {
  const router = useRouter();
  const { id } = useParams();
  const [baseUrl, setBaseUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const methods = useForm<createTrVesselAssessmentDto>({
    resolver: zodResolver(createTrVesselAssessmentZod),
    defaultValues: {
      // Initialize default values (similar to Add form)
      vslName: "",
      vslType: "",
      vslCode: "",
      periodDate: new Date(),
      finalDate: new Date(),
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
    },
  });
  const [detail, setDetail] = useState<TrVesselAssessmentDetail[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [idHeader, setIdHeader] = useState<number | null>(null);
  const [vslType, setVslType] = useState<string | null>(null);
  const [idList, setIdList] = useState<number[]>([]);
  const [user, setUser] = useState<UserRole>();

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
      accessorKey: "smallFileLink",
      cell: ({ row }: { row: { original: TrVesselAssessmentDetail } }) => (
        <img
          src={row.original.smallFileLink}
          alt=""
          style={{ width: "100px", height: "auto" }}
        />
      ),
    },
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
      setIdHeader(data.id);
      setVslType(data.vslType || null);

      // Populate form with fetched data
      setValue("vslName", data.vslName ?? "");
      setValue("vslType", data.vslType ?? "");
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
      setStatus(data.status ?? "");
      // Set your state values here as before
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

  const handleBack = () => {
    router.back(); // Navigate to the previous page
  };

  const handleSaveDetail = () => {
    fetchData();
    fetchDetail();
  };

  const onSubmit = async (data: createTrVesselAssessmentDto) => {
    console.log(data);
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
          /*  router.push(`/vesselAssessment/editById/${id}`); */
          router.push(`/vesselAssessment/`);
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
                {user?.superUser || user?.roleCode === "DPA" ? (
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
                      {/* <FormField
                        name="scoreGeneral"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Score General</FormLabel>
                            <FormControl>
                              <Input
                                readOnly
                                placeholder="Score General"
                                {...field}
                                className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                              />
                            </FormControl>
                            <FormMessage>
                              {errors.scoreGeneral?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      /> */}
                    </Card>
                  </>
                ) : (
                  <></>
                )}
                {user?.superUser || user?.roleCode === "CRW-TS" ? (
                  <>
                    {" "}
                    <Card className="p-2">
                      <FormField
                        name="scoreItemTechnical"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Score Item Technical</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Score Item Technical"
                                {...field}
                                readOnly
                                className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                              />
                            </FormControl>
                            <FormMessage>
                              {errors.scoreItemTechnical?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="downtimeDaysTechnical"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Downtime Days Technical</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Downtime Days TEchnical"
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
                              {errors.downtimeDaysTechnical?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                      {/*  <FormField
                        name="scoreTechnical"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Score Technical</FormLabel>
                            <FormControl>
                              <Input
                                readOnly
                                placeholder="Score Technical"
                                {...field}
                                className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                              />
                            </FormControl>
                            <FormMessage>
                              {errors.scoreTechnical?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      /> */}
                    </Card>
                  </>
                ) : (
                  <></>
                )}
                {user?.superUser || user?.roleCode === "CRW-MS" ? (
                  <>
                    {" "}
                    <Card className="p-2">
                      <FormField
                        name="scoreItemMarine"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Score Item Marine</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Score Item Marine"
                                {...field}
                                readOnly
                                className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                              />
                            </FormControl>
                            <FormMessage>
                              {errors.scoreItemMarine?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="downtimeDaysMarine"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Downtime Days Marine</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Downtime Days MArine"
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
                              {errors.downtimeDaysMarine?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                      {/* <FormField
                        name="scoreMarine"
                        control={control}
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Score Marine</FormLabel>
                            <FormControl>
                              <Input
                                readOnly
                                placeholder="Score Marine"
                                {...field}
                                className="w-full border border-gray-300 bg-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                              />
                            </FormControl>
                            <FormMessage>
                              {errors.scoreMarine?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      /> */}
                    </Card>
                  </>
                ) : (
                  <></>
                )}

                <div className="md:col-span-4 flex justify-end mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full md:w-auto mr-2"
                  >
                    Back
                  </Button>
                  {status === "CLOSED" ||
                  status === "UPLOADING PHOTO" ||
                  status === "READY" ||
                  status === "PHOTO COMPLETED" ? (
                    <>
                      {" "}
                      <Button
                        type="submit"
                        className="w-full md:w-auto bg-orange-700 hover:bg-orange-500"
                        disabled={loading}
                      >
                        {loading ? "Close..." : "Close"}
                      </Button>
                    </>
                  ) : status === "OPEN" ? (
                    <>
                      {" "}
                      <Button
                        type="submit"
                        className="w-full md:w-auto bg-orange-700 hover:bg-orange-500"
                        disabled={loading}
                      >
                        {loading ? "Generate Link..." : "Generate Link"}
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
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
              status={status ?? ""}
              mode={""}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EditVesselAssessmentForm;
