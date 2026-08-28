import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Sparkles, Folder, ExternalLink } from 'lucide-react';
import { KOTLIN_PROJECT_FILES, KotlinFile } from '../data/kotlinProjectFiles';

interface KotlinCodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KotlinCodeViewerModal: React.FC<KotlinCodeViewerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = KOTLIN_PROJECT_FILES[selectedFileIndex] || KOTLIN_PROJECT_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const element = document.createElement('a');
    const file = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = currentFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
                Código Kotlin &amp; Jetpack Compose para Android Studio
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                  Material 3
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Estructura completa y comentada lista para compilar como prototipo nativo.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: File Selector + Code Viewer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-64 bg-slate-950/80 border-r border-slate-800 p-3 overflow-y-auto custom-scrollbar space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-indigo-400" />
              Archivos del Proyecto (.kt)
            </div>

            {KOTLIN_PROJECT_FILES.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
                  selectedFileIndex === idx
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-800 text-indigo-400">
                  KT
                </span>
                <span className="truncate">{file.name}</span>
              </button>
            ))}

            <div className="mt-4 p-3 rounded-2xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <p className="font-semibold text-slate-300 mb-1">💡 ¿Cómo usarlo en Android Studio?</p>
              <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                <li>Crea un proyecto <strong className="text-slate-300">Empty Activity (Compose)</strong>.</li>
                <li>Copia estos archivos en tu paquete <code className="text-indigo-300">com.soportetecnico.app</code>.</li>
                <li>¡Ejecuta en tu emulador o teléfono Android!</li>
              </ol>
            </div>
          </div>

          {/* Main Code Viewer */}
          <div className="flex-1 flex flex-col bg-slate-950/90 overflow-hidden">
            {/* Active file toolbar */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-white">{currentFile.name}</span>
                <span className="text-[11px] text-slate-500 font-mono hidden sm:inline truncate">
                  {currentFile.path}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 border border-slate-700/60"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar código</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-indigo-600/30 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </button>
              </div>
            </div>

            {/* Description Banner */}
            <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/60 text-[11px] text-slate-400">
              {currentFile.description}
            </div>

            {/* Code container */}
            <div className="flex-1 p-4 overflow-auto custom-scrollbar bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed">
              <pre className="text-slate-300 select-all whitespace-pre font-mono">
                {currentFile.code}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
