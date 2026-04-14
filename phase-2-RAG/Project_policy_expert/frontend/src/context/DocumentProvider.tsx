import { getDocuments } from "@/apiServices/documentApiServices";
import type { Category } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type DocumentContextType = {
  categories: Category[];
  categorizedDocs: Record<number, Document[]>; // categoryId → docs
  uncategorizedDocs: Document[];
  loading: boolean;
  error: string | null;
};

// ================= CONTEXT =================

const DocumentContext = createContext<DocumentContextType | null>(null);

// ================= PROVIDER =================
export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]); // both categories and that category's docs
  const [uncategorizedDocs, setUncategorizedDocs] = useState<Document[]>([]); // docs without category

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ================= FETCH =================
  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const data = await getDocuments();

      setCategories(data.categorized);
      // uncategorized
      setUncategorizedDocs(data.uncategorized || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        categories,
        uncategorizedDocs,
        loading,
        error,
        fetchDocuments,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

// ================= HOOK =================

export const useDocuments = () => {
  const ctx = useContext(DocumentContext);
  if (!ctx) {
    throw new Error("useDocuments must be used within DocumentProvider");
  }
  return ctx;
};
