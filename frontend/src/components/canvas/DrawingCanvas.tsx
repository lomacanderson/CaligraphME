
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef
} from 'react-sketch-canvas'

import { Eraser, Pen, Redo, RotateCcw, Undo } from "lucide-react";
import Tesseract from "tesseract.js";

interface DrawingCanvasProps {
  onSubmit: (imageData: string, extractedText?: string, confidence?: number) => void;
  submitButtonText?: string;
}

export function DrawingCanvas({ onSubmit, submitButtonText = "Submit" }: DrawingCanvasProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  // NEW: store recognizer and output
  const recognizerRef = useRef<any>(null);
  const [recognizedText, setRecognizedText] = useState<string>(""); // result text
  const [avgConfidence, setAvgConfidence] = useState<number | null>(null);     // for Tesseract fallback
  const [busy, setBusy] = useState(false);

  const [strokeColor, setStrokeColor] = useState("#000000");
  const [eraseMode, setEraseMode] = useState(false);

  // Init handwriting recognizer if available on this browser/OS
  useEffect(() => {
    (async () => {
      if ("createHandwritingRecognizer" in navigator) {
        try {
          recognizerRef.current = await (navigator as any).createHandwritingRecognizer({
            languages: ["en"], // change to your BCP-47 tag(s)
          });
        } catch {
          recognizerRef.current = null;
        }
      }
    })();
  }, []);

  function handleStrokeColorChange(event: ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;        // log the new value (setState is async)
    setStrokeColor(val);
    console.log(val);
  }

  function handleEraserClick() {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  }
  function handlePenClick() {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  }
  function handleUndoClick() { canvasRef.current?.undo(); }
  function handleRedoClick() { canvasRef.current?.redo(); }
  function handleClearClick() { canvasRef.current?.clearCanvas(); setRecognizedText(""); setAvgConfidence(null); }

  // ---- NEW: Handwriting API path ----
  async function recognizeFromStrokes() {
    if (!recognizerRef.current) return null;

    setBusy(true);
    try {
      // Get strokes from ReactSketchCanvas
      const paths = await canvasRef.current?.exportPaths();
      // Start a drawing session
      const drawing = recognizerRef.current.startDrawing({
        recognitionType: "text",   // 'text' | 'email' | 'number' | 'character'
        alternatives: 2,
      });

      // Convert each path to [{x,y}, ...] and add to recognizer
      // react-sketch-canvas paths look like: { paths: [{x,y}, ...], strokeWidth, strokeColor, ... }
      for (const p of paths ?? []) {
        const pts = (p.paths ?? p.paths ?? [])  // some versions call it paths, others points
          .map((pt: any) => ({ x: pt.x, y: pt.y }));
        if (pts.length) drawing.addStroke(pts);
      }

      const result = await drawing.getRecognitionResult();
      const text = result?.text ?? "";
      setRecognizedText(text);
      return text;
    } finally {
      setBusy(false);
    }
  }

  // ---- NEW: Fallback with Tesseract (runs on PNG) ----
  async function runOCR(dataURLorUrl: string) {
    setBusy(true);
    try {
      const { data } = await Tesseract.recognize(dataURLorUrl, "eng");
      setRecognizedText(data.text ?? "");
      setAvgConfidence(typeof data.confidence === "number" ? data.confidence : null);
      return data.text;
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit() {
    const dataURL = await canvasRef.current?.exportImage('png')
    if (dataURL) {
      console.log('🖼️ Canvas exported as PNG');
      
      // First, try to recognize text using OCR
      let extractedText = '';
      let confidence = 0;
      
      // Try handwriting API first (if available)
      if (recognizerRef.current) {
        console.log('✍️ Using browser handwriting recognition...');
        const hwText = await recognizeFromStrokes();
        if (hwText) {
          extractedText = hwText;
          confidence = 0.95; // Handwriting API typically has high confidence
          console.log('✅ Handwriting API result:', extractedText);
        }
      }
      
      // Fallback to Tesseract OCR if handwriting API didn't work
      if (!extractedText) {
        console.log('📸 Fallback to Tesseract OCR...');
        const ocrText = await runOCR(dataURL);
        extractedText = ocrText || '';
        confidence = avgConfidence ? avgConfidence / 100 : 0.5;
        console.log('✅ Tesseract OCR result:', extractedText, 'confidence:', confidence);
      }
      
      // Pass both the image and extracted text to parent
      onSubmit(dataURL, extractedText, confidence);
      
      // Clear canvas after submission
      canvasRef.current?.clearCanvas();
    }
  }

  return (
    <div className="drawing-canvas-container">
      <div className="canvas-wrapper">
        <ReactSketchCanvas
          width='100%'
          height='200px'
          ref={canvasRef}
          strokeColor={strokeColor}
          strokeWidth={4}
          canvasColor='white'
          className='drawing-canvas'
        />
      </div>

      <div className="canvas-controls">
        <div className="tool-group">
          <button
            type='button'
            className={`tool-btn ${!eraseMode ? 'active' : ''}`}
            onClick={handlePenClick}
            title="Pen"
          >
            <Pen size={20} />
          </button>
          <button
            type='button'
            className={`tool-btn ${eraseMode ? 'active' : ''}`}
            onClick={handleEraserClick}
            title="Eraser"
          >
            <Eraser size={20} />
          </button>
          <button
            type='button'
            className="color-picker-btn"
            onClick={() => colorInputRef.current?.click()}
            style={{ backgroundColor: strokeColor }}
            title="Pick Color"
          >
            <input
              type='color'
              ref={colorInputRef}
              className='color-input'
              value={strokeColor}
              onChange={handleStrokeColorChange}
            />
          </button>
        </div>

        <div className="tool-group">
          <button
            type='button'
            className="tool-btn"
            onClick={handleUndoClick}
            title="Undo"
          >
            <Undo size={20} />
          </button>
          <button
            type='button'
            className="tool-btn"
            onClick={handleRedoClick}
            title="Redo"
          >
            <Redo size={20} />
          </button>
          <button
            type='button'
            className="tool-btn"
            onClick={handleClearClick}
            title="Clear"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <button
          type='button'
          className="btn-primary submit-btn"
          onClick={handleSubmit}
        >
          {submitButtonText}
        </button>
            {/* Result panel */}
            <div className="pt-6 text-xs w-44 whitespace-pre-wrap select-text">
                {busy ? "Recognizing…" : recognizedText || "—"}
                {avgConfidence != null && <div className="opacity-70 mt-2">avg conf: {Math.round(avgConfidence)}%</div>}
            </div>
      </div>
    </div>
  );
}
