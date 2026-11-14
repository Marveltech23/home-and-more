import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, Laptop, Link2, RefreshCw, Loader2 } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { useToast } from './Toast';

export default function ImageUploadInput({
  value,
  onChange,
  label = 'Image',
  helpText = 'Upload a photo directly from your Mac, phone, or computer.',
  aspectRatio = 'aspect-[16/10]',
  presets = [],
  required = false,
  className = '',
}) {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [mode, setMode] = useState('device'); // 'device' | 'url'
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  const processFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast({ message: 'Please select a valid image file (PNG, JPG, WEBP)', type: 'error' });
      return;
    }

    setIsProcessing(true);
    try {
      // Compress and optimize image to fit effortlessly in localStorage and load fast
      const compressedDataUrl = await compressImage(file, 1400, 0.82);
      const estSizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

      setFileName(file.name);
      setFileSize(`${estSizeKb} KB (Optimized)`);
      onChange(compressedDataUrl, file);
      addToast({ message: `Image "${file.name}" ready and optimized!`, type: 'success' });
    } catch (err) {
      console.warn('Compression fallback', err);
      // Fallback to FileReader if canvas compression encounters an issue
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target.result, file);
        setFileName(file.name);
        addToast({ message: `Image "${file.name}" loaded!`, type: 'success' });
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = () => {
    onChange('', null);
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#24150F]">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        <div className="flex items-center gap-1 bg-[#FFFAF5] p-0.5 rounded-xl border border-[#F0DFD1] text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode('device')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              mode === 'device'
                ? 'bg-[#F36B0A] text-white shadow-xs'
                : 'text-[#82746B] hover:text-[#24150F]'
            }`}
          >
            <Laptop className="w-3 h-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              mode === 'url'
                ? 'bg-[#F36B0A] text-white shadow-xs'
                : 'text-[#82746B] hover:text-[#24150F]'
            }`}
          >
            <Link2 className="w-3 h-3" />
            <span>Web Link</span>
          </button>
        </div>
      </div>

      {/* 1. DEVICE UPLOAD DROPZONE */}
      {mode === 'device' ? (
        <div className="space-y-2">
          {/* Hidden native input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {isProcessing ? (
            <div className="border border-[#F0DFD1] rounded-2xl p-6 text-center bg-[#FFFAF5] flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 text-[#F36B0A] animate-spin" />
              <span className="text-xs font-semibold text-[#24150F]">Optimizing image from device...</span>
            </div>
          ) : value ? (
            /* Image loaded preview */
            <div className="relative rounded-2xl overflow-hidden border border-[#F0DFD1] bg-[#FFFAF5] p-2.5 flex items-center gap-4">
              <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 border border-[#F0DFD1] bg-white">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center gap-1 text-emerald-700 font-bold mb-0.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Image Selected</span>
                </div>
                {fileName ? (
                  <p className="font-semibold text-[#24150F] truncate">{fileName}</p>
                ) : (
                  <p className="font-semibold text-[#24150F] truncate">Current Image</p>
                )}
                {fileSize && <p className="text-[11px] text-[#82746B]">{fileSize}</p>}

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F36B0A] hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Choose another file</span>
                  </button>
                  <span className="text-stone-300">|</span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    <X className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty drag & drop file picker */
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                dragActive
                  ? 'border-[#F36B0A] bg-[#FFF3EA]'
                  : 'border-[#F0DFD1] bg-white hover:border-[#F36B0A] hover:bg-[#FFFAF5]'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] text-[#F36B0A] flex items-center justify-center shadow-xs">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs sm:text-sm font-bold text-[#24150F]">
                  Click to browse or drag &amp; drop an image
                </p>
                <p className="text-[11px] text-[#82746B] mt-0.5">
                  Select image directly from your Mac, phone, or computer (PNG, JPG, WEBP)
                </p>
              </div>

              <button
                type="button"
                className="mt-1 px-4 py-1.5 rounded-full bg-[#F8EBDD] text-[#F36B0A] text-xs font-bold hover:bg-[#F36B0A] hover:text-white transition-colors"
              >
                Browse Files
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 2. URL INPUT FALLBACK */
        <div className="space-y-2">
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value, null)}
            placeholder="https://images.unsplash.com/... or paste image URL"
            className="w-full px-4 py-2.5 rounded-xl border border-[#F0DFD1] text-xs sm:text-sm focus:outline-none focus:border-[#F36B0A]"
          />
          {value && (
            <div className="w-20 h-14 rounded-lg overflow-hidden border border-[#F0DFD1]">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {/* Preset Pickers (if provided) */}
      {presets && presets.length > 0 && (
        <div className="pt-1">
          <span className="text-[11px] font-semibold text-[#82746B] block mb-1">
            Or pick from catalog presets:
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {presets.map((preset, idx) => {
              const url = typeof preset === 'string' ? preset : preset.url || preset.desktop;
              const label = typeof preset === 'object' ? preset.label : null;
              const isSelected = value === url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(url, null)}
                  className={`shrink-0 rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                    isSelected ? 'border-[#F36B0A] ring-2 ring-[#F36B0A]/20 scale-105' : 'border-[#F0DFD1] opacity-70 hover:opacity-100'
                  }`}
                  title={label || `Preset ${idx + 1}`}
                >
                  <img src={url} alt="" className="w-12 h-10 object-cover rounded-lg" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {helpText && <p className="text-[11px] text-[#82746B]">{helpText}</p>}
    </div>
  );
}
