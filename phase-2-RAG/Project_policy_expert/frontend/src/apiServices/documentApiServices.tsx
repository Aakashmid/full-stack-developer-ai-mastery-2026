import type { Category } from "@/types";
import apiClient from "@/utils/apiClient";

// /types/document.ts

export type GetDocumentsResponse = {
  categorized: Category[];
  uncategorized: Document[];
};

// upload document with optional category

// if return processed false - try again

export const UploadDocument = async (
  file: File,
  category?: number,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (category) {
      formData.append("category", category.toString());
    }
    await apiClient.post("/documents/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    throw new Error("Failed to upload document");
  }
};

// get documents with categorized and uncategorized separation
export const getDocuments = async (): Promise<GetDocumentsResponse> => {
  try {
    const res = await apiClient.get("/documents/");

    // Your API wraps data inside array → fix that
    const data = res.data?.[0];
    return {
      categorized: data.categorized || [],
      uncategorized: data.uncategorized || [],
    };
  } catch (error) {
    throw new Error("Failed to fetch documents");
  }
};

// create category
export const createCategory = async (name: string): Promise<Category> => {
  try {
    const res = await apiClient.post("/categories/", { name });
    return res.data;
  } catch (error) {
    throw new Error("Failed to create category");
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await apiClient.get("/categories/");
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};
