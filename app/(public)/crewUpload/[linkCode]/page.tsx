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
  getTrVesselAssessmentByLink,
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
import { format, parse, setYear } from "date-fns";
import { TrVesselAssessmentDetail } from "@/lib/types/TrVesselAssessmentDetail.types";
import { getTrVesselAssessmentDetail } from "@/services/service_api_vesselAssessmentDetail";
import DataTableCrewUpload from "@/components/Data-Table/data-table-crewUpload";
import UploadPhotoForm from "@/components/form/upload-photo-form";
import { ColumnDef } from "@tanstack/react-table";
import {
  getPreviousLastVesselAssessmentByVslCodeForCrew,
  getTrVesselAssessmentByLinkForCrew,
  getTrVesselAssessmentDetailForCrew,
  saveTrVesselAssessmentForCrew,
} from "@/services/service_api_vesselAssessmentForCrew";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTableCrewAssessmentResults from "@/components/Data-Table/data-table-crewAssessmentResults";
import { CellContext } from "@tanstack/react-table";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const CrewUploadForm = () => {
  const router = useRouter();
  const { linkCode } = useParams();
  const [baseUrl, setBaseUrl] = useState("");

  const methods = useForm<createTrVesselAssessmentDto>({
    resolver: zodResolver(createTrVesselAssessmentZod),
    defaultValues: {
      // Initialize default values (similar to Add form)
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
      gradeTotal: 0,
      mode: "",
      vslCode: "",
    },
  });
  const [detail, setDetail] = useState<TrVesselAssessmentDetail[]>([]);
  const [previousDetail, setPreviousDetail] = useState<
    TrVesselAssessmentDetail[]
  >([]);
  const [status, setStatus] = useState<string | null>(null);
  const [month, setMonth] = useState<string | undefined>();
  const [year, setYear] = useState<number | undefined>();
  const [periodDate, setPeriodDate] = useState<Date | undefined>();
  const [finalDate, setFinalDate] = useState<Date | undefined>();
  const [isOutOfPeriod, setIsOutOfPeriod] = useState(false);
  const [averagesDetail, setAveragesDetail] = useState<Record<string, number>>(
    {}
  );

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { toast } = useToast();
  const [id, setId] = useState<number | null>(null);
  const [vesselName, setVesselName] = useState<string | null>(null);
  const [vesselCode, setVesselCode] = useState<string | null>(null);
  const [idList, setIdList] = useState<number[]>([]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [itemName, setItemName] = useState<string>();

  const handleImageSampleClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleOpenModal = (_id: number, _item?: string) => {
    setEditId(_id);
    setItemName(_item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleSaveModal = () => {
    setModalOpen(false);
    fetchDetail();
  };

  const columnsDetail = [
    { header: "Item", accessorKey: "item" },
    { header: "Ship Section", accessorKey: "shipSection" },

    {
      header: "Sample Photo",
      cell: ({ row }: { row: { original: TrVesselAssessmentDetail } }) =>
        row.original.itemSamplePhoto ? (
          <img
            src={row.original.itemSamplePhoto}
            alt=""
            style={{ width: "100px", height: "auto", cursor: "pointer" }}
            onClick={() =>
              handleImageSampleClick(row.original.itemSamplePhoto || "")
            }
          />
        ) : null, // Tidak menampilkan apapun jika URL kosong
    },
    {
      header: "Photo",
      accessorKey: "smallFileLink",
      cell: ({ row }: { row: { original: TrVesselAssessmentDetail } }) => (
        <div style={{ textAlign: "center" }}>
          {/* Render gambar jika ada URL */}
          {row.original.smallFileLink && (
            <img
              src={row.original.smallFileLink}
              alt=""
              style={{
                width: "100px",
                height: "auto",
                cursor: "pointer",
                marginBottom: "8px",
              }}
              onClick={() =>
                handleImageSampleClick(row.original.smallFileLink || "")
              }
            />
          )}
          {/* Tombol Upload Photo */}
          <Button
            onClick={() => handleOpenModal(row.original.id, row.original.item)}
            /*  variant="outline" */
            size="sm"
            className=" bg-orange-700 hover:bg-orange-400"
          >
            Upload Photo
          </Button>
        </div>
      ),
    },
    { header: "Photo Description", accessorKey: "photoDescription" },
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
        const data = await getTrVesselAssessmentByLinkForCrew(linkCode);
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
        setVesselCode(data.vslCode ?? "");

        if (data.periodDate) {
          const periodDate =
            typeof data.periodDate === "string"
              ? new Date(data.periodDate)
              : data.periodDate;

          if (periodDate instanceof Date && !isNaN(periodDate.getTime())) {
            const tahun = periodDate.getFullYear();
            const bulan = periodDate.getMonth();
            setYear(tahun);
            setMonth(monthNames[bulan]);
          } else {
            console.error("Invalid periodDate format");
            setYear(0);
            setMonth(undefined);
          }
        } else {
          console.error("periodDate tidak ada");
          setYear(0);
          setMonth(undefined);
        }
      } else {
        console.error("Invalid linkCode:", linkCode);
      }
    };
    fetchData();
    fetchDetail();
    fetchPreviousDetail();
    setBaseUrl(`${window.location.protocol}//${window.location.host}/`);
  }, [
    id,
    setId,
    setVesselName,
    setVesselCode,
    setMonth,
    setYear,
    setValue,
    setStatus,
  ]);

  useEffect(() => {
    const today = new Date();
    if (periodDate && finalDate) {
      setIsOutOfPeriod(today < periodDate || today > finalDate);
    }
  }, [periodDate, finalDate]);

  const fetchDetail = async () => {
    const dataDetail = await getTrVesselAssessmentDetailForCrew(Number(id));
    const ids = dataDetail.map((detail: { id: number }) => detail.id);
    setIdList(ids);
    const groupedData = dataDetail.reduce((acc, item) => {
      const section = item.shipSection ?? "Unknown";
      (acc[section] = acc[section] || []).push(item);
      return acc;
    }, {} as Record<string, TrVesselAssessmentDetail[]>);

    setDetail(dataDetail);
  };

  const fetchPreviousDetail = async () => {
    if (vesselCode) {
      const data = await getPreviousLastVesselAssessmentByVslCodeForCrew(
        vesselCode
      );
      if (data) {
        const dataDetail = await getTrVesselAssessmentDetail(Number(data.id));
        setPreviousDetail(dataDetail);
      }
    }
    const dataDetail = await getTrVesselAssessmentDetailForCrew(Number(id));
    const averages = calculateAverageGradeByCategory(dataDetail);
    setAveragesDetail(calculateAverageGradeByCategory(dataDetail));
    console.log(averages);
  };

  function calculateAverageGradeByCategory(
    data: TrVesselAssessmentDetail[]
  ): Record<string, number> {
    const categoryMap: Record<string, { total: number; count: number }> = {};

    data.forEach(({ categorySection, grade }) => {
      if (!categorySection) {
        console.warn("Invalid categorySection found, skipping entry:", {
          categorySection,
          grade,
        });
        return;
      }

      if (!categoryMap[categorySection]) {
        categoryMap[categorySection] = { total: 0, count: 0 };
      }
      categoryMap[categorySection].total += grade;
      categoryMap[categorySection].count += 1;
    });

    const averages: Record<string, number> = {};
    for (const category in categoryMap) {
      averages[category] =
        categoryMap[category].total / categoryMap[category].count;
    }

    return averages;
  }

  const handleSaveDetail = () => {
    fetchDetail();
  };

  const handleCloseDetail = () => {
    fetchDetail();
  };

  const onSubmit = async (data: createTrVesselAssessmentDto) => {
    if (status === "OPEN") {
      data.mode = "GENERATE LINK";
      data.linkShared = baseUrl + "crewUpload/";
    } else {
      data.mode = "SAVE";
    }
    try {
      const ret = await saveTrVesselAssessmentForCrew(data);
      if (ret.status === 200) {
        router.push(`/editById/${id}`);
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
    }
  };

  const detailResults = Object.entries(averagesDetail).map(([key, value]) => ({
    categorySection: key,
    average: value,
  }));

  const columnsDetailResults = [
    { header: "Category Section", accessorKey: "categorySection" },
    { header: "Average Grade", accessorKey: "averageGrade" },
  ];

  return (
    <>
      <div>
        <Card className="mb-2">
          <CardHeader>
            <CardTitle className="flex justify-center">
              {vesselName} Vessel Assessment Period {month} {year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="currentAssessment">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="currentAssessment">
                  Current Assessment
                </TabsTrigger>
                <TabsTrigger value="previousAssessment">
                  Previous Assessment Results
                </TabsTrigger>
              </TabsList>
              <TabsContent value="currentAssessment">
                {isOutOfPeriod ? (
                  <p className="text-red-500 text-center">
                    Penilaian ini sudah diluar dari periode.
                  </p>
                ) : (
                  <>
                    <div style={{ height: "70vh", overflowY: "auto" }}>
                      <Card>
                        <CardHeader>
                          <CardTitle>Assessment Detail</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <DataTableCrewUpload
                            data={detail}
                            columns={columnsDetail}
                            modalContent={
                              <UploadPhotoForm
                                onClose={() => {}}
                                onSave={() => {}}
                                id={0}
                                idHeader={Number(id)}
                                idList={idList}
                              />
                            }
                            onClose={() => handleCloseDetail()}
                            onSaveData={() => handleSaveDetail()}
                          />
                          {/* Modal */}
                          {selectedImage && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                              <div className="bg-white p-4 rounded-lg shadow-lg">
                                <img
                                  src={selectedImage}
                                  alt="Selected"
                                  className="max-w-[80vw] max-h-[80vh] w-auto h-auto"
                                />
                                <button
                                  onClick={() => setSelectedImage(null)}
                                  className="mt-4 px-4 py-2 bg-cyan-800 text-white rounded"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </TabsContent>
              <TabsContent value="previousAssessment">
                <>
                  <div style={{ height: "70vh", overflowY: "auto" }}>
                    <Card>
                      <CardHeader>
                        <CardTitle> Previous Assessment Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DataTableCrewAssessmentResults
                          data={detailResults}
                          columns={columnsDetailResults}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </>
              </TabsContent>
            </Tabs>
            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
              <DialogContent className="md:max-w-[800px] max-h-[600px] overflow-auto">
                <DialogTitle>Upload Photo - {itemName}</DialogTitle>
                <UploadPhotoForm
                  onClose={handleCloseModal}
                  onSave={handleSaveModal}
                  id={editId || 0}
                  idHeader={Number(id)}
                  idList={idList}
                />
              </DialogContent>
            </Dialog>

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

export default CrewUploadForm;
