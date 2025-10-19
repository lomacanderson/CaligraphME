
import { useRef, useState, type ChangeEvent } from 'react'

import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef
} from 'react-sketch-canvas'

import { Eraser, Pen, Redo, RotateCcw, Undo } from 'lucide-react'

interface DrawingCanvasProps {
  onSubmit: (imageData: string) => void;
  submitButtonText?: string;
}

export function DrawingCanvas({ onSubmit, submitButtonText = "Submit" }: DrawingCanvasProps) {
  const colorInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<ReactSketchCanvasRef>(null)
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [eraseMode, setEraseMode] = useState(false)

  function handleStrokeColorChange(event: ChangeEvent<HTMLInputElement>) {
    setStrokeColor(event.target.value)
    console.log(strokeColor)
  }

  function handleEraserClick() {
    setEraseMode(true)
    canvasRef.current?.eraseMode(true)
  }

  function handlePenClick() {
    setEraseMode(false)
    canvasRef.current?.eraseMode(false)
  }

  function handleUndoClick() {
    canvasRef.current?.undo()
  }

  function handleRedoClick() {
    canvasRef.current?.redo()
  }

  function handleClearClick() {
    canvasRef.current?.clearCanvas()
  }

  async function handleSubmit() {
    const dataURL = await canvasRef.current?.exportImage('png')
    if (dataURL) {
      onSubmit(dataURL);
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
      </div>
    </div>
  )
}