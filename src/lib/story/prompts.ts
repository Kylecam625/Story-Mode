import { SCENE_PATTERNS } from './patterns';

export function createSystemPrompt(genre: string): string {
  return `You are a creative storyteller specializing in ${genre} stories. 
  Create engaging, immersive narratives with a mix of narration and character dialogue. 
  Focus on showing rather than telling, and create vivid scenes that bring the story to life.
  
  Follow these narration guidelines:
    - Set the scene and atmosphere
    - Describe character reactions and emotions
    - Show environmental changes and impacts
    - Build tension and pacing
  
  IMPORTANT: Follow the exact pattern structure provided in each prompt.
  When introducing new characters, mark them with [INTRODUCTION] in their first dialogue.`;
}

export function createInitialPrompt({
  characterName,
  characterAge,
  characterBackground,
  genre,
  premise
}: {
  characterName: string;
  characterAge: string;
  characterBackground: string;
  genre: string;
  premise: string;
}): string {
  return `Create a short opening scene for a ${genre} story with these details:

  Main Character:
  - Name: ${characterName}
  - Age: ${characterAge}
  - Background: ${characterBackground}

  Story Premise: ${premise}

  AGE-APPROPRIATE CONTENT RULES:
  1. If age < 13: Keep content child-friendly, no violence or complex themes
  2. If age 13-17: Mild content, avoid explicit themes
  3. If age >= 18: Standard content appropriate for adults

  CRITICAL FORMATTING RULES:
  1. Response MUST be ONLY valid JSON
  2. NO markdown code blocks
  3. NO extra text before or after JSON
  4. Keep narration segments 2-3 sentences, describing:
     - Character reactions
     - Environmental changes
     - Emotional atmosphere
  5. Keep dialogue natural and concise
  6. Use simple vocabulary for text-to-speech
  7. ALWAYS provide 2-4 distinct decisions

  Format the response as a JSON object with this structure:
  {
    "segments": [
      {
        "narration": "Short descriptive text (1-2 sentences)",
        "dialogue": [
          { 
            "character": "Character Name", 
            "text": "[INTRODUCTION]Spoken text" 
          }
        ]
      }
    ],
    "decisions": [
      {
        "text": "Description of the choice",
        "consequences": "Brief hint about potential impact"
      }
    ]
  }

  RESPONSE REQUIREMENTS:
  1. MUST be pure JSON - no other text
  2. Include narration between dialogue to enhance immersion
  3. Introduce maximum 2 characters initially
  4. Use "Narrator" for narrator text
  5. Mark new characters with [INTRODUCTION]
  6. Keep all text simple and clear
  7. Adapt content to character's age
  8. Ensure story tone matches genre`;
}

export function createScenePrompt({
  characterName,
  characterAge,
  characterBackground,
  genre,
  premise,
  previousDecision
}: {
  characterName: string;
  characterAge: string;
  characterBackground: string;
  genre: string;
  premise: string;
  previousDecision: string;
}): string {
  // Randomly select a scene pattern
  const pattern = SCENE_PATTERNS[Math.floor(Math.random() * SCENE_PATTERNS.length)];
  
  return `Continue the ${genre} story based on the previous decision:

  Character:
  - Name: ${characterName}
  - Age: ${characterAge}
  - Background: ${characterBackground}

  Story Premise: ${premise}
  Previous Decision: ${previousDecision}

  SCENE PATTERN: "${pattern.name}"
  Follow this exact structure:
  ${pattern.flow.map((step, i) => 
    `${i + 1}. ${step.type === 'narration' 
      ? `Narration (${step.minSentences}-${step.maxSentences} sentences)` 
      : `${step.count} line(s) of dialogue`}`
  ).join('\n  ')}
  CRITICAL FORMATTING RULES:
  1. Response MUST be ONLY valid JSON
  2. NO markdown code blocks
  3. NO extra text before or after JSON
  4. Follow the exact scene pattern above, with narration describing:
     - Character reactions
     - Environmental changes
     - Emotional atmosphere
     - Scene details and impacts
  5. Keep dialogue natural and concise
  6. End with 2-4 meaningful choices that affect the story

  Format the response as a JSON object with this structure:
  {
    "segments": [
      {
        "narration": "Descriptive text (2-3 sentences)",
        "dialogue": [
          { 
            "character": "Character Name", 
            "gender": "male" or "female",
            "text": "Spoken text" 
          }
        ]
      }
    ],
    "decisions": [
      {
        "text": "Description of the choice",
        "consequences": "Brief hint about potential impact"
      }
    ]
  }

  RESPONSE REQUIREMENTS:
  1. MUST be pure JSON - no other text
  2. Include narration between dialogue to enhance immersion
  3. Keep all text simple and clear
  4. Adapt content to character's age
  5. Ensure story tone matches genre
  6. Each decision should be meaningful and affect relationships/story
  7. Provide 2-4 distinct choices with different potential outcomes
  8. Include character reactions and environmental details in narration
  9. Each decision MUST have different consequences and impacts
  10. Decisions should be meaningful and affect the story direction`;
}