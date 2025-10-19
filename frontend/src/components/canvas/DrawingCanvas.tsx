
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { Eraser, Pen, Redo, RotateCcw, Save, Undo } from "lucide-react";
import Tesseract from "tesseract.js";

export default function DrawingCanvas() {
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

  // "Save" now triggers recognition first. We try HW API; if unavailable, we export PNG and use Tesseract.
  async function handleSave() {
    // 1) Prefer on-device handwriting recognition (strokes → text)
    if (recognizerRef.current) {
      const hw = await recognizeFromStrokes();
      if (hw) return; // got text already
    }

    // 2) Fallback: export PNG and run Tesseract on the rasterized image
    const dataURL = await canvasRef.current?.exportImage("png");
    if (dataURL) {
      await runOCR(dataURL);
      // If you still want to download the PNG, uncomment:
      // const link = Object.assign(document.createElement('a'), {
      //   href: dataURL, download: 'sketch.png', style: { display: 'none' }
      // });
      // document.body.appendChild(link); link.click(); link.remove();
    }
  }

  return (
    <div className="mt-6 flex max-w-2xl gap-4">
      <ReactSketchCanvas
        width="100%"
        height="430px"
        ref={canvasRef}
        strokeColor={strokeColor}
        canvasColor="transparent"
        className="!rounded-2xl !border-purple-500 dark:!border-purple-800"
      />

      <div className="flex flex-col items-center gap-y-6 divide-y divide-purple-200 py-4 dark:divide-purple-900">
        {/* Color picker */}
        <button type="button" onClick={() => colorInputRef.current?.click()} style={{ backgroundColor: strokeColor }}>
          <input
            type="color"
            ref={colorInputRef}
            className="sr-only"
            value={strokeColor}
            onChange={handleStrokeColorChange}
          />
        </button>

        {/* Drawing mode */}
        <div className="flex flex-col gap-3 pt-6">
          <button type="button" disabled={!eraseMode} onClick={handlePenClick}><Pen size={16} /></button>
          <button type="button" disabled={eraseMode} onClick={handleEraserClick}><Eraser size={16} /></button>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-6">
          <button type="button" onClick={handleUndoClick}><Undo size={16} /></button>
          <button type="button" onClick={handleRedoClick}><Redo size={16} /></button>
          <button type="button" onClick={handleClearClick}><RotateCcw size={16} /></button>

          {/* Run recognition (HW API if available → Tesseract fallback) */}
          <button type="button" onClick={handleSave} disabled={busy}>
            <Save size={16} />
          </button>
        </div>

        {/* Result panel */}
        <div className="pt-6 text-xs w-44 whitespace-pre-wrap select-text">
          {busy ? "Recognizing…" : recognizedText || "—"}
          {avgConfidence != null && <div className="opacity-70 mt-2">avg conf: {Math.round(avgConfidence)}%</div>}
        </div>
      </div>
    </div>
  );
}