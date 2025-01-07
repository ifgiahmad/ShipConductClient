"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  createTrVesselAssessmentDto,
  createTrVesselAssessmentZod,
} from "@/lib/types/TrVesselAssessment.types";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrVesselAssessmentDetail } from "@/lib/types/TrVesselAssessmentDetail.types";
import DataTableAssessmentGradeLow from "@/components/Data-Table/data-table-assessmentGradeLow";
import UploadPhotoForm from "@/components/form/upload-photo-form";
import {
  getPreviousLastVesselAssessmentByVslCodeForCrew,
  getPreviousVesselAssessmentDetailLowForCrew,
  getTrVesselAssessmentDetailForCrew,
} from "@/services/service_api_vesselAssessmentForCrew";
import { getVesselCrew } from "@/services/service_api_viewCrewingForCrew";

const AssessmentGradeLowForm = () => {
  const router = useRouter();
  const { idPelaut, ktp } = useParams();
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
      vslCode: "",
    },
  });
  const [detail, setDetail] = useState<TrVesselAssessmentDetail[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [month, setMonth] = useState<string | undefined>();
  const [year, setYear] = useState<number | undefined>();
  const [periodDate, setPeriodDate] = useState<Date | undefined>();
  const [finalDate, setFinalDate] = useState<Date | undefined>();
  const [isOutOfPeriod, setIsOutOfPeriod] = useState(false);

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { toast } = useToast();
  const [id, setId] = useState<number | null>(null);
  const [vesselName, setVesselName] = useState<string | null>(null);
  const [idList, setIdList] = useState<number[]>([]);

  const columnsDetail = [
    { header: "Item", accessorKey: "item" },
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
      if (idPelaut && ktp) {
        const vslCode = await getVesselCrew(idPelaut as string, ktp as string);
        if (vslCode) {
          const data = await getPreviousLastVesselAssessmentByVslCodeForCrew(
            vslCode
          );
          setPeriodDate(
            data.periodDate ? new Date(data.periodDate) : undefined
          );
          setFinalDate(data.finalDate ? new Date(data.finalDate) : undefined);
          setVesselName(data.vslName ?? "");
          setId(data.id ?? 0);
          if (data.periodDate) {
            // Check if periodDate is a string and convert it to a Date object
            const periodDate =
              typeof data.periodDate === "string"
                ? new Date(data.periodDate)
                : data.periodDate;

            const tahun = periodDate.getFullYear();
            const bulan = periodDate.getMonth(); // Get the zero-indexed month
            setYear(tahun);
            setMonth(monthNames[bulan]); // Set month as the corresponding string
          } else {
            console.error("periodDate tidak ada");
            setYear(0); // Set year to 0 or take other appropriate action
            setMonth(undefined); // Set month to undefined if periodDate is not available
          }
        }
      } else {
        console.error("Invalid Id Pelaut:", idPelaut, " And KTP:", ktp);
      }
    };
    fetchData();
    fetchDetail();
    setBaseUrl(`${window.location.protocol}//${window.location.host}/`);
  }, [id, setId, setVesselName, setMonth, setYear, setValue, setStatus]);

  const fetchDetail = async () => {
    const dataDetail = await getPreviousVesselAssessmentDetailLowForCrew(
      Number(id)
    );
    const ids = dataDetail.map((detail: { id: number }) => detail.id);
    setIdList(ids);
    const groupedData = dataDetail.reduce((acc, item) => {
      const section = item.shipSection ?? "Unknown";
      (acc[section] = acc[section] || []).push(item);
      return acc;
    }, {} as Record<string, TrVesselAssessmentDetail[]>);

    setDetail(dataDetail);
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
        </Card>
      </div>

      <>
        <div style={{ height: "70vh", overflowY: "auto" }}>
          <Card>
            <CardHeader>
              <CardTitle>Low Value Assessment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTableAssessmentGradeLow
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
            </CardContent>
          </Card>
        </div>
      </>
    </>
  );
};

export default AssessmentGradeLowForm;
