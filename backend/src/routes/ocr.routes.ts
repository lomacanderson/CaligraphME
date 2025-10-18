import { Router } from 'express';
import { OCRController } from '../controllers/ocr.controller.js';

export const router = Router();

// POST /api/ocr/process - Process image/canvas and extract text
router.post('/process', OCRController.processImage);

// POST /api/ocr/svg-to-text - Convert SVG to text
router.post('/svg-to-text', OCRController.svgToText);

