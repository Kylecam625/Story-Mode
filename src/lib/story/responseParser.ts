import { logger } from '../logger';
import type { StoryResponse, StorySegment } from './types';

function cleanResponse(content: string): string {
  // Extract JSON content from markdown code blocks or use raw content
  const jsonMatch = content.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
  const cleaned = jsonMatch ? jsonMatch[1].trim() : content.trim();
  
  return cleaned;
}

export function parseStoryResponse(content: string): StoryResponse {
  try {
    if (!content?.trim()) {
      throw new Error('Empty response content');
    }

    const cleanedContent = cleanResponse(content);
    
    let parsed;
    try {
      parsed = JSON.parse(cleanedContent);
    } catch (error) {
      logger.error('Failed to parse JSON:', {
        content: cleanedContent,
        error
      });
      throw new Error('Invalid JSON structure in response');
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Response must be a valid JSON object');
    }

    if (!Array.isArray(parsed.segments)) {
      throw new Error('Response must contain a segments array');
    }

    if (parsed.segments.length === 0) {
      throw new Error('Response must contain at least one segment');
    }

    const segments: StorySegment[] = parsed.segments.map((segment: { narration: string; dialogue?: { character: string; gender?: string; text: string; }[] }) => ({
      narration: segment.narration.trim(),
      dialogue: segment.dialogue?.map((line: { character: string; gender?: string; text: string; }) => ({
        character: line.character.trim(),
        gender: line.gender,
        text: line.text.trim()
      })) || []
    }));

    return {
      segments,
      decisions: parsed.decisions || [],
      characters: parsed.characters || []
    };
  } catch (error) {
    logger.error('Failed to parse story response:', error);
    throw error;
  }
}