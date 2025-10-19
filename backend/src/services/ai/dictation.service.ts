import { ElevenLabsClient } from 'elevenlabs';
import * as dotenv from 'dotenv';
import { createWriteStream } from 'fs';
import { Readable } from 'stream'; 

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

console.log('🔑 ElevenLabs API Key loaded:', ELEVENLABS_API_KEY ? 'YES ✅' : 'NO ❌');
console.log('🔑 API Key length:', ELEVENLABS_API_KEY?.length || 0);
console.log('🔑 API Key starts with:', ELEVENLABS_API_KEY?.substring(0, 10) || 'N/A');
console.log('🔑 Full key (first 20 chars):', ELEVENLABS_API_KEY?.substring(0, 20) || 'N/A');

if (!ELEVENLABS_API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY is not set in environment variables!');
  throw new Error('ELEVENLABS_API_KEY environment variable is required');
}

// Trim any whitespace that might be in the .env file
const trimmedKey = ELEVENLABS_API_KEY.trim();
console.log('🔑 After trim - length:', trimmedKey.length);

const dictationService = new ElevenLabsClient({
  apiKey: trimmedKey,
});

export const textToAudio = async (
    text: string, 
    fileName: string, 
    voice: string = 'JBFqnCBsd6RMkjVDRZzb'): 
    Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      console.log(`🎤 Generating audio for text: "${text.substring(0, 50)}..."`);
      
      const audio = await dictationService.textToSpeech.convertAsStream(voice, {
        model_id: 'eleven_multilingual_v2',
        text,
        output_format: 'mp3_44100_128',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      });

      const fileStream = createWriteStream(fileName);
      
      // Handle the audio stream
      if (audio instanceof ReadableStream) {
        Readable.fromWeb(audio as any).pipe(fileStream);
      } else {
        // @ts-ignore - handle different stream types
        audio.pipe(fileStream);
      }

      fileStream.on('finish', () => {
        console.log(`✅ Audio file saved: ${fileName}`);
        resolve(fileName);
      });
      
      fileStream.on('error', (err) => {
        console.error(`❌ Error writing audio file:`, err);
        reject(err);
      });
    } catch (error) {
      console.error('❌ ElevenLabs API error:', error);
      reject(error);
    }
  });
};
