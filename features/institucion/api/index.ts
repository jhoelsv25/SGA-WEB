import { apiClient } from "@/lib/api-client";
import type { Institucion, UpdateInstitucionPayload } from "../types";

export async function getInstitucion(): Promise<Institucion> {
  const response = await apiClient.get<Institucion>("/institucion");
  return response.data;
}

export async function updateInstitucion(payload: UpdateInstitucionPayload): Promise<Institucion> {
  const response = await apiClient.patch<Institucion>("/institucion", payload);
  return response.data;
}

export async function uploadInstitucionLogo(
  file: File,
): Promise<{ logoUrl: string; message: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<{ logoUrl: string; message: string }>(
    "/institucion/logo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
}
