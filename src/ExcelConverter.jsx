import React, { useState } from 'react';
import excelToMarkdown from './excelToMarkdown';

const ExcelConverter = () => {
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setConverting(true);
    setError('');

    try {
      const markdown = await excelToMarkdown(file);
      
      // Create and trigger download
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.[^/.]+$/, '') + '.md';
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to convert file: ' + err.message);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Excel to Markdown Converter</h2>
        <p className="text-gray-600">Convert Excel files to Obsidian-compatible Markdown tables</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="sr-only">Choose Excel file</span>
          <div className="mt-2">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                disabled:opacity-50"
              disabled={converting}
            />
          </div>
        </label>

        {converting && (
          <div className="text-center text-gray-600">
            Converting...
          </div>
        )}

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelConverter;