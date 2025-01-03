import React, { useState } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { Button } from '../../ui/Button';
import { BackButton } from '../../ui/BackButton';
import { GameState } from '../../../types';
import { Sparkles } from 'lucide-react';
import { getRandomBackground } from '../../../lib/constants/backgrounds';
import { TypewriterTitle } from '../../ui/TypewriterTitle';
import { AGE_GROUPS } from '../../../lib/constants/age';

export function CharacterSetup() {
  const { setCharacterInfo, characterGender, setGameState } = useGameStore();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [background, setBackground] = useState('');
  
  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {};
    
    const name = formData.get('name') as string;
    const age = formData.get('age') as string;
    const background = formData.get('background') as string;
    
    if (!name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!age?.trim()) {
      errors.age = 'Age is required';
    }
    
    if (!background?.trim()) {
      errors.background = 'Background is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!validateForm(formData)) {
      return;
    }
    
    setCharacterInfo('characterName', formData.get('name') as string);
    setCharacterInfo('characterAge', formData.get('age') as string);
    setCharacterInfo('characterBackground', formData.get('background') as string);
    
    setGameState(GameState.SETUP_VOICE);
  };

  const handleRandomize = () => {
    const randomBackground = getRandomBackground();
    setBackground(randomBackground);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <BackButton />
      <TypewriterTitle text="Create Your Character" />
      <p className="text-center text-purple-300">Tell us about your protagonist</p>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Character Gender</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setCharacterInfo('characterGender', 'male')}
            className={`p-4 rounded-lg transition-all ${
              characterGender === 'male'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700/30 hover:bg-gray-700/50'
            }`}
          >
            Male
          </button>
          <button
            type="button"
            onClick={() => setCharacterInfo('characterGender', 'female')}
            className={`p-4 rounded-lg transition-all ${
              characterGender === 'female'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700/30 hover:bg-gray-700/50'
            }`}
          >
            Female
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`w-full p-3 rounded-lg bg-gray-700 text-purple-400 border ${
                formErrors.name ? 'border-red-500' : 'border-gray-600'
              } focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
              placeholder="Enter character name"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="age" className="block text-sm font-medium mb-1">
              Age
            </label>
            <select
              id="age"
              name="age"
              className={`w-full p-3 rounded-lg bg-gray-700 text-purple-400 border ${
                formErrors.age ? 'border-red-500' : 'border-gray-600'
              } focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
            >
              <option value="">Select an age</option>
              {AGE_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.ages.map((age) => (
                    <option key={age} value={age}>
                      {age} years old
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {formErrors.age && (
              <p className="mt-1 text-sm text-red-500">{formErrors.age}</p>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="background" className="block text-sm font-medium">
                Background
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRandomize}
                className="text-purple-400 hover:text-purple-300"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Randomize
              </Button>
            </div>
            <textarea
              id="background"
              name="background"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              rows={4}
              className={`w-full p-3 rounded-lg bg-gray-700 text-purple-400 border ${
                formErrors.background ? 'border-red-500' : 'border-gray-600'
              } focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
              placeholder="Describe your character's background, personality, or any other important details..."
            />
            {formErrors.background && (
              <p className="mt-1 text-sm text-red-500">{formErrors.background}</p>
            )}
          </div>
        </div>
        
        <Button type="submit" className="w-full">
          Continue to Voice Selection
        </Button>
      </form>
    </div>
  );
}