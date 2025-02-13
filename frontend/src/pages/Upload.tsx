import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon } from 'lucide-react';

export function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/*': ['.txt', '.md'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    }
  });

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    // Add your upload logic here
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-yellow-400 border-4 border-black rounded-lg p-8 shadow-brutal">
        <h1 className="text-4xl font-black text-black">Upload Content</h1>
        <p className="text-xl font-bold text-black mt-2">
          Upload your content for AI-powered analysis
        </p>
      </div>

      <div className="bg-white border-4 border-black rounded-lg shadow-brutal p-8">
        <div
          {...getRootProps()}
          className={`border-4 border-dashed border-black rounded-lg p-12 text-center cursor-pointer
            ${isDragActive ? 'bg-yellow-100' : 'bg-gray-50'}`}
        >
          <input {...getInputProps()} />
          <UploadIcon className="w-16 h-16 mx-auto mb-4 text-black" />
          <p className="text-xl font-bold text-black mb-2">
            {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
          </p>
          <p className="text-gray-600 font-medium">
            or click to select a file
          </p>
        </div>

        {file && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Selected File:</h3>
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-black">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-600">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-4 px-6 py-3 bg-blue-400 rounded-lg border-2 border-black font-bold
                hover:-translate-y-1 hover:shadow-brutal-sm transition-transform disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Analyze Content'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 