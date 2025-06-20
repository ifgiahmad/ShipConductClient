"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  createTrVesselAssessmentDto,
  createTrVesselAssessmentZod,
  TrVesselAssessment,
} from "@/lib/types/TrVesselAssessment.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrVesselAssessmentDetail } from "@/lib/types/TrVesselAssessmentDetail.types";
import DataTableCrewUpload from "@/components/Data-Table/data-table-crewUpload";
import UploadPhotoForm from "@/components/form/upload-photo-form";
import {
  getTrVesselAssessmentByLinkForCrew,
  getTrVesselAssessmentDetailForCrew,
} from "@/services/service_api_vesselAssessmentForCrew";
import { ChevronsUpDown } from "lucide-react";
import { UserRole } from "@/lib/type";
import { getUser } from "@/services/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getTrVesselAssessmentByNameAndPeriod,
  getViewVesselAssessmentById,
} from "@/services/service_api_vesselAssessment";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import DataTableCrewAssessmentResults from "@/components/Data-Table/data-table-crewAssessmentResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrVesselAssessmentFormProps {
  onClose: () => void;
  onSave: () => void;
  linkCode: string;
}

const DialogViewVesselAssessment = ({
  onClose,
  onSave,
  linkCode,
}: TrVesselAssessmentFormProps) => {
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
      scoreGeneralBarge: 0,
      scoreGeneralVessel: 0,
      vslTypeMate: "",
      mode: "",
      gradeTotalVslMate: 0,
      gradeTotalVslName: 0,
      totalItemVslMate: 0,
      totalItemVslName: 0,
    },
  });
  const [detail, setDetail] = useState<TrVesselAssessmentDetail[]>([]);
  const [detailGeneral, setDetailGeneral] = useState<
    TrVesselAssessmentDetail[]
  >([]);
  const [detailGeneralBarge, setDetailGeneralBarge] = useState<
    TrVesselAssessmentDetail[]
  >([]);
  const [detailMarine, setDetailMarine] = useState<TrVesselAssessmentDetail[]>(
    []
  );
  const [detailMarineBarge, setDetailMarineBarge] = useState<
    TrVesselAssessmentDetail[]
  >([]);
  const [detailTechnical, setDetailTechnical] = useState<
    TrVesselAssessmentDetail[]
  >([]);
  const [detailTechnicalBarge, setDetailTechnicalBarge] = useState<
    TrVesselAssessmentDetail[]
  >([]);
  const [status, setStatus] = useState<string | null>(null);
  const [month, setMonth] = useState<string | undefined>();
  const [year, setYear] = useState<number | undefined>();

  const [totalScoreTechnicalItem, setTotalScoreTechnicalItem] = useState<
    number | undefined
  >();
  const [totalScoreTechnicalItemBarge, setTotalScoreTechnicalItemBarge] =
    useState<number | undefined>();
  const [totalScoreMarineItem, setTotalScoreMarineItem] = useState<
    number | undefined
  >();
  const [totalScoreMarineItemBarge, setTotalScoreMarineItemBarge] = useState<
    number | undefined
  >();

  const [totalScoreGeneralItem, setTotalScoreGeneralItem] = useState<
    number | undefined
  >();
  const [totalScoreGeneralItemBarge, setTotalScoreGeneralItemBarge] = useState<
    number | undefined
  >();

  const [totalScoreTechnicalItemVslMate, setTotalScoreTechnicalItemVslMate] =
    useState<number | undefined>();
  const [totalScoreMarineItemVslMate, setTotalScoreMarineItemVslMate] =
    useState<number | undefined>();

  const [totalScoreGeneralItemVslMate, setTotalScoreGeneralItemVslMate] =
    useState<number | undefined>();

  const [downtimeDayGeneral, setDowntimeDayGeneral] = useState<
    number | undefined
  >();
  const [downtimeGeneral, setDowntimeGeneral] = useState<number | undefined>();
  const [averageScoreGeneral, setAverageScoreGeneral] = useState<
    number | undefined
  >();
  const [finalScoreGeneral, setfinalScoreGeneral] = useState<
    number | undefined
  >();

  const [finalScoreTechnical, setfinalScoreTechnical] = useState<
    number | undefined
  >();
  const [averageScoreTechnical, setAverageScoreTechnical] = useState<
    number | undefined
  >();
  const [finalScoreMarine, setfinalScoreMarine] = useState<
    number | undefined
  >();
  const [averageScoreMarine, setAverageScoreMarine] = useState<
    number | undefined
  >();

  const [averagesShipSectionDetail, setAveragesShipSectionDetail] = useState<
    Record<string, number>
  >({});

  const [averagesShipSectionDetailBarge, setAveragesShipSectionDetailBarge] =
    useState<Record<string, number>>({});

  const {
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  const { toast } = useToast();
  const [id, setId] = useState<number | null>(null);
  const [vesselName, setVesselName] = useState<string | null>(null);
  const [vesselCode, setVesselCode] = useState<string | null>(null);
  const [idList, setIdList] = useState<number[]>([]);
  const [user, setUser] = useState<UserRole>();

  const [idListGeneral, setIdListGeneral] = useState<number[]>([]);
  const [idListTechnical, setIdListTechnical] = useState<number[]>([]);
  const [idListMarine, setIdListMarine] = useState<number[]>([]);

  const [idListGeneralBarge, setIdListGeneralBarge] = useState<number[]>([]);
  const [idListTechnicalBarge, setIdListTechnicalBarge] = useState<number[]>(
    []
  );
  const [idListMarineBarge, setIdListMarineBarge] = useState<number[]>([]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dataVslMate, setDataVslMate] = useState<TrVesselAssessment>();

  const handleImageSampleClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const columnsDetail = [
    { header: "Item", accessorKey: "item" },
    { header: "Ship Section", accessorKey: "shipSection" },
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
                <Carousel className="w-[500px]">
                  <CarouselContent>
                    {smallFileLinks.map((src, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={src}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-[500px] h-auto rounded-md cursor-pointer"
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
    { header: "Grade", accessorKey: "grade" },
    { header: "Grade Description", accessorKey: "gradeDescription" },
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
        console.log(linkCode);
        const data = await getTrVesselAssessmentByLinkForCrew(linkCode);
        console.log(data);
        setValue("id", data.id ?? 0);
        setValue("vslName", data.vslName ?? "");
        setValue("vslType", data.vslType ?? "");
        setValue("description", data.description);
        setValue("status", data.status);
        setValue("vslMate", data.vslMate);
        setValue("vslTypeMate", data.vslTypeMate);

        setStatus(data.status ?? "");
        setId(data.id ?? 0);
        setVesselName(data.vslName ?? "");
        setVesselCode(data.vslCode ?? "");

        setfinalScoreMarine(data.scoreMarine ?? 0);
        setAverageScoreMarine(data.scoreItemMarine ?? 0);

        setfinalScoreTechnical(data.scoreTechnical ?? 0);
        setAverageScoreTechnical(data.scoreItemTechnical ?? 0);

        setfinalScoreGeneral(data.scoreGeneral ?? 0);
        setDowntimeDayGeneral(data.downtimeDaysGeneral ?? 0);
        setDowntimeGeneral(data.downtimeGeneral ?? 0);
        setAverageScoreGeneral(data.scoreItemGeneral ?? 0);

        if (data) {
          const dataView = await getViewVesselAssessmentById(data.id);
          setValue("scoreGeneralBarge", dataView.scoreGeneralBarge);
          setValue("scoreGeneralVessel", dataView.scoreGeneralVessel);
          setValue("vslTypeMate", dataView.vslTypeMate);
          setValue("gradeTotalVslName", dataView.gradeTotalVslName);
          setValue("gradeTotalVslMate", dataView.gradeTotalVslMate);
          setValue("totalItemVslMate", dataView.totalItemVslMate);
          setValue("totalItemVslName", dataView.totalItemVslName);
        }

        const dataVslMate = await getTrVesselAssessmentByNameAndPeriod(
          data.vslMate || "",
          data.month || 0,
          data.year || 0
        );
        setDataVslMate(dataVslMate);

        if (dataVslMate) {
          console.log(dataVslMate);
          await fetchDetailBarge(dataVslMate.id);
          const dataDetailVslMate = await getTrVesselAssessmentDetailForCrew(
            Number(dataVslMate?.id)
          );

          if (dataDetailVslMate.length > 0) {
            const filteredDataDetailGeneral = dataDetailVslMate.filter(
              (detail) => detail.roleCategory === "GENERAL"
            );

            const totalScoreGeneral = filteredDataDetailGeneral.reduce(
              (sum, detail) => {
                return sum + detail.grade;
              },
              0
            );
            setTotalScoreGeneralItemVslMate(totalScoreGeneral);

            const filteredDataDetailMarine = dataDetailVslMate.filter(
              (detail) => detail.roleCategory === "MARINE"
            );
            const totalScoreMarine = filteredDataDetailMarine.reduce(
              (sum, detail) => {
                return sum + detail.grade;
              },
              0
            );
            setTotalScoreMarineItemVslMate(totalScoreMarine);

            const filteredDataDetailTechnical = dataDetailVslMate.filter(
              (detail) => detail.roleCategory === "TECHNICAL"
            );

            const totalScoreTechnical = filteredDataDetailTechnical.reduce(
              (sum, detail) => {
                return sum + detail.grade;
              },
              0
            );
            setTotalScoreTechnicalItemVslMate(totalScoreTechnical);
          }
        }

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
    fetchUser();
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

  const fetchDetail = async () => {
    const dataDetail = await getTrVesselAssessmentDetailForCrew(Number(id));
    dataDetail.sort((a, b) =>
      (a.shipSection ?? "").localeCompare(b.shipSection ?? "")
    );

    const ids = dataDetail.map((detail: { id: number }) => detail.id);
    setIdList(ids);
    const groupedData = dataDetail.reduce((acc, item) => {
      const section = item.shipSection ?? "Unknown";
      (acc[section] = acc[section] || []).push(item);
      return acc;
    }, {} as Record<string, TrVesselAssessmentDetail[]>);

    setDetail(dataDetail);

    if (dataDetail.length > 0) {
      const filteredDataDetailGeneral = dataDetail.filter(
        (detail) => detail.roleCategory === "GENERAL"
      );

      const totalScoreGeneral = filteredDataDetailGeneral.reduce(
        (sum, detail) => {
          return sum + detail.grade;
        },
        0
      );
      setTotalScoreGeneralItem(totalScoreGeneral);

      const idsGeneral = filteredDataDetailGeneral.map(
        (detail: { id: number }) => detail.id
      );
      setIdListGeneral(idsGeneral);

      const filteredDataDetailMarine = dataDetail.filter(
        (detail) => detail.roleCategory === "MARINE"
      );
      const totalScoreMarine = filteredDataDetailMarine.reduce(
        (sum, detail) => {
          return sum + detail.grade;
        },
        0
      );
      setTotalScoreMarineItem(totalScoreMarine);

      const idsMarine = filteredDataDetailMarine.map(
        (detail: { id: number }) => detail.id
      );
      setIdListMarine(idsMarine);

      const filteredDataDetailTechnical = dataDetail.filter(
        (detail) => detail.roleCategory === "TECHNICAL"
      );

      const totalScoreTechnical = filteredDataDetailTechnical.reduce(
        (sum, detail) => {
          return sum + detail.grade;
        },
        0
      );
      setTotalScoreTechnicalItem(totalScoreTechnical);

      const idsTechnical = filteredDataDetailTechnical.map(
        (detail: { id: number }) => detail.id
      );
      setIdListTechnical(idsTechnical);

      setDetailGeneral(filteredDataDetailGeneral);
      setDetailMarine(filteredDataDetailMarine);
      setDetailTechnical(filteredDataDetailTechnical);

      setAveragesShipSectionDetail(
        calculateAverageGradeByShipSection(filteredDataDetailGeneral)
      );
    }

    function calculateAverageGradeByShipSection(
      data: TrVesselAssessmentDetail[]
    ): Record<string, number> {
      const sectionMap: Record<string, { total: number; count: number }> = {};

      data.forEach(({ shipSection, grade }) => {
        if (!shipSection) {
          console.warn("Invalid Section found, skipping entry:", {
            shipSection,
            grade,
          });
          return;
        }

        if (!sectionMap[shipSection]) {
          sectionMap[shipSection] = { total: 0, count: 0 };
        }
        sectionMap[shipSection].total += grade;
        sectionMap[shipSection].count += 1;
      });

      const averages: Record<string, number> = {};
      for (const section in sectionMap) {
        averages[section] = parseFloat(
          (sectionMap[section].total / sectionMap[section].count).toFixed(2)
        );
      }
      return averages;
    }
  };

  const fetchDetailBarge = async (idBarge: number) => {
    const dataDetail = await getTrVesselAssessmentDetailForCrew(
      Number(idBarge)
    );
    dataDetail.sort((a, b) =>
      (a.shipSection ?? "").localeCompare(b.shipSection ?? "")
    );

    const ids = dataDetail.map((detail: { id: number }) => detail.id);
    setIdList(ids);
    const groupedData = dataDetail.reduce((acc, item) => {
      const section = item.shipSection ?? "Unknown";
      (acc[section] = acc[section] || []).push(item);
      return acc;
    }, {} as Record<string, TrVesselAssessmentDetail[]>);

    if (dataDetail.length > 0) {
      const filteredDataDetailGeneral = dataDetail.filter(
        (detail) => detail.roleCategory === "GENERAL"
      );

      const totalScoreGeneral = filteredDataDetailGeneral.reduce(
        (sum, detail) => {
          return sum + detail.grade;
        },
        0
      );
      setTotalScoreGeneralItemBarge(totalScoreGeneral);

      const idsGeneral = filteredDataDetailGeneral.map(
        (detail: { id: number }) => detail.id
      );
      setIdListGeneralBarge(idsGeneral);

      const filteredDataDetailMarine = dataDetail.filter(
        (detail) => detail.roleCategory === "MARINE"
      );
      const totalScoreMarine = filteredDataDetailMarine.reduce(
        (sum, detail) => {
          return sum + detail.grade;
        },
        0
      );
      setTotalScoreMarineItemBarge(totalScoreMarine);

      const idsMarine = filteredDataDetailMarine.map(
        (detail: { id: number }) => detail.id
      );
      setIdListMarineBarge(idsMarine);

      const filteredDataDetailTechnical = dataDetail.filter(
        (detail) => detail.roleCategory === "TECHNICAL"
      );

      const totalScoreTechnical = filteredDataDetailTechnical.reduce(
        (sum, detail) => {
          return sum + detail.grade;
        },
        0
      );
      setTotalScoreTechnicalItemBarge(totalScoreTechnical);

      const idsTechnical = filteredDataDetailTechnical.map(
        (detail: { id: number }) => detail.id
      );
      setIdListTechnicalBarge(idsTechnical);

      setDetailGeneralBarge(filteredDataDetailGeneral);
      setDetailMarineBarge(filteredDataDetailMarine);
      setDetailTechnicalBarge(filteredDataDetailTechnical);

      setAveragesShipSectionDetailBarge(
        calculateAverageGradeByShipSection(filteredDataDetailGeneral)
      );
    }

    function calculateAverageGradeByShipSection(
      data: TrVesselAssessmentDetail[]
    ): Record<string, number> {
      const sectionMap: Record<string, { total: number; count: number }> = {};

      data.forEach(({ shipSection, grade }) => {
        if (!shipSection) {
          console.warn("Invalid categorySection found, skipping entry:", {
            shipSection,
            grade,
          });
          return;
        }

        if (!sectionMap[shipSection]) {
          sectionMap[shipSection] = { total: 0, count: 0 };
        }
        sectionMap[shipSection].total += grade;
        sectionMap[shipSection].count += 1;
      });

      const averages: Record<string, number> = {};
      for (const section in sectionMap) {
        averages[section] = parseFloat(
          (sectionMap[section].total / sectionMap[section].count).toFixed(2)
        );
      }
      return averages;
    }
  };

  const fetchUser = async () => {
    const result = await getUser();
    setUser(result);
  };

  const handleSaveDetail = () => {
    fetchDetail();
  };

  const handleCloseDetail = () => {
    fetchDetail();
  };

  //Detail untuk Score Shipsection
  const detailShipsection = Object.entries(averagesShipSectionDetail).map(
    ([key, value]) => ({
      categorySection: key,
      shipSectionGrade: value,
    })
  );

  const detailShipsectionBarge = Object.entries(
    averagesShipSectionDetailBarge
  ).map(([key, value]) => ({
    categorySection: key,
    shipSectionGrade: value,
  }));

  const columnsDetailShipsection = [
    { header: "Ship Section", accessorKey: "categorySection" },
    { header: "Score", accessorKey: "shipSectionGrade" },
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
            <Tabs defaultValue="vessel">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vessel">
                  Vessel - {getValues("vslName")}
                </TabsTrigger>
                {getValues("vslMate") ? (
                  <>
                    <TabsTrigger value="barge">
                      Barge - {getValues("vslMate")}
                    </TabsTrigger>
                  </>
                ) : (
                  <></>
                )}
              </TabsList>
              <TabsContent value="vessel">
                <>
                  <div style={{ height: "70vh", overflowY: "auto" }}>
                    <div className="rounded-md border bg-white shadow-lg hover:shadow-xl transition-shadow m-1">
                      <Collapsible>
                        <CollapsibleTrigger className="flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-t-md">
                          <span className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg">
                            General
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center"
                          >
                            <ChevronsUpDown className="h-4 w-4 transition-transform" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 bg-gray-50">
                          <Card>
                            <CardHeader>
                              <CardTitle>Score Ship Section</CardTitle>
                              <CardContent>
                                <DataTableCrewAssessmentResults
                                  data={detailShipsection}
                                  columns={columnsDetailShipsection}
                                />
                              </CardContent>
                            </CardHeader>
                          </Card>
                          <Card className="mt-2">
                            <CardHeader>
                              <CardTitle>Score Assessment</CardTitle>
                              <CardContent>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-2">
                                  <Card className="p-2">
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="totalScoreGeneral">
                                        sum of item scores Vessel{" "}
                                        {getValues("vslName")}
                                      </Label>
                                      <Input
                                        type="number"
                                        id="gradeTotalVslName"
                                        placeholder="gradeTotalVslName"
                                        value={getValues("gradeTotalVslName")}
                                        readOnly
                                      />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="totalScoreGeneral">
                                        Total Item Vessel {getValues("vslName")}
                                      </Label>
                                      <Input
                                        type="number"
                                        id="totalItemVslName"
                                        placeholder="totalItemVslName"
                                        value={getValues("totalItemVslName")}
                                        readOnly
                                      />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="totalScoreGeneral">
                                        Score Vessel {getValues("vslName")}
                                      </Label>
                                      <Input
                                        type="number"
                                        id="scoreGeneralVessel"
                                        placeholder="Score General Vessel"
                                        value={getValues("scoreGeneralVessel")}
                                        readOnly
                                      />
                                    </div>
                                    {/* <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="totalScoreGeneral">
                                        Total Score Vessel{" "}
                                        {getValues("vslName")}
                                      </Label>
                                      <Input
                                        type="number"
                                        id="totalScoreGeneral"
                                        placeholder="Total Score General"
                                        value={totalScoreGeneralItem}
                                        readOnly
                                      />
                                    </div>
                                    {dataVslMate ? (
                                      <>
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                          <Label htmlFor="totalScoreGeneralVslMate">
                                            Total Score Barge{" "}
                                            {dataVslMate?.vslName}
                                          </Label>
                                          <Input
                                            type="number"
                                            id="totalScoreGeneralVslMate"
                                            placeholder="Total Score General"
                                            value={totalScoreGeneralItemVslMate}
                                            readOnly
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <></>
                                    )}

                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="averageScoreGeneral">
                                        Average Score
                                      </Label>
                                      <Input
                                        type="number"
                                        id="averageScoreGeneral"
                                        placeholder="Average Score General"
                                        value={averageScoreGeneral}
                                        readOnly
                                      />
                                    </div> */}
                                  </Card>
                                  <Card className="p-2">
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="totalScoreGeneralVslMate">
                                        sum of item scores Barge{" "}
                                        {dataVslMate?.vslName}
                                      </Label>
                                      <Input
                                        type="number"
                                        id="gradeTotalVslMate"
                                        placeholder="gradeTotalVslMate"
                                        value={getValues("gradeTotalVslMate")}
                                        readOnly
                                      />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="totalScoreGeneralVslMate">
                                        Total Item Barge {dataVslMate?.vslName}
                                      </Label>
                                      <Input
                                        type="number"
                                        id="totalItemVslMate"
                                        placeholder="totalItemVslMate"
                                        value={getValues("totalItemVslMate")}
                                        readOnly
                                      />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="totalScoreGeneralVslMate">
                                        Score Barge {dataVslMate?.vslName}
                                      </Label>
                                      <Input
                                        type="number"
                                        id="scoreGeneralBarge"
                                        placeholder="Score General Barge"
                                        value={getValues("scoreGeneralBarge")}
                                        readOnly
                                      />
                                    </div>
                                    {/*  <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="downtimeDayGeneral">
                                        Downtime Day General
                                      </Label>
                                      <Input
                                        type="number"
                                        id="downtimeDayGeneral"
                                        placeholder="Downtime Day General"
                                        value={downtimeDayGeneral}
                                        readOnly
                                      />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="downtimeGeneral">
                                        Downtime General
                                      </Label>
                                      <Input
                                        type="number"
                                        id="downtimeGeneral"
                                        placeholder="Downtime General"
                                        value={downtimeGeneral}
                                        readOnly
                                      />
                                    </div> */}
                                  </Card>
                                  <Card className="p-2">
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="averageScoreGeneral">
                                        Total Score
                                      </Label>
                                      <Input
                                        type="number"
                                        id="averageScoreGeneral"
                                        placeholder="Average Score General"
                                        value={averageScoreGeneral}
                                        readOnly
                                      />
                                    </div>
                                    {/*   <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="finalScoreGeneral">
                                        Final Score General
                                      </Label>
                                      <Input
                                        type="number"
                                        id="finalScoreGeneral"
                                        placeholder="Final Score General"
                                        value={finalScoreGeneral}
                                        readOnly
                                      />
                                    </div> */}
                                  </Card>
                                </div>
                              </CardContent>
                            </CardHeader>
                          </Card>
                          <DataTableCrewUpload
                            data={detailGeneral}
                            columns={columnsDetail}
                            modalContent={
                              <UploadPhotoForm
                                onClose={() => {}}
                                onSave={() => {}}
                                id={0}
                                idHeader={Number(id)}
                                idList={idListGeneral}
                              />
                            }
                            onClose={() => handleCloseDetail()}
                            onSaveData={() => handleSaveDetail()}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                    <div className="rounded-md border bg-white shadow-lg hover:shadow-xl transition-shadow m-1">
                      <Collapsible>
                        <CollapsibleTrigger className="flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-t-md">
                          <span className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg">
                            Technical
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center"
                          >
                            <ChevronsUpDown className="h-4 w-4 transition-transform" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 bg-gray-50">
                          <DataTableCrewUpload
                            data={detailTechnical}
                            columns={columnsDetail}
                            modalContent={
                              <UploadPhotoForm
                                onClose={() => {}}
                                onSave={() => {}}
                                id={0}
                                idHeader={Number(id)}
                                idList={idListTechnical}
                              />
                            }
                            onClose={() => handleCloseDetail()}
                            onSaveData={() => handleSaveDetail()}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                    <div className="rounded-md border bg-white shadow-lg hover:shadow-xl transition-shadow m-1">
                      <Collapsible>
                        <CollapsibleTrigger className="flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-t-md">
                          <span className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg">
                            Marine
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center"
                          >
                            <ChevronsUpDown className="h-4 w-4 transition-transform" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 bg-gray-50">
                          <Card>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3"></div>
                          </Card>
                          <DataTableCrewUpload
                            data={detailMarine}
                            columns={columnsDetail}
                            modalContent={
                              <UploadPhotoForm
                                onClose={() => {}}
                                onSave={() => {}}
                                id={0}
                                idHeader={Number(id)}
                                idList={idListMarine}
                              />
                            }
                            onClose={() => handleCloseDetail()}
                            onSaveData={() => handleSaveDetail()}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </div>
                </>
              </TabsContent>
              <TabsContent value="barge">
                <>
                  <div style={{ height: "70vh", overflowY: "auto" }}>
                    <div className="rounded-md border bg-white shadow-lg hover:shadow-xl transition-shadow m-1">
                      <Collapsible>
                        <CollapsibleTrigger className="flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-t-md">
                          <span className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg">
                            General
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center"
                          >
                            <ChevronsUpDown className="h-4 w-4 transition-transform" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 bg-gray-50">
                          <Card>
                            <CardHeader>
                              <CardTitle>Score Ship Section</CardTitle>
                              <CardContent>
                                <DataTableCrewAssessmentResults
                                  data={detailShipsectionBarge}
                                  columns={columnsDetailShipsection}
                                />
                              </CardContent>
                            </CardHeader>
                          </Card>
                          <Card className="mt-2">
                            <CardHeader>
                              <CardTitle>Score Assessment</CardTitle>
                              <CardContent>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-2">
                                  <Card className="p-2">
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="totalScoreGeneralVslMate">
                                        Sum of item scores Barge{" "}
                                        {dataVslMate?.vslName}
                                      </Label>
                                      <Input
                                        type="number"
                                        id="gradeTotalVslMate"
                                        placeholder="gradeTotalVslMate"
                                        value={getValues("gradeTotalVslMate")}
                                        readOnly
                                      />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="totalScoreGeneralVslMate">
                                        Total Item Barge {dataVslMate?.vslName}
                                      </Label>
                                      <Input
                                        type="number"
                                        id="totalItemVslMate"
                                        placeholder="totalItemVslMate"
                                        value={getValues("totalItemVslMate")}
                                        readOnly
                                      />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="totalScoreGeneralVslMate">
                                        Score Barge {dataVslMate?.vslName}
                                      </Label>
                                      <Input
                                        type="number"
                                        id="scoreGeneralBarge"
                                        placeholder="Score General Barge"
                                        value={getValues("scoreGeneralBarge")}
                                        readOnly
                                      />
                                    </div>
                                    {/* <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="totalScoreGeneralVslMate">
                                        Total Score Barge {dataVslMate?.vslName}
                                      </Label>
                                      <Input
                                        type="number"
                                        id="totalScoreGeneral"
                                        placeholder="Total Score General"
                                        value={totalScoreGeneralItemBarge}
                                        readOnly
                                      />
                                    </div>
                                    {dataVslMate ? (
                                      <>
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                          <Label htmlFor="totalScoreGeneralVslMate">
                                            Total Score Vessel{" "}
                                            {getValues("vslName")}
                                          </Label>
                                          <Input
                                            type="number"
                                            id="totalScoreGeneralVslMate"
                                            placeholder="Total Score General"
                                            value={totalScoreGeneralItem}
                                            readOnly
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <></>
                                    )}

                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="averageScoreGeneral">
                                        Average Score
                                      </Label>
                                      <Input
                                        type="number"
                                        id="averageScoreGeneral"
                                        placeholder="Average Score General"
                                        value={averageScoreGeneral}
                                        readOnly
                                      />
                                    </div> */}
                                  </Card>
                                  <Card className="p-2">
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="totalScoreGeneral">
                                        sum of item scores Vessel{" "}
                                        {getValues("vslName")}
                                      </Label>
                                      <Input
                                        type="number"
                                        id="gradeTotalVslName"
                                        placeholder="gradeTotalVslName"
                                        value={getValues("gradeTotalVslName")}
                                        readOnly
                                      />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="totalScoreGeneral">
                                        Total Item Vessel {getValues("vslName")}
                                      </Label>
                                      <Input
                                        type="number"
                                        id="totalItemVslName"
                                        placeholder="totalItemVslName"
                                        value={getValues("totalItemVslName")}
                                        readOnly
                                      />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="totalScoreGeneralVslMate">
                                        Score Vessel {getValues("vslName")}
                                      </Label>
                                      <Input
                                        type="number"
                                        id="scoreGeneralVessel"
                                        placeholder="Score General Vessel"
                                        value={getValues("scoreGeneralVessel")}
                                        readOnly
                                      />
                                    </div>
                                    {/* <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="downtimeDayGeneral">
                                        Downtime Day General
                                      </Label>
                                      <Input
                                        type="number"
                                        id="downtimeDayGeneral"
                                        placeholder="Downtime Day General"
                                        value={downtimeDayGeneral}
                                        readOnly
                                      />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="downtimeGeneral">
                                        Downtime General
                                      </Label>
                                      <Input
                                        type="number"
                                        id="downtimeGeneral"
                                        placeholder="Downtime General"
                                        value={downtimeGeneral}
                                        readOnly
                                      />
                                    </div> */}
                                  </Card>
                                  <Card className="p-2">
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="averageScoreGeneral">
                                        Total Score
                                      </Label>
                                      <Input
                                        type="number"
                                        id="averageScoreGeneral"
                                        placeholder="Average Score General"
                                        value={averageScoreGeneral}
                                        readOnly
                                      />
                                    </div>
                                    {/*  <div className="grid w-full max-w-sm items-center gap-1.5">
                                      <Label htmlFor="finalScoreGeneral">
                                        Final Score General
                                      </Label>
                                      <Input
                                        type="number"
                                        id="finalScoreGeneral"
                                        placeholder="Final Score General"
                                        value={finalScoreGeneral}
                                        readOnly
                                      />
                                    </div> */}
                                  </Card>
                                </div>
                              </CardContent>
                            </CardHeader>
                          </Card>
                          <DataTableCrewUpload
                            data={detailGeneralBarge}
                            columns={columnsDetail}
                            modalContent={
                              <UploadPhotoForm
                                onClose={() => {}}
                                onSave={() => {}}
                                id={0}
                                idHeader={Number(id)}
                                idList={idListGeneral}
                              />
                            }
                            onClose={() => handleCloseDetail()}
                            onSaveData={() => handleSaveDetail()}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                    <div className="rounded-md border bg-white shadow-lg hover:shadow-xl transition-shadow m-1">
                      <Collapsible>
                        <CollapsibleTrigger className="flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-t-md">
                          <span className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg">
                            Technical
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center"
                          >
                            <ChevronsUpDown className="h-4 w-4 transition-transform" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 bg-gray-50">
                          <DataTableCrewUpload
                            data={detailTechnicalBarge}
                            columns={columnsDetail}
                            modalContent={
                              <UploadPhotoForm
                                onClose={() => {}}
                                onSave={() => {}}
                                id={0}
                                idHeader={Number(id)}
                                idList={idListTechnical}
                              />
                            }
                            onClose={() => handleCloseDetail()}
                            onSaveData={() => handleSaveDetail()}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                    <div className="rounded-md border bg-white shadow-lg hover:shadow-xl transition-shadow m-1">
                      <Collapsible>
                        <CollapsibleTrigger className="flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-t-md">
                          <span className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg">
                            Marine
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center"
                          >
                            <ChevronsUpDown className="h-4 w-4 transition-transform" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 bg-gray-50">
                          <Card>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3"></div>
                          </Card>
                          <DataTableCrewUpload
                            data={detailMarineBarge}
                            columns={columnsDetail}
                            modalContent={
                              <UploadPhotoForm
                                onClose={() => {}}
                                onSave={() => {}}
                                id={0}
                                idHeader={Number(id)}
                                idList={idListMarine}
                              />
                            }
                            onClose={() => handleCloseDetail()}
                            onSaveData={() => handleSaveDetail()}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </div>
                </>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DialogViewVesselAssessment;
