/**
 * 📊 useCsvUpload Hook - Handles CSV file upload and parsing.
 * 
 * This hook is used to upload a CSV file to a server.
 * It is used to pick a CSV file from the device, parse the file, and upload the file to the server.
 * 
 * @returns {Object} - An object containing the functions to pick a CSV file, parse a CSV file, upload a CSV file, and pick and parse a CSV file.
 * @returns {boolean} - A boolean indicating whether the file is being uploaded.
 * @returns {Object} - An object containing the progress of the upload.
 * @returns {number} - The number of rows in the CSV file.
 * @returns {number} - The number of columns in the CSV file.
 * @returns {number} - The number of rows in the CSV file.
 */


import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
import axios from "axios";

export type CsvFile = {
  uri: string;
  name: string;
  size: number;
  mimeType: string;
};

export type CsvRow = {
  [key: string]: string;
};

export type CsvParseResult = {
  headers: string[];
  rows: CsvRow[];
  totalRows: number;
};

export type UploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
};

interface UseCsvUploadOptions {
  onUploadSuccess?: (response: any) => void;
  onUploadError?: (error: any) => void;
  onProgress?: (progress: UploadProgress) => void;
  maxFileSize?: number; // in bytes, default 10MB
  allowedMimeTypes?: string[];
}

export const useCsvUpload = (options?: UseCsvUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );

  const {
    onUploadSuccess,
    onUploadError,
    onProgress,
    maxFileSize = 10 * 1024 * 1024, // 10MB default
    allowedMimeTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "text/comma-separated-values",
      "application/csv",
    ],
  } = options || {};

  // Pick CSV file
  const pickCsvFile = async (): Promise<CsvFile | null> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedMimeTypes,
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return null;
      }

      const file = result.assets[0];
      
      // Validate file size
      if (file.size && file.size > maxFileSize) {
        const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
        console.log(`File size exceeds ${maxSizeMB}MB limit`);
        return null;
      }

      // Validate file type
      if (file.mimeType && !allowedMimeTypes.includes(file.mimeType)) {
        console.log("Please select a valid CSV file");
        return null;
      }

      const csvFile: CsvFile = {
        uri: file.uri,
        name: file.name || "file.csv",
        size: file.size || 0,
        mimeType: file.mimeType || "text/csv",
      };

      console.log("CSV File Selected:", csvFile);
      return csvFile;
    } catch (error) {
      console.log("CSV Picker Error:", error);
      return null;
    }
  };

  // Parse CSV file content
  const parseCsvFile = async (file: CsvFile): Promise<CsvParseResult | null> => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(file.uri);
      
      if (!fileContent || fileContent.trim().length === 0) {
        console.log("CSV file is empty");
        return null;
      }

      // Split by newlines
      const lines = fileContent.split(/\r?\n/).filter((line) => line.trim().length > 0);
      
      if (lines.length === 0) {
        console.log("CSV file has no data");
        return null;
      }

      // Parse headers (first line)
      const headers = lines[0]
        .split(",")
        .map((header) => header.trim().replace(/^"|"$/g, ""));

      if (headers.length === 0) {
        console.log("CSV file has no headers");
        return null;
      }

      // Parse rows
      const rows: CsvRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i]
          .split(",")
          .map((value) => value.trim().replace(/^"|"$/g, ""));
        
        if (values.length === 0 || values.every((v) => !v)) {
          continue; // Skip empty rows
        }

        const row: CsvRow = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });
        rows.push(row);
      }

      const result: CsvParseResult = {
        headers,
        rows,
        totalRows: rows.length,
      };

      console.log("CSV Parsed:", {
        headers: result.headers.length,
        rows: result.totalRows,
      });

      return result;
    } catch (error) {
      console.log("CSV Parse Error:", error);
      console.log("Failed to parse CSV file");
      return null;
    }
  };

  // Upload CSV file to server
  const uploadCsvFile = async (
    file: CsvFile,
    endpoint: string,
    additionalData?: { [key: string]: any }
  ): Promise<any> => {
    try {
      setIsUploading(true);
      setUploadProgress(null);

      // Create FormData
      const formData = new FormData();
      
      // Add file
      const fileName = file.name || "file.csv";
      const fileExtension = fileName.split(".").pop() || "csv";
      const fileType = file.mimeType || "text/csv";

      formData.append("file", {
        uri: file.uri,
        name: fileName,
        type: fileType,
      } as any);

      // Add additional data if provided
      if (additionalData) {
        Object.keys(additionalData).forEach((key) => {
          formData.append(key, String(additionalData[key]));
        });
      }

      // Upload with progress tracking
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              ),
            };
            setUploadProgress(progress);
            if (onProgress) {
              onProgress(progress);
            }
          }
        },
      });

      setIsUploading(false);
      setUploadProgress(null);

      if (onUploadSuccess) {
        onUploadSuccess(response);
      }

      return response;
    } catch (error: any) {
      setIsUploading(false);
      setUploadProgress(null);

      console.log("CSV Upload Error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload CSV file";
      console.log(errorMessage);

      if (onUploadError) {
        onUploadError(error);
      }

      throw error;
    }
  };

  // Complete workflow: Pick, Parse, and optionally Upload
  const pickAndParseCsv = async (): Promise<CsvParseResult | null> => {
    const file = await pickCsvFile();
    if (!file) return null;

    return await parseCsvFile(file);
  };

  const pickAndUploadCsv = async (
    endpoint: string,
    additionalData?: { [key: string]: any }
  ): Promise<any> => {
    const file = await pickCsvFile();
    if (!file) return null;

    return await uploadCsvFile(file, endpoint, additionalData);
  };

  return {
    pickCsvFile,
    parseCsvFile,
    uploadCsvFile,
    pickAndParseCsv,
    pickAndUploadCsv,
    isUploading,
    uploadProgress,
  };
};

