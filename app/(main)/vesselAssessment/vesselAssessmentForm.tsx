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
  getMsAssessmentCategoryById,
  saveMsAssessmentCategory,
} from "@/services/service_api";
import { useToast } from "@/hooks/use-toast";
import {
  saveMsAssessmentCategoryDto,
  saveMsAssessmentCategoryZod,
} from "@/lib/types/MsAssessmentCategory.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Terminal, Trash } from "lucide-react";
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
import { createTrVesselAssessmentZod } from "@/lib/types/TrVesselAssessment.types";
import { createTrVesselAssessmentDto } from "../../../lib/types/TrVesselAssessment.types";
import {
  getTrVesselAssessmentById,
  saveTrVesselAssessment,
} from "@/services/service_api_vesselAssessment";

type dataModel = z.infer<typeof createTrVesselAssessmentZod>;

interface TrVesselAssessmentFormProps {
  onClose: () => void;
  onSave: () => void;
  id: number;
  mode: string;
}

const TrVesselAssessmentForm = ({
  onClose,
  onSave,
  id,
  mode,
}: TrVesselAssessmentFormProps) => {
  const { toast } = useToast();

  const methods = useForm<createTrVesselAssessmentDto>({
    resolver: zodResolver(createTrVesselAssessmentZod),
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
      gradeTotal: 0,
      mode: "",
      vslCode: "",
    },
  });

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (Number(id) > 0) {
      getDataById(Number(id));
    } else {
      setValue("mode", "CREATE");
    }
    async function getDataById(Id: number) {
      try {
        const data = await getTrVesselAssessmentById(Id);
        setValue("vslName", data.vslName ?? "");
        setValue("vslType", data.vslType ?? "");
        setValue("vslCode", data.vslCode ?? "");
        setValue("linkShared", data.linkShared ?? "");
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
      } catch (err) {
        console.error(err);
      }
    }
  }, [id, setValue]);

  const onSubmit: SubmitHandler<dataModel> = async (data) => {
    data.mode = mode;
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
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6"
      >
        {mode === "CANCEL" ? (
          <Alert>
            <Trash className="h-4 w-4" />
            <AlertTitle>Cancel Data!</AlertTitle>
            <AlertDescription>
              Are you sure you want to cancel this data?
            </AlertDescription>
          </Alert>
        ) : (
          <></>
        )}
        <div className="flex justify-end mt-4">
          <Button type="button" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" className="ml-3 bg-red-700">
            Ok
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default TrVesselAssessmentForm;
