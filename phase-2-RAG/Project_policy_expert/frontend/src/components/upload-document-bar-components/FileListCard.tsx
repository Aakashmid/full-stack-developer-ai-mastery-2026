import React from "react";

type FileItem = {
  id: string;
  name: string;
};

type Props = {
  title?: string;
  files: FileItem[];
  onClickFile?: (file: FileItem) => void;
};

const FileListCard: React.FC<Props> = ({
  title = "Uncategorized",
  files,
  onClickFile,
}) => {
  return (
    <div className="w-full max-w-md rounded-2xl bg-surface">
      {/* Header */}
      <h2 className="text-primary  font-semibold mb-2">{title}</h2>

      {/* List */}
      <div className="doc-collection">
        {files.map((file) => (
          <div
            key={file.id}
            onClick={() => onClickFile?.(file)}
            className="flex items-center gap-3 p-2.5 cursor-pointer "
          >
            {/* Icon */}
            <div className="">
              <img
                src="/images/pdf-symbol.png"
                className="object cover w-4 h-5"
                alt=""
              />
            </div>

            {/* File Name */}
            <p className="text-sm truncate grow">{file.name}</p>
            <input type="checkbox" name="" id="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileListCard;
