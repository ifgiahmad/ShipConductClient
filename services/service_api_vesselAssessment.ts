import api from "@/lib/api";
import { TrVesselAssessment } from "@/lib/types/TrVesselAssessment.types";
import { AxiosResponse } from "axios";

interface SaveVesselAssessmentResponse {
  returnId: any;
  status: number;
  data: {
    returnId: number;
  };
}

export const getTrVesselAssessment = async (): Promise<
  TrVesselAssessment[]
> => {
  const response = await api.get<TrVesselAssessment[]>(
    "api/vesselAssessment/getVesselAssessment"
  );
  return response.data;
};

export const getTrVesselAssessmentById = async (
  id: number
): Promise<TrVesselAssessment> => {
  const response = await api.get<TrVesselAssessment>(
    `api/vesselAssessment/getVesselAssessmentById?Id=${id}`
  );
  return response.data;
};

export const generateReportVesselAssessmentById = async (id: number) => {
  try {
    const response = await api.get(
      `api/vesselAssessment/generateReportVesselAssessmentById?id=${id}`,
      {
        responseType: "blob", // Penting! Agar menerima file sebagai blob
      }
    );
    console.log(response);
    // Ambil nama file dari response header jika tersedia
    const contentDisposition = response.headers["content-disposition"];
    console.log(contentDisposition);
    let fileName = "Vessel_Report.xlsx";

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match?.length) {
        fileName = match[1];
      }
    }

    // Buat URL dari blob
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    // Buat elemen anchor untuk mengunduh file
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    // Hapus elemen setelah diunduh
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};

/* export const generateReportVesselAssessment = async (
  docType: string,
  month: number,
  year: number
) => {
  try {
    const response = await api.get(
      `api/vesselAssessment/generateReportVesselAssessment?docType=${docType}&month=${month}&year=${year}`,
      {
        responseType: "blob", // Penting! Agar menerima file sebagai blob
      }
    );
    // Ambil nama file dari response header jika tersedia
    const contentDisposition = response.headers["content-disposition"];
    let fileName = "Vessel_Report.xlsx";

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match?.length) {
        fileName = match[1];
      }
    }

    // Buat URL dari blob
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    // Buat elemen anchor untuk mengunduh file
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    // Hapus elemen setelah diunduh
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
}; */

export const generateReportVesselAssessment = async (
  docType: string,
  month: number,
  year: number
) => {
  try {
    const response = await api.get(
      `api/vesselAssessment/generateReportVesselAssessment?docType=${docType}&month=${month}&year=${year}`,
      {
        responseType: "blob", // Menerima file sebagai blob
      }
    );

    if (!response || !response.data) {
      return { status: 500, message: "No response data received." };
    }

    // Ambil nama file dari response header jika tersedia
    const contentDisposition = response.headers["content-disposition"];
    let fileName = "Vessel_Report.xlsx";

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match?.length) {
        fileName = match[1];
      }
    }

    // Buat URL dari blob
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    // Buat elemen anchor untuk mengunduh file
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    // Hapus elemen setelah diunduh
    link.remove();
    window.URL.revokeObjectURL(url);

    // Pastikan function mengembalikan response
    return { status: 200, message: "Success", fileName };
  } catch (error: any) {
    console.error("Error generating report:", error);

    return {
      status: error.response?.status || 500,
      message: error.message || "Unknown error",
    };
  }
};

export const getTrVesselAssessmentByLink = async (
  link: string
): Promise<TrVesselAssessment> => {
  const response = await api.get<TrVesselAssessment>(
    `api/vesselAssessment/getVesselAssessmentByLink?Link=${link}`
  );
  return response.data;
};

export const getTrVesselAssessmentByNameAndPeriod = async (
  vslName: string,
  month: number,
  year: number
): Promise<TrVesselAssessment> => {
  const response = await api.get<TrVesselAssessment>(
    `api/vesselAssessment/getVesselAssessmentByNameAndPeriod?vslName=${vslName}&month=${month}&year=${year}`
  );
  return response.data;
};

export const saveTrVesselAssessment = async (
  item: Partial<TrVesselAssessment>
): Promise<AxiosResponse<SaveVesselAssessmentResponse>> => {
  try {
    console.log(item);
    const response = await api.post<SaveVesselAssessmentResponse>(
      `api/vesselAssessment/saveVesselAssessment`,
      item
    );
    return response;
  } catch (error) {
    console.error("Error saving Vessel Assessment:", error);
    throw error;
  }
};
