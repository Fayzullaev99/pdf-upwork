import { useState, createRef } from 'react';
import { readAsPDF } from '../utils/asyncReader';

const handlers = {
  pdf: async (file) => {
    console.log(file);
    try {
      const pdf = await readAsPDF(file);
      console.log(pdf);
      return {
        file,
        name: file.name,
        pages: Array(pdf.numPages)
          .fill(0)
          .map((_, index) => pdf.getPage(index + 1)),
      };
    } catch (error) {
      console.error('Failed to load pdf', error);
      throw new Error('Failed to load PDF');
    }
  },
};

export const useUploader = ({ use, afterUploadPdf }) => {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = createRef();

  const onClick = (event) => {
    // Reset the value to allow selecting the same file again if needed
    event.currentTarget.value = '';
  };

  const handleClick = () => {
    const input = inputRef.current;

    if (input) {
      setIsUploading(true);
      input.click();
    }
  };

  const upload = async (event) => {
    if (!isUploading) {
      return;
    }

    const files = event.currentTarget.files || (event.dataTransfer && event.dataTransfer.files);
    if (!files) {
      setIsUploading(false);
      return;
    }

    const file = files[0];

    try {
      const result = await handlers[use](file);

      if (use === 'pdf' && afterUploadPdf) {
        afterUploadPdf(result);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    upload,
    onClick,
    inputRef,
    isUploading,
    handleClick,
  };
};
