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
import { getTrVesselAssessmentByNameAndPeriod } from "@/services/service_api_vesselAssessment";

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
      mode: "",
    },
  });
  const [detail, setDetail] = useState<TrVesselAssessmentDetail[]>([]);
  const [detailGeneral, setDetailGeneral] = useState<
    TrVesselAssessmentDetail[]
  >([]);
  const [detailMarine, setDetailMarine] = useState<TrVesselAssessmentDetail[]>(
    []
  );
  const [detailTechnical, setDetailTechnical] = useState<
    TrVesselAssessmentDetail[]
  >([]);
  const [status, setStatus] = useState<string | null>(null);
  const [month, setMonth] = useState<string | undefined>();
  const [year, setYear] = useState<number | undefined>();

  const [totalScoreTechnicalItem, setTotalScoreTechnicalItem] = useState<
    number | undefined
  >();
  const [totalScoreMarineItem, setTotalScoreMarineItem] = useState<
    number | undefined
  >();

  const [totalScoreGeneralItem, setTotalScoreGeneralItem] = useState<
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

  const {
    setValue,
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
      accessorKey: "normalFileLink",
      cell: ({ row }: { row: { original: TrVesselAssessmentDetail } }) => (
        <div style={{ textAlign: "center" }}>
          {row.original.smallFileLink && (
            <img
              src={row.original.normalFileLink}
              alt=""
              style={{
                width: "2000px",
                height: "auto",
                cursor: "pointer",
                marginBottom: "8px",
              }}
              onClick={() =>
                handleImageSampleClick(row.original.normalFileLink || "")
              }
            />
          )}
        </div>
      ),
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

        const dataVslMate = await getTrVesselAssessmentByNameAndPeriod(
          data.vslMate || "",
          data.month || 0,
          data.year || 0
        );
        setDataVslMate(dataVslMate);

        if (dataVslMate) {
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
            <>
              <div style={{ height: "70vh", overflowY: "auto" }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Card>
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
                              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <Card className="p-2">
                                  <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="totalScoreGeneral">
                                      Total Score
                                    </Label>
                                    <Input
                                      type="number"
                                      id="totalScoreGeneral"
                                      placeholder="Total Score General"
                                      value={totalScoreGeneralItem}
                                      readOnly
                                    />
                                  </div>
                                  <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="totalScoreGeneralVslMate">
                                      Total Score Vessel {dataVslMate?.vslName}
                                    </Label>
                                    <Input
                                      type="number"
                                      id="totalScoreGeneralVslMate"
                                      placeholder="Total Score General"
                                      value={totalScoreGeneralItemVslMate}
                                      readOnly
                                    />
                                  </div>
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
                                  </div>
                                </Card>
                                <Card className="p-2">
                                  <div className="grid w-full max-w-sm items-center gap-1.5">
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
                                  </div>
                                </Card>
                                <Card className="p-2">
                                  <div className="grid w-full max-w-sm items-center gap-1.5">
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
                                  </div>
                                </Card>
                              </div>
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
                            <Card>
                              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <Card className="p-2">
                                  <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="totalScoreTechnical">
                                      Total Score
                                    </Label>
                                    <Input
                                      type="number"
                                      id="totalScoreTechnical"
                                      placeholder="Total Score Tchnical"
                                      value={totalScoreTechnicalItem}
                                      readOnly
                                    />
                                  </div>
                                  <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="totalScoreTechnicalVslMate">
                                      Total Score Vessel {dataVslMate?.vslName}
                                    </Label>
                                    <Input
                                      type="number"
                                      id="totalScoreTechnicalVslMate"
                                      placeholder="Total Score Tchnical"
                                      value={totalScoreTechnicalItemVslMate}
                                      readOnly
                                    />
                                  </div>
                                  <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="averageScoreTechnical">
                                      Average Score
                                    </Label>
                                    <Input
                                      type="number"
                                      id="averageScoreTechnical"
                                      placeholder="Average Score Technical"
                                      value={averageScoreTechnical}
                                      readOnly
                                    />
                                  </div>
                                </Card>
                                <Card className="p-2">
                                  <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="finalScoreTechnical">
                                      Final Score
                                    </Label>
                                    <Input
                                      type="number"
                                      id="finalScoreTechnical"
                                      placeholder="Final Score Technical"
                                      value={finalScoreTechnical}
                                      readOnly
                                    />
                                  </div>
                                </Card>
                              </div>
                            </Card>
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
                              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <Card className="p-2">
                                  <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="totalScoreMarine">
                                      Total Score
                                    </Label>
                                    <Input
                                      type="number"
                                      id="totalScoreMarine"
                                      placeholder="Total Score Marine"
                                      value={totalScoreMarineItem}
                                      readOnly
                                    />
                                  </div>
                                  <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="totalScoreMarineVslMate">
                                      Total Score Vessel {dataVslMate?.vslName}
                                    </Label>
                                    <Input
                                      type="number"
                                      id="totalScoreMarineVslMate"
                                      placeholder="Total Score Marine"
                                      value={totalScoreMarineItemVslMate}
                                      readOnly
                                    />
                                  </div>
                                  <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="averageScoreMarine">
                                      Average Score Marine
                                    </Label>
                                    <Input
                                      type="number"
                                      id="averageScoreMarine"
                                      placeholder="Average Score Marine"
                                      value={averageScoreMarine}
                                      readOnly
                                    />
                                  </div>
                                </Card>
                                <Card className="p-2">
                                  <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="finalScoreMarine">
                                      Final Score Marine
                                    </Label>
                                    <Input
                                      type="number"
                                      id="finalScoreMarine"
                                      placeholder="Final Score Marine"
                                      value={finalScoreMarine}
                                      readOnly
                                    />
                                  </div>
                                </Card>
                              </div>
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
                    </Card>

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
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DialogViewVesselAssessment;
