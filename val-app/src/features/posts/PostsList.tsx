import React, { useEffect, useState } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { BrowserRouter as Router, Link } from 'react-router-dom';

library.add(faSpinner);

interface Character {
  uuid: string;
  displayName: string;
  description?: string;
  fullPortrait?: string;
}

export const PostsList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    fetchCharacterData();
  }, []);

  const fetchCharacterData = async () => {
    try {
      const response = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter');
      const { data } = await response.json();

      // Filter out duplicate characters and those without a fullPortrait image
      const uniqueCharacters = filterDuplicates(data);

      setCharacters(uniqueCharacters);
    } catch (error) {
      console.error('Error fetching character data:', error);
    }
  };

  const filterDuplicates = (characters: Character[]): Character[] => {
    const uniqueCharacters: Character[] = [];
    const characterMap: Map<string, Character> = new Map();

    characters.forEach((character) => {
      if (character.fullPortrait && !characterMap.has(character.uuid)) {
        characterMap.set(character.uuid, character);
        uniqueCharacters.push(character);
      }
    });

    return uniqueCharacters;
  };

  const renderedPosts = characters.map(({ uuid, displayName, description, fullPortrait }) => (
    <article
      className="rounded overflow-hidden shadow-lg bg-black text-white relative transform transition-transform duration-300 hover:scale-110 hover:z-10 cursor-pointer"
      key={uuid}
    >
      <Link to={`/agent/${displayName}`}>
        <img className="w-full object-cover object-center" src={fullPortrait} alt={displayName} />
        <div className="p-6">
          <div className="font-bold text-xl mb-2">{displayName}</div>
          <p className="text-gray-300 text-base">
            {description ? description.substring(0, 100) : 'No description available'}
          </p>
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg tracking-wider transition-colors duration-300">
            Discover
          </button>
        </div>
      </Link>
    </article>
  ));

  return (
    <Router>
      <section className="container mx-auto bg-gray-900 py-10">
        <h2 className="text-4xl font-bold mb-8 text-white text-center tracking-wider">Choose an Agent</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {renderedPosts}
        </div>
      </section>
    </Router>
  );
};
