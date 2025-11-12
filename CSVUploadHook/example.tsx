import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useCsvUpload, CsvParseResult } from './useCsvUpload';

const Example = () => {
  const [parsedData, setParsedData] = useState<CsvParseResult | null>(null);
  const [uploadResponse, setUploadResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    pickAndParseCsv,
    pickAndUploadCsv,
    isUploading,
    uploadProgress,
  } = useCsvUpload({
    onUploadSuccess: (response) => {
      console.log('Upload successful:', response);
      setUploadResponse(response.data);
      setError(null);
    },
    onUploadError: (error) => {
      console.error('Upload error:', error);
      setError(error?.response?.data?.message || 'Upload failed');
    },
    onProgress: (progress) => {
      console.log(`Upload progress: ${progress.percentage}%`);
    },
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  const handlePickAndParse = async () => {
    setError(null);
    setParsedData(null);
    const result = await pickAndParseCsv();
    if (result) {
      setParsedData(result);
    } else {
      setError('Failed to parse CSV file');
    }
  };

  const handlePickAndUpload = async () => {
    setError(null);
    setUploadResponse(null);
    try {
      await pickAndUploadCsv('https://your-api-endpoint.com/upload', {
        userId: '123',
        category: 'import',
      });
    } catch (err) {
      // Error is handled by onUploadError callback
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>CSV Upload Hook Example</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Pick & Parse CSV"
            onPress={handlePickAndParse}
            disabled={isUploading}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Pick & Upload CSV"
            onPress={handlePickAndUpload}
            disabled={isUploading}
          />
        </View>

        {isUploading && (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="large" />
            {uploadProgress && (
              <Text style={styles.progressText}>
                Uploading: {uploadProgress.percentage}%
              </Text>
            )}
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}

        {parsedData && (
          <View style={styles.dataContainer}>
            <Text style={styles.sectionTitle}>Parsed CSV Data</Text>
            <Text style={styles.infoText}>
              Headers: {parsedData.headers.length}
            </Text>
            <Text style={styles.infoText}>
              Total Rows: {parsedData.totalRows}
            </Text>
            <Text style={styles.subtitle}>Headers:</Text>
            <Text style={styles.dataText}>
              {parsedData.headers.join(', ')}
            </Text>
            <Text style={styles.subtitle}>First 3 Rows:</Text>
            {parsedData.rows.slice(0, 3).map((row, index) => (
              <View key={index} style={styles.rowContainer}>
                <Text style={styles.dataText}>
                  Row {index + 1}: {JSON.stringify(row, null, 2)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {uploadResponse && (
          <View style={styles.dataContainer}>
            <Text style={styles.sectionTitle}>Upload Response</Text>
            <Text style={styles.dataText}>
              {JSON.stringify(uploadResponse, null, 2)}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  dataContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  dataText: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  rowContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
});

export default Example;

