import { openai } from '../api/openai';
import { logger } from '../logger';

interface StoryResponse {
  segments: {
    narration: string;
    dialogue: Array<{
      character: string;
      text: string;
    }>;
  }[];
  decisions: Array<{
    text: string;
    consequences: string;
  }>;
}

interface GenerateSceneParams {
  characterName: string;
  characterAge: string;
  characterBackground: string;
  genre: string;
  premise: string;
}

class StoryGenerator {
  async generateOpeningScene(params: GenerateSceneParams): Promise<StoryResponse> {
    try {
      logger.info('[StoryGenerator] 📝 Generating opening scene with params:', params);

      const prompt = `
        Create an opening scene for a ${params.genre} story with the following premise: ${params.premise}
        
        Main character:
        - Name: ${params.characterName}
        - Age: ${params.characterAge}
        - Background: ${params.characterBackground}
        
        Please provide:
        1. A narration setting the scene
        2. Some dialogue between characters
        3. 3-4 possible decisions for what happens next
        
        Format the response as JSON with this structure:
        {
          "segments": [
            {
              "narration": "descriptive text",
              "dialogue": [
                { "character": "name", "text": "what they say" }
              ]
            }
          ],
          "decisions": [
            { "text": "option description", "consequences": "potential outcome" }
          ]
        }
      `;

      const response = await openai.createChatCompletion({
        model: '',
        messages: [
          {
            role: "system",
            content: "You are a creative storyteller who crafts engaging narratives with branching paths."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      const parsedResponse = JSON.parse(content);

      logger.info('[StoryGenerator] ✅ Generated opening scene:', parsedResponse);
      return parsedResponse as StoryResponse;

    } catch (error) {
      logger.error('[StoryGenerator] ❌ Error generating opening scene:', error);
      throw error;
    }
  }

  async generateNextScene(params: {
    characterName: string;
    characterAge: string;
    characterBackground: string;
    genre: string;
    premise: string;
    previousScenarios: Array<{
      description: string;
      dialogueLines: Array<{ character: string; line: string }>;
      selectedDecision: { text: string; consequences: string };
    }>;
    currentScenario: {
      description: string;
      dialogueLines: Array<{ character: string; line: string }>;
    };
    selectedDecision: { text: string; consequences: string };
  }): Promise<StoryResponse> {
    try {
      logger.info('[StoryGenerator] 📝 Generating next scene with params:', params);

      // Build story history for context
      const storyHistory = params.previousScenarios.map((scenario, index) => `
Scene ${index + 1}:
Narration: ${scenario.description}
Dialogue:
${scenario.dialogueLines.map(line => `${line.character}: "${line.line}"`).join('\n')}
Decision Made: ${scenario.selectedDecision.text}
Consequences: ${scenario.selectedDecision.consequences}
`).join('\n\n');

      // Add current scenario
      const currentSceneContext = `
Current Scene:
Narration: ${params.currentScenario.description}
Dialogue:
${params.currentScenario.dialogueLines.map(line => `${line.character}: "${line.line}"`).join('\n')}
Decision Made: ${params.selectedDecision.text}
Expected Consequences: ${params.selectedDecision.consequences}
`;

      const prompt = `
        Continue this ${params.genre} story based on the complete history:
        
        Character:
        - Name: ${params.characterName}
        - Age: ${params.characterAge}
        - Background: ${params.characterBackground}
        
        Original Premise: ${params.premise}

        Story History:
        ${storyHistory}
        
        ${currentSceneContext}
        
        Please provide the next scene that follows naturally from all previous events:
        1. A narration describing what happens next, taking into account all previous events
        2. Relevant dialogue that reflects the characters' knowledge of past events
        3. 3-4 new possible decisions that make sense given the story context
        
        Format the response as JSON with this structure:
        {
          "segments": [
            {
              "narration": "descriptive text",
              "dialogue": [
                { "character": "name", "text": "what they say" }
              ]
            }
          ],
          "decisions": [
            { "text": "option description", "consequences": "potential outcome" }
          ]
        }
      `;

      const response = await openai.createChatCompletion({
        model: '',
        messages: [
          {
            role: "system",
            content: "You are a creative storyteller who crafts engaging narratives with branching paths. You maintain consistency with previous events and character development."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      const parsedResponse = JSON.parse(content);

      logger.info('[StoryGenerator] ✅ Generated scene:', parsedResponse);
      return parsedResponse as StoryResponse;

    } catch (error) {
      logger.error('[StoryGenerator] ❌ Error generating scene:', error);
      throw error;
    }
  }
}

export const storyGenerator = new StoryGenerator();