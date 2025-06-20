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
  getTrVesselDrillByLink,
  saveTrVesselDrill,
} from "@/services/service_api_vesselDrill";
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

import { TrVesselDrillDetail } from "@/lib/types/TrVesselDrillDetail.types";
import { getTrVesselDrillDetail } from "@/services/service_api_vesselDrillDetail";
import DataTableCrewUpload from "@/components/Data-Table/data-table-crewUpload";
import UploadVideoForm from "@/components/form/upload-video-form";
import { ColumnDef } from "@tanstack/react-table";
import {
  getPreviousLastVesselDrillByVslCodeForCrew,
  getTrVesselDrillByLinkForCrew,
  getTrVesselDrillDetailForCrew,
  saveTrVesselDrillForCrew,
} from "@/services/service_api_vesselDrillForCrew";
import DataTableVesselDrillUpload from "@/components/Data-Table/data-table-vesselDrillUpload";
import { reportWebVitals } from "next/dist/build/templates/pages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VesselDrillUploadForm = () => {
  const router = useRouter();
  const { linkCode } = useParams();
  const [baseUrl, setBaseUrl] = useState("");

  const methods = useForm<createTrVesselDrillDto>({
    resolver: zodResolver(createTrVesselDrillZod),
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
      linkCode: "",
      status: "",
      grade: "",
      mode: "",
      vslCode: "",
    },
  });
  const [detail, setDetail] = useState<TrVesselDrillDetail[]>([]);
  const [detailPrev, setDetailPrev] = useState<TrVesselDrillDetail[]>([]);
  const [detailReport, setDetailReport] = useState<TrVesselDrillDetail[]>([]);
  const [detailReportPrev, setDetailReportPrev] = useState<
    TrVesselDrillDetail[]
  >([]);
  const [status, setStatus] = useState<string | null>(null);
  const [month, setMonth] = useState<string | undefined>();
  const [year, setYear] = useState<number | undefined>();
  const [periodDate, setPeriodDate] = useState<Date | undefined>();
  const [finalDate, setFinalDate] = useState<Date | undefined>();
  const [isOutOfPeriod, setIsOutOfPeriod] = useState(false);

  const {
    setValue,
    getValues,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { toast } = useToast();
  const [id, setId] = useState<number | null>(null);
  const [vesselName, setVesselName] = useState<string | null>(null);
  const [idList, setIdList] = useState<number[]>([]);

  const columnsDetail = [
    { header: "Item", accessorKey: "itemName" },
    /* {
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
    }, */
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

  const columnsDetailPrev = [
    { header: "Item", accessorKey: "itemName" },

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
    { header: "Feed back", accessorKey: "gradeDescription" },
  ];

  const monthNames = [
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
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (typeof linkCode === "string") {
        const data = await getTrVesselDrillByLinkForCrew(linkCode);
        setValue("id", data.id ?? 0);
        setValue("vslName", data.vslName ?? "");
        setValue("vslType", data.vslType ?? "");
        setValue("vslCode", data.vslCode ?? "");
        setValue(
          "periodDate",
          data.periodDate ? new Date(data.periodDate) : new Date()
        );
        setValue(
          "finalDate",
          data.finalDate ? new Date(data.finalDate) : new Date()
        );
        setPeriodDate(data.periodDate ? new Date(data.periodDate) : undefined);
        setFinalDate(data.finalDate ? new Date(data.finalDate) : undefined);
        setValue("description", data.description);
        setValue("status", data.status);
        setStatus(data.status ?? "");
        setId(data.id ?? 0);
        setVesselName(data.vslName ?? "");

        if (data.periodDate) {
          // Check if periodDate is a string and convert it to a Date object
          const periodDate =
            typeof data.periodDate === "string"
              ? new Date(data.periodDate)
              : data.periodDate;

          // Validate that periodDate is a Date object
          if (periodDate instanceof Date && !isNaN(periodDate.getTime())) {
            const tahun = periodDate.getFullYear();
            const bulan = periodDate.getMonth(); // Get the zero-indexed month
            setYear(tahun);
            setMonth(monthNames[bulan]); // Set month as the corresponding string
          } else {
            console.error("Invalid periodDate format");
            setYear(0); // Set year to 0 or take other appropriate action
            setMonth(undefined); // Set month to undefined if periodDate is invalid
          }
        } else {
          console.error("periodDate tidak ada");
          setYear(0); // Set year to 0 or take other appropriate action
          setMonth(undefined); // Set month to undefined if periodDate is not available
        }
      } else {
        console.error("Invalid linkCode:", linkCode);
      }
    };
    fetchData();
    fetchDetail();
    fetchDetailPrevious();
    setBaseUrl(`${window.location.protocol}//${window.location.host}/`);
  }, [
    id,
    setId,
    setVesselName,
    setMonth,
    setYear,
    setValue,
    getValues,
    setStatus,
  ]);

  useEffect(() => {
    const today = new Date();
    if (periodDate && finalDate) {
      setIsOutOfPeriod(today < periodDate || today > finalDate);
    }
    console.log(today, periodDate, finalDate);
  }, [periodDate, finalDate]);

  const fetchDetail = async () => {
    const dataDetail = await getTrVesselDrillDetailForCrew(Number(id));
    const filteredDetail = dataDetail.filter(
      (item) => item.itemType === "Drill"
    );
    const filteredData = dataDetail.filter(
      (item) => item.itemType === "ReportSafety"
    );
    const ids = dataDetail.map((detail: { id: number }) => detail.id);
    setIdList(ids);
    const groupedData = dataDetail.reduce((acc, item) => {
      const section = item.itemName ?? "Unknown";
      (acc[section] = acc[section] || []).push(item);
      return acc;
    }, {} as Record<string, TrVesselDrillDetail[]>);

    /* setDetail(groupedData);  */
    setDetail(filteredDetail);
    setDetailReport(filteredData);
  };

  const fetchDetailPrevious = async () => {
    if (getValues("vslCode")) {
      const data = await getPreviousLastVesselDrillByVslCodeForCrew(
        getValues("vslCode")
      );
      if (data) {
        const dataDetail = await getTrVesselDrillDetailForCrew(Number(data.id));
        if (dataDetail.length > 0) {
          const filteredDetail = dataDetail.filter(
            (item) => item.itemType === "Drill"
          );
          const filteredData = dataDetail.filter(
            (item) => item.itemType === "ReportSafety"
          );
          setDetailPrev(filteredDetail);
          setDetailReportPrev(filteredData);
        }
      }
    }
  };

  const handleSaveDetail = () => {
    fetchDetail();
  };

  const handleCloseDetail = () => {
    fetchDetail();
  };

  const onSubmit = async (data: createTrVesselDrillDto) => {
    if (status === "OPEN") {
      data.mode = "GENERATE LINK";
      data.linkShared = baseUrl + "crewUpload/";
    } else {
      data.mode = "SAVE";
    }
    try {
      const ret = await saveTrVesselDrillForCrew(data);
      if (ret.status === 200) {
        router.push(`/editById/${id}`);
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
    }
  };

  return (
    <>
      <div>
        <Card className="mb-2">
          <CardHeader className="p-2">
            <CardTitle className="flex justify-center text-md">
              {vesselName} Vessel Drill Periode {month} {year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isOutOfPeriod ? (
              <>
                {" "}
                <p className="text-red-500 text-center">
                  Penilaian ini sudah diluar dari periode.
                </p>
              </>
            ) : (
              <>
                <Tabs defaultValue="currentAssessment">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="currentAssessment">
                      Periode Saat ini
                    </TabsTrigger>
                    <TabsTrigger value="previousAssessment">
                      Feedback Periode Sebelumnya
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="currentAssessment">
                    <div style={{ height: "70vh", overflowY: "auto" }}>
                      <Card>
                        <CardHeader className="p-2">
                          <CardTitle className="text-md">
                            Drill Detail
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <DataTableVesselDrillUpload
                            data={detail}
                            columns={columnsDetail}
                            modalContent={
                              <UploadVideoForm
                                onClose={() => {}}
                                onSave={() => {}}
                                id={0}
                                idHeader={Number(id)}
                                idList={idList}
                              />
                            }
                            type="VIDEO"
                            menu="CURRENT"
                            onClose={() => handleCloseDetail()}
                            onSaveData={() => handleSaveDetail()}
                          />
                        </CardContent>
                      </Card>
                      <Card className="mt-2">
                        <CardHeader className="p-2">
                          <CardTitle className="text-md">
                            Report Safety Detail
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <DataTableVesselDrillUpload
                            data={detailReport}
                            columns={columnsDetail}
                            modalContent={
                              <UploadVideoForm
                                onClose={() => {}}
                                onSave={() => {}}
                                id={0}
                                idHeader={Number(id)}
                                idList={idList}
                              />
                            }
                            type="DOC"
                            menu="CURRENT"
                            onClose={() => handleCloseDetail()}
                            onSaveData={() => handleSaveDetail()}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value="previousAssessment">
                    <div style={{ height: "70vh", overflowY: "auto" }}>
                      <Card>
                        <CardHeader className="p-2">
                          <CardTitle className="text-md">
                            Drill Periode Sebelumnya
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <DataTableVesselDrillUpload
                            data={detailPrev}
                            columns={columnsDetailPrev}
                            modalContent={
                              <UploadVideoForm
                                onClose={() => {}}
                                onSave={() => {}}
                                id={0}
                                idHeader={Number(id)}
                                idList={idList}
                              />
                            }
                            type="VIDEO"
                            menu="PREV"
                            onClose={() => handleCloseDetail()}
                            onSaveData={() => handleSaveDetail()}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}

            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-6 md:grid-cols-3"
              ></form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VesselDrillUploadForm;
