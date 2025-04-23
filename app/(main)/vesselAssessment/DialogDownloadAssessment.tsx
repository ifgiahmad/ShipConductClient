import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { generateReportVesselAssessment } from "@/services/service_api_vesselAssessment";

interface DownloadAssessmentFormProps {
  onClose: () => void;
  onSave: () => void;
}

const DialogDownloadVesselAssessment = ({
  onClose,
  onSave,
}: DownloadAssessmentFormProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  const months = [
    { label: "Januari", value: "1" },
    { label: "Februari", value: "2" },
    { label: "Maret", value: "3" },
    { label: "April", value: "4" },
    { label: "Mei", value: "5" },
    { label: "Juni", value: "6" },
    { label: "Juli", value: "7" },
    { label: "Agustus", value: "8" },
    { label: "September", value: "9" },
    { label: "Oktober", value: "10" },
    { label: "November", value: "11" },
    { label: "Desember", value: "12" },
  ];

  const [formData, setFormData] = useState<{
    documentType: string;
    month: number | null;
    year: number | null;
  }>({
    documentType: "",
    month: null,
    year: null,
  });

  /*  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Mencegah reload halaman

    const { documentType, month, year } = formData; // Ambil data dari state

    if (!documentType || !month || !year) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select all fields before downloading.",
      });
      return;
    }

    try {
      const ret = await generateReportVesselAssessment(
        documentType,
        month,
        year
      );
      if (ret.status === 200) {
        onSave();
        toast({ description: "Success to export data" });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to export data",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Error exporting data: " +
          (err instanceof Error ? err.message : "Unknown error"),
      });
    }
  }; */

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { documentType, month, year } = formData;

    if (!documentType || month === null || year === null) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select all fields before downloading.",
      });
      return;
    }

    try {
      const result = await generateReportVesselAssessment(
        documentType,
        month,
        year
      );

      // Pastikan result tidak undefined sebelum mengakses status
      if (!result) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unexpected error: No result returned from API.",
        });
        return;
      }

      if (result.status === 200) {
        onSave();
        toast({
          variant: "default",
          description: `Success to export data: ${result.fileName}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to export data: ${result.message}`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Unexpected error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-sm mx-auto p-4 border rounded-lg shadow-md"
    >
      {/* Document Type */}
      <Select
        onValueChange={(value) =>
          setFormData({ ...formData, documentType: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Type Document" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="LINK ASSESSMENT">Link Assessment</SelectItem>
          <SelectItem value="PERCENTAGE UPLOAD">Percentage Upload</SelectItem>
          <SelectItem value="ASSESSMENT RESULTS">Assessment Results</SelectItem>
          <SelectItem value="DRILL RESULTS">Drill Results</SelectItem>
          <SelectItem value="BREAKDOWN SCORE VESSEL">
            Breakdown Score Vessel
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Month */}
      <Select
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, month: parseInt(value, 10) }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Period Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value.toString()}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year */}
      <Select
        onValueChange={(value) =>
          setFormData({ ...formData, year: parseInt(value, 10) })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Period Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-green-900 hover:bg-green-600">
        Download
      </Button>
    </form>
  );
};

export default DialogDownloadVesselAssessment;
