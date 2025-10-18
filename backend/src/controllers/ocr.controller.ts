import { Request, Response } from 'express';
import { OCRService } from '../services/ocr.service.js';

export class OCRController {
  static async processImage(req: Request, res: Response) {
    try {
      // TODO: Implement OCR processing
      const result = await OCRService.processImage(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to process image' });
    }
  }

  static async svgToText(req: Request, res: Response) {
    try {
      // TODO: Implement SVG to text conversion
      const result = await OCRService.svgToText(req.body.svgData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to convert SVG to text' });
    }
  }
}

