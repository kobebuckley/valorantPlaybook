import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Character {
  uuid: string;
  displayName: string;
  description?: string;
  fullPortrait?: string;
}

interface AgentsListProps {
  onSelectAgent: (selectedAgent: string) => void;
}

export const AgentsList: React.FC<AgentsListProps> = ({ onSelectAgent }) => {
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchCharacterData();
  }, []);

  const fetchCharacterData = async () => {
    try {
      const response = await fetch('https://valorant-api.com/v1/agents');
      const { data } = await response.json();

      const uniqueCharacters = filterDuplicates(data);

      setAllCharacters(uniqueCharacters);
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

  const filterCharacters = (query: string): Character[] => {
    if (query.trim() === '') {
      return allCharacters;
    }

    return allCharacters.filter((character) =>
      character.displayName.toLowerCase().includes(query.toLowerCase().trim())
    );
  };

  useEffect(() => {
    const filteredCharacters = filterCharacters(searchQuery);
    setFilteredCharacters(filteredCharacters);
  }, [searchQuery, allCharacters]);

  const navigate = useNavigate(); 

  const handleAgentSelect = (selectedAgent: string) => {
    const encodedAgent = encodeURIComponent(selectedAgent.toLowerCase());  //Fix for Kayo written as Kay/o in URL causing errors
    onSelectAgent(selectedAgent.toLowerCase());
    navigate(`/agents/${encodedAgent}`);
  };
  

  return (
    <section className="mx-auto bg-gray-800 py-10 ">
      <div className="max-w-3xl mx-auto mb-4">
        <input
          type="text"
          placeholder="Search agents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 justify-items-center">
        {filteredCharacters.map(({ uuid, displayName, description, fullPortrait }) => {
        const encodedAgent = encodeURIComponent(displayName.toLowerCase()); 
        return (
            <article
              className="rounded-lg overflow-hidden shadow-lg bg-gray-900 text-white transform transition-transform hover:scale-105 hover:z-10 cursor-pointer w-full h-full"
              key={uuid}
            >
              <Link to={`/agents/${encodedAgent}`} onClick={() => handleAgentSelect(displayName)}>
                <img className="w-full object-cover object-center" src={fullPortrait} alt={displayName} />
                <div className="p-6">
                  <div className="font-bold text-xl mb-2">{displayName}</div>
                  <p className="text-gray-300 text-base">
                    {description ? description.substring(0, 300) + (description.length > 300 ? '...' : '') : 'No description available'}
                  </p>
                  <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg tracking-wider transition-colors duration-300">
                    Discover
                  </button>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}