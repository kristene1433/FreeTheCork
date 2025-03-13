// components/Preferences.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Preferences() {
  const router = useRouter();

  // Local state for preferences
  const [drynessLevel, setDrynessLevel] = useState('');
  const [favoriteTypes, setFavoriteTypes] = useState<string[]>([]);
  const [dislikedFlavors, setDislikedFlavors] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState('');
  const [knowledgeLevel, setKnowledgeLevel] = useState('');

  // Fetch existing preferences on mount
  useEffect(() => {
    fetch('/api/account/preferences', {
      credentials: 'include', // ensure session cookie is sent
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load preferences (status ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.preferences) {
          setDrynessLevel(data.preferences.drynessLevel || '');
          setFavoriteTypes(data.preferences.favoriteTypes || []);
          setDislikedFlavors(data.preferences.dislikedFlavors || []);
          setBudgetRange(data.preferences.budgetRange || '');
          setKnowledgeLevel(data.preferences.knowledgeLevel || '');
        }
      })
      .catch((err) => {
        console.error(err);
        alert(`Error loading preferences: ${err instanceof Error ? err.message : err}`);
      });
  }, []);

  // For toggling a single checkbox in an array
  function handleCheckboxChange(
    value: string,
    stateArray: string[],
    setState: (arr: string[]) => void
  ) {
    if (stateArray.includes(value)) {
      setState(stateArray.filter((item) => item !== value));
    } else {
      setState([...stateArray, value]);
    }
  }

  async function handleSave() {
    try {
      const res = await fetch('/api/account/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ensure session cookie is sent
        body: JSON.stringify({
          drynessLevel,
          favoriteTypes,
          dislikedFlavors,
          budgetRange,
          knowledgeLevel,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error saving preferences (status ${res.status})`);
      }
      alert('Preferences saved!');
      router.push('/dashboard'); // Redirect to dashboard on success
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        alert(`Error saving preferences: ${err.message}`);
      } else {
        alert('Error saving preferences (unknown error)');
      }
    }
  }

  // Option arrays
  const drynessOptions = ['Dry', 'Semi-sweet', 'Sweet'];
  const wineTypeOptions = ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert'];
  const flavorOptions = ['Oaky', 'Smoky', 'Fruity', 'Earthy', 'Spicy', 'Floral'];
  const budgetOptions = ['Under $10', '$10-20', '$20-30', '$30-50', '$50+'];
  const knowledgeOptions = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Your Wine Preferences</h3>

      {/* Dryness Level */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Dryness Level</label>
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={drynessLevel}
          onChange={(e) => setDrynessLevel(e.target.value)}
        >
          <option value="">Select dryness</option>
          {drynessOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Favorite Wine Types */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Favorite Wine Types</label>
        <div className="flex flex-wrap gap-4">
          {wineTypeOptions.map((wineType) => (
            <label key={wineType} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={favoriteTypes.includes(wineType)}
                onChange={() => handleCheckboxChange(wineType, favoriteTypes, setFavoriteTypes)}
              />
              <span>{wineType}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Disliked Flavors */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Disliked Flavors</label>
        <div className="flex flex-wrap gap-4">
          {flavorOptions.map((flavor) => (
            <label key={flavor} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={dislikedFlavors.includes(flavor)}
                onChange={() => handleCheckboxChange(flavor, dislikedFlavors, setDislikedFlavors)}
              />
              <span>{flavor}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Budget Range</label>
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={budgetRange}
          onChange={(e) => setBudgetRange(e.target.value)}
        >
          <option value="">Select budget</option>
          {budgetOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Knowledge Level */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Knowledge Level</label>
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={knowledgeLevel}
          onChange={(e) => setKnowledgeLevel(e.target.value)}
        >
          <option value="">Select knowledge level</option>
          {knowledgeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSave}
        className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        Save Preferences
      </button>
    </div>
  );
}
