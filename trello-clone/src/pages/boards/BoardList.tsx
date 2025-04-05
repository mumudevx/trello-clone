import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { Board } from '../../utils/types';
import { STORAGE_KEYS, getItem, setItem } from '../../utils/localStorage';
import { generateId, getCurrentTimestamp } from '../../utils/helpers';

const BoardList: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>(
    getItem<Board[]>(STORAGE_KEYS.BOARDS, [])
  );
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBoard = () => {
    if (!newBoardTitle.trim()) return;

    const newBoard: Board = {
      id: generateId(),
      title: newBoardTitle.trim(),
      backgroundColor: getRandomColor(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      createdBy: 'user-1', // In a real app, this would be the current user's ID
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    setItem(STORAGE_KEYS.BOARDS, updatedBoards);
    setNewBoardTitle('');
    setIsCreating(false);
  };

  const getRandomColor = () => {
    const colors = [
      'bg-blue-600',
      'bg-green-600',
      'bg-purple-600',
      'bg-red-600',
      'bg-yellow-600',
      'bg-indigo-600',
      'bg-pink-600',
      'bg-teal-600',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Boards</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          <FaPlus className="mr-2" />
          Create Board
        </button>
      </div>

      {isCreating && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Create a new board</h2>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Enter board title"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
            />
            <button
              onClick={handleCreateBoard}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              Create
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {boards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={`/boards/${board.id}`}
              className="block"
            >
              <div className={`${board.backgroundColor ? 
                `${board.backgroundColor.split('-')[0]}-${board.backgroundColor.split('-')[1]}-600` : 
                'bg-blue-600'} h-32 rounded-lg shadow-md p-4 text-white hover:shadow-lg transition`}>
                <h3 className="font-bold text-lg mb-2">{board.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No boards yet</h3>
          <p className="text-gray-500">
            Click the "Create Board" button to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default BoardList; 