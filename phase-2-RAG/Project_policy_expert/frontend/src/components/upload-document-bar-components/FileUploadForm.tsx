import {
  UploadDocument,
  createCategory,
} from "@/apiServices/documentApiServices";
import { useDocuments } from "@/context/DocumentProvider";
import { useState } from "react";

export default function FileUploadForm({ onclose }: { onclose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const { categories } = useDocuments();

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await createCategory(newCategory);
      setNewCategory("");
      setSelectedCategory(res.id);
    } catch (error) {}
  };

  const handleSubmit = async () => {
    if (!file) return alert("Select a file");

    // try {
    //   setLoading(true);
    //   await onUpload(file, selectedCategory || undefined);
    //   onClose();
    // } catch (err: any) {
    //   alert(err.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="bg-bg/20 p-4 rounded-xl w-full max-w-md text-white">
      <h2 className="text-lg font-semibold mb-4">Upload Document</h2>

      {/* File Input */}
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 rounded-lg bg-bg/30 px-2 py-1 w-full cursor-pointer"
      />

      {/* Category Select */}
      <select
        value={selectedCategory ?? ""}
        onChange={(e) => setSelectedCategory(Number(e.target.value))}
        className="input-style  mb-3  rounded-lg outline-none"
      >
        <option value="">Uncategorized</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Add Category */}
      <div className="flex gap-2 mb-4 w-full ">
        <input
          type="text"
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="p-2 min-w-0  bg-bg/40  rounded-lg py-1 px-2 outline-none"
        />
        <button onClick={handleAddCategory} className="add-file-btn">
          Add
        </button>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button onClick={onclose} className="close-upload-form">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="upload-btn"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
