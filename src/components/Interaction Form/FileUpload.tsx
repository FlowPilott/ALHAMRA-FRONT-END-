import React, { useState, useRef, ChangeEvent } from 'react';

interface FileUploadProps {
  initialFileName?: string;
  initialFileSize?: string;
  accept?: string;
  name: string;
  onFileChange: (name: string, file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  initialFileName = '',
  initialFileSize = '',
  accept,
  name,
  onFileChange,
}) => {
  const [fileDetails, setFileDetails] = useState({
    fileName: initialFileName,
    fileSize: initialFileSize,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSvgClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const sizeInKB = (file.size / 1024).toFixed(2) + ' KB';
      setFileDetails({
        fileName: file.name,
        fileSize: sizeInKB,
      });

      if (onFileChange) {
        onFileChange(name, file);
      }
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileDetails({
      fileName: '',
      fileSize: '',
    });
  
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  
    if (onFileChange) {
      onFileChange(name, null);
    }
  };

  return (
    <div
      className="flex w-full cursor-pointer items-center gap-[8px] border-[1px] border-[#ccc] bg-white px-[8px] py-[6px] text-[#1C1C1C] hover:border-[#B2282F] md:px-[12px] md:py-[10px]"
      onClick={handleSvgClick}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept={accept}
        onChange={handleFileUpload}
      />

      {/* SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="42"
        height="42"
        viewBox="0 0 42 42"
        fill="none"
      >
        <circle cx="21" cy="21" r="21" fill="#FBF4F5" />
        <path
          d="M19.3333 19.75H20.1666C20.4027 19.75 20.6007 19.6702 20.7604 19.5104C20.9201 19.3507 21 19.1528 21 18.9167V18.0834C21 17.8472 20.9201 17.6493 20.7604 17.4896C20.6007 17.3299 20.4027 17.25 20.1666 17.25H18.9166C18.8055 17.25 18.7083 17.2917 18.625 17.375C18.5416 17.4584 18.5 17.5556 18.5 17.6667V21C18.5 21.1111 18.5416 21.2084 18.625 21.2917C18.7083 21.375 18.8055 21.4167 18.9166 21.4167C19.0277 21.4167 19.125 21.375 19.2083 21.2917C19.2916 21.2084 19.3333 21.1111 19.3333 21V19.75ZM19.3333 18.9167V18.0834H20.1666V18.9167H19.3333ZM23.5 21.4167C23.7361 21.4167 23.934 21.3368 24.0937 21.1771C24.2534 21.0174 24.3333 20.8195 24.3333 20.5834V18.0834C24.3333 17.8472 24.2534 17.6493 24.0937 17.4896C23.934 17.3299 23.7361 17.25 23.5 17.25H22.25C22.1388 17.25 22.0416 17.2917 21.9583 17.375C21.875 17.4584 21.8333 17.5556 21.8333 17.6667V21C21.8333 21.1111 21.875 21.2084 21.9583 21.2917C22.0416 21.375 22.1388 21.4167 22.25 21.4167H23.5ZM22.6666 20.5834V18.0834H23.5V20.5834H22.6666ZM26 19.75H26.4166C26.5277 19.75 26.625 19.7084 26.7083 19.625C26.7916 19.5417 26.8333 19.4445 26.8333 19.3334C26.8333 19.2222 26.7916 19.125 26.7083 19.0417C26.625 18.9584 26.5277 18.9167 26.4166 18.9167H26V18.0834H26.4166C26.5277 18.0834 26.625 18.0417 26.7083 17.9584C26.7916 17.875 26.8333 17.7778 26.8333 17.6667C26.8333 17.5556 26.7916 17.4584 26.7083 17.375C26.625 17.2917 26.5277 17.25 26.4166 17.25H25.5833C25.4722 17.25 25.375 17.2917 25.2916 17.375C25.2083 17.4584 25.1666 17.5556 25.1666 17.6667V21C25.1666 21.1111 25.2083 21.2084 25.2916 21.2917C25.375 21.375 25.4722 21.4167 25.5833 21.4167C25.6944 21.4167 25.7916 21.375 25.875 21.2917C25.9583 21.2084 26 21.1111 26 21V19.75ZM17.6666 26C17.2083 26 16.8159 25.8368 16.4895 25.5104C16.1632 25.184 16 24.7917 16 24.3334V14.3334C16 13.875 16.1632 13.4827 16.4895 13.1563C16.8159 12.8299 17.2083 12.6667 17.6666 12.6667H27.6666C28.125 12.6667 28.5173 12.8299 28.8437 13.1563C29.1701 13.4827 29.3333 13.875 29.3333 14.3334V24.3334C29.3333 24.7917 29.1701 25.184 28.8437 25.5104C28.5173 25.8368 28.125 26 27.6666 26H17.6666ZM17.6666 24.3334H27.6666V14.3334H17.6666V24.3334ZM14.3333 29.3334C13.875 29.3334 13.4826 29.1702 13.1562 28.8438C12.8298 28.5174 12.6666 28.125 12.6666 27.6667V16.8334C12.6666 16.5972 12.7465 16.3993 12.9062 16.2396C13.0659 16.0799 13.2638 16 13.5 16C13.7361 16 13.934 16.0799 14.0937 16.2396C14.2534 16.3993 14.3333 16.5972 14.3333 16.8334V27.6667H25.1666C25.4027 27.6667 25.6007 27.7465 25.7604 27.9063C25.9201 28.066 26 28.2639 26 28.5C26 28.7361 25.9201 28.934 25.7604 29.0938C25.6007 29.2535 25.4027 29.3334 25.1666 29.3334H14.3333Z"
          fill="#B2282F"
        />
      </svg>

      {/* File Info */}
      <div className="flex items-center justify-center">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-[#1C1C1C]">
            {fileDetails.fileName || 'Upload File'}
          </div>
          <div className="text-xs text-[#6E6D6D]">
            {fileDetails.fileSize || ''}
          </div>
        </div>
        {fileDetails.fileSize && (
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
