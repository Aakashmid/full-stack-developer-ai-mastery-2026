import { FolderUp } from "lucide-react";
import FileListCard from "./upload-document-bar-components/FileListCard";
import { useState } from "react";
import FileUploadForm from "./upload-document-bar-components/FileUploadForm";

const files = [
  { id: "1", name: "unit-3-notes.pdf" },
  { id: "2", name: "unit-3-notes.pdf" },
  { id: "3", name: "unit-3-notes.pdf" },
  { id: "4", name: "unit-3-notes.pdf" },
];

const UploadDocumentBar = () => {
  const [showUpload, setShowUpload] = useState<boolean>(false);
  // const [docs, setdocs] = useState(second)

  const handleOpenUploadForm = () => {
    // Logic to open the upload form goes here
    console.log("Open upload form");
  };

  return (
    <div className="flex flex-col min-h-0 flex-1   bg-surface rounded-2xl relative">
      {/* header */}
      <div className="p-4">
        <div className="header border-b border-textMuted ">
          <h1 className="font-semibold text-2xl ">Sources </h1>
          <div className="py-4">
            {showUpload ? (
              <FileUploadForm onclose={() => setShowUpload(false)} />
            ) : (
              <button
                className="primary-btn  flex items-center gap-2.5 justify-center"
                onClick={() => setShowUpload(true)}
              >
                <FolderUp className="h-6 w-6" />
                <p className="">Upload Document</p>
              </button>
            )}
          </div>

          <div className=""></div>
        </div>
      </div>

      {/* file list */}
      <div className=" flex flex-col gap-4  px-4 overflow-y-auto custom-scrollbar ">
        <FileListCard files={files} />
        <FileListCard files={files} />
        <FileListCard files={files} />
        <FileListCard files={files} />
        <FileListCard files={files} />
      </div>
    </div>
  );
};

export default UploadDocumentBar;
