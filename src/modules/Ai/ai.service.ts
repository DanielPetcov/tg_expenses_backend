import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import sharp from 'sharp'; // npm install sharp
import {
  analyzeReceiptSystemPrompt,
  analyzeReceiptUserPrompt,
} from './promts/analyzeReceipt.promt';
import { ReceiptResponse } from './models/receipt-response.model';

const MAX_DIMENSION = 1568; // Claude internally resizes to this anyway

@Injectable()
export class AiService {
  private readonly client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  async analyzeReceipt(imagePath: string): Promise<ReceiptResponse> {
    const imageBase64 = await this.prepareImage(imagePath);

    const response = await this.client.messages.create({
      model: 'claude-haiku-4-5-20251001', // cheaper model, sufficient for receipts
      max_tokens: 512, // JSON response is small
      system: analyzeReceiptSystemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: analyzeReceiptUserPrompt,
            },
          ],
        },
      ],
    });

    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('');

    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean) as ReceiptResponse;
  }

  private async prepareImage(imagePath: string): Promise<string> {
    const resized = await sharp(imagePath)
      .resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: 'inside', // keeps aspect ratio, doesn't upscale
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 }) // convert to JPEG and compress
      .toBuffer();

    return resized.toString('base64');
  }
}
