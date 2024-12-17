import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  getMsShipSectionById,
  saveMsShipSection,
} from "@/services/service_api_shipSection";
import { useToast } from "@/hooks/use-toast";
import {
  saveMsShipSectionDto,
  saveMsShipSectionZod,
} from "@/lib/types/MsShipSection.types";
import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { MsCategorySection } from "@/lib/types/MsCategorySection";
import { getMsCategorySection } from "@/services/service_api_categorySection";

type DataModel = z.infer<typeof saveMsShipSectionZod>;

interface ShipSectionFormProps {
  onClose: () => void;
  onSave: () => void;
  id: number;
  mode: string;
}

const ShipSectionForm = ({
  onClose,
  onSave,
  id,
  mode,
}: ShipSectionFormProps) => {
  const { toast } = useToast();
  const [vesselType, setVesselType] = useState<MsVesselType[]>([]);
  const [selectedVesselType, setSelectedVesselType] = useState<
    string | undefined
  >();

  const [categorySection, setCategorySection] = useState<MsCategorySection[]>(
    []
  );
  const [selectedCategorySection, setSelectedCategorySection] = useState<
    string | undefined
  >();

  const [searchTerms, setSearchTerms] = useState({
    vessel: "",
    category: "",
  });

  const methods = useForm<saveMsShipSectionDto>({
    resolver: zodResolver(saveMsShipSectionZod),
    defaultValues: {
      id: Number(id),
      vslType: "",
      sectionName: "",
      categorySection: "",
      mode: "",
      isDeleted: false,
      categoryId: 0,
    },
  });

  const { setValue, control, handleSubmit } = methods;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [vesselData, categoryData, shipSection] = await Promise.all([
          getMsVesselType(),
          getMsCategorySection(),
          id > 0 ? getMsShipSectionById(id) : Promise.resolve(null),
        ]);
        console.log(shipSection);
        setVesselType(vesselData);
        setCategorySection(categoryData);

        if (shipSection) {
          setValue("vslType", shipSection.vslType ?? "");
          setValue("sectionName", shipSection.sectionName ?? "");
          setSelectedVesselType(shipSection.vslType ?? "");
          setSelectedCategorySection(shipSection.categorySection ?? "");
          setValue("categoryId", shipSection.categoryId ?? 0);
        } else {
          setValue("mode", "CREATE");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchAllData();
  }, [id, setValue]);

  const handleSearchChange = (type: string, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [type]: value }));
  };

  const fetchVessel = async () => {
    try {
      const vesselData = await getMsVesselType();
      setVesselType(vesselData);
    } catch (error) {
      console.error("Error fetching vessel and interval data:", error);
    }
  };

  const fetchCategorySection = async () => {
    try {
      const categorySection = await getMsCategorySection();
      console.log(categorySection);
      setCategorySection(categorySection);
    } catch (error) {
      console.error("Error fetching Category Section:", error);
    }
  };

  const onSubmit: SubmitHandler<DataModel> = async (data) => {
    console.log(data);
    data.mode = mode;
    try {
      const response = await saveMsShipSection(data);
      if (response.status === 200) {
        onSave();
        toast({ description: "Ship Section updated successfully." });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update data",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error updating data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6"
      >
        {mode === "DELETE" ? (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Delete Data!</AlertTitle>
            <AlertDescription>
              Are you sure you want to delete this data?
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <FormField
              control={control}
              name="vslType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vessel Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setSelectedVesselType(value);
                      setValue("vslType", value);
                    }}
                    value={selectedVesselType || field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Vessel Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          type="text"
                          placeholder="Search Vessel Type..."
                          value={searchTerms.vessel}
                          onChange={(e) =>
                            handleSearchChange("vessel", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      {vesselType
                        .filter((v) =>
                          v.keterangan
                            ?.toLowerCase()
                            .includes(searchTerms.vessel.toLowerCase())
                        )
                        .map((v) => (
                          <SelectItem key={v.vslType} value={v.vslType}>
                            {v.keterangan}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="categorySection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Section</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      setSelectedCategorySection(value);
                      setValue("categorySection", value);

                      // Cari dan tetapkan categoryId berdasarkan nilai yang dipilih
                      const selectedCategory = categorySection.find(
                        (v) => v.categorySection === value
                      );
                      if (selectedCategory) {
                        setValue("categoryId", selectedCategory.id);
                      }
                    }}
                    value={selectedCategorySection || field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Input Search */}
                      <div className="p-2">
                        <Input
                          type="text"
                          placeholder="Search Category Section..."
                          value={searchTerms.category || ""}
                          onChange={(e) =>
                            handleSearchChange("category", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>

                      {/* Filtered Items */}
                      {categorySection
                        ?.filter((v) =>
                          v.categorySection
                            ?.toLowerCase()
                            .includes(searchTerms.category?.toLowerCase() || "")
                        )
                        .map((v) => (
                          <SelectItem key={v.id} value={v.categorySection}>
                            {v.categorySection}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="sectionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Name</FormLabel>
                  <Input required placeholder="Enter Section Name" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            className="bg-green-900 hover:bg-green-700"
          >
            {mode === "DELETE" ? "Delete" : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
};

export default ShipSectionForm;
