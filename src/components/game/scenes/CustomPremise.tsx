import React, { useState } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { Button } from '../../ui/Button';
import { BackButton } from '../../ui/BackButton';
import { TypewriterTitle } from '../../ui/TypewriterTitle';

export function CustomPremise() {
  const { setPremise } = useGameStore();
  const [customPremise, setCustomPremise] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPremise.trim()) {
      setPremise(customPremise.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <BackButton />
      <TypewriterTitle text="Write Your Premise" />
      <p className="text-center text-purple-300">Create your own unique story premise</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={customPremise}
          onChange={(e) => setCustomPremise(e.target.value)}
          className="w-full h-32 p-3 rounded-lg bg-gray-700 text-purple-400 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          placeholder="Describe your story premise..."
        />
        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={!customPremise.trim()}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}