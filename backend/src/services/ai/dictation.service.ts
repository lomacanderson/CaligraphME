import { ElevenLabsClient } from 'elevenlabs';
import * as dotenv from 'dotenv';
import { createWriteStream } from 'fs';
import { Readable } from 'stream'; 

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const dictationService = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export const textToAudio = async (
    text: string, 
    fileName: string, 
    voice: string = 'JBFqnCBsd6RMkjVDRZzb'): 
    Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const audio = await dictationService.textToSpeech.convert(voice, {
        modelId: 'eleven_multilingual_v2',
        text,
        outputFormat: 'mp3_44100_128',
        // Optional voice speed setting
        voiceSettings: {
          speed: 1.0,
        },
      });

      const fileStream = createWriteStream(fileName);
      Readable.fromWeb(audio).pipe(fileStream);

      fileStream.on('finish', () => resolve(fileName)); // Resolve with the fileName
      fileStream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};
