import React, { useState, useRef } from 'react';
import { exportBookmarks, importBookmarks } from '../services/bookmarkService';

interface ImportExportProps {
  userId: string;
  onImportComplete?: () => void;
}

const ImportExport: React.FC<ImportExportProps> = ({ userId, onImportComplete }) => {
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setImportError(null);
    
    try {
      const jsonData = await exportBookmarks(userId);
      
      // Create a download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bookmark-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting bookmarks', error);
      setImportError('Failed to export bookmarks. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);
    
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonData = event.target?.result as string;
          await importBookmarks(userId, jsonData);
          if (onImportComplete) {
            onImportComplete();
          }
        } catch (error) {
          console.error('Error importing bookmarks', error);
          setImportError('Failed to import bookmarks. Make sure the file is a valid JSON export.');
        } finally {
          setIsImporting(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error reading file', error);
      setImportError('Failed to read the file. Please try again.');
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors duration-200"
        >
          {isExporting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export Bookmarks
            </span>
          )}
        </button>
        
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            id="import-file"
            accept=".json"
            className="sr-only"
            onChange={handleFileChange}
            disabled={isImporting}
          />
          <label
            htmlFor="import-file"
            className={`w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 inline-block text-center cursor-pointer transition-colors duration-200 ${
              isImporting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isImporting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Import Bookmarks
              </span>
            )}
          </label>
        </div>
      </div>
      
      {importError && (
        <div className="text-sm text-red-400 bg-red-900/30 p-2 rounded-md">
          {importError}
        </div>
      )}
      
      <div className="text-xs text-gray-400 mt-2">
        <p>Export creates a JSON file with all your bookmarks and categories.</p>
        <p className="mt-1">Import accepts JSON files previously exported from this app.</p>
      </div>
    </div>
  );
};

export default ImportExport; 