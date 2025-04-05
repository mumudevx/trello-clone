import React, { useState } from 'react';
import { FaEllipsisH, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { List as ListType, Card as CardType } from '../../utils/types';
import Card from '../card/Card';
import CardModal from '../card/CardModal';
import { STORAGE_KEYS, getItem, setItem } from '../../utils/localStorage';
import { generateId, getCurrentTimestamp, sortByPosition } from '../../utils/helpers';

interface ListProps {
  list: ListType;
  index: number; // Index needed for drag and drop
  cards: CardType[];
  onDelete: (listId: string) => void;
  onUpdate: (list: ListType) => void;
  onCardsChange: () => void;
}

const List: React.FC<ListProps> = ({ list, index, cards, onDelete, onUpdate, onCardsChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const [showMenu, setShowMenu] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [currentCard, setCurrentCard] = useState<CardType | null>(null);

  // Handle list title update
  const handleUpdateTitle = () => {
    if (!editedTitle.trim()) return;
    
    const updatedList = {
      ...list,
      title: editedTitle.trim(),
      updatedAt: getCurrentTimestamp()
    };
    
    onUpdate(updatedList);
    setIsEditing(false);
  };

  // Handle card creation
  const handleAddCard = () => {
    if (!newCardTitle.trim()) return;
    
    const newCard: CardType = {
      id: generateId(),
      listId: list.id,
      title: newCardTitle.trim(),
      position: cards.length, // Add at the end
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    
    // Get all cards from storage
    const allCards = getItem<CardType[]>(STORAGE_KEYS.CARDS, []);
    
    // Add new card
    const updatedCards = [...allCards, newCard];
    setItem(STORAGE_KEYS.CARDS, updatedCards);
    
    // Reset form
    setNewCardTitle('');
    setIsAddingCard(false);
    
    // Notify parent component
    onCardsChange();
  };

  // Handle card deletion
  const handleDeleteCard = (cardId: string) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    
    // Delete card from storage
    const allCards = getItem<CardType[]>(STORAGE_KEYS.CARDS, []);
    const updatedCards = allCards.filter(card => card.id !== cardId);
    setItem(STORAGE_KEYS.CARDS, updatedCards);
    
    // Notify parent component
    onCardsChange();
  };

  // Handle card edit (now using the modal)
  const handleEditCard = (card: CardType) => {
    setCurrentCard(card);
  };
  
  const handleCardUpdate = (updatedCard: CardType) => {
    // Update card in localStorage
    const allCards = getItem<CardType[]>(STORAGE_KEYS.CARDS, []);
    const updatedCards = allCards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    setItem(STORAGE_KEYS.CARDS, updatedCards);
    
    // Notify parent component
    onCardsChange();
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex-shrink-0 w-72 bg-gray-100 dark:bg-slate-800 rounded-md shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-12rem)]"
        >
          <div 
            className="p-2 bg-gray-200 dark:bg-slate-700 flex justify-between items-center"
            {...provided.dragHandleProps}
          >
            {isEditing ? (
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="flex-grow px-2 py-1 border border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleUpdateTitle}
                  className="ml-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-2 py-1 rounded-md transition text-sm"
                >
                  Save
                </button>
              </div>
            ) : (
              <h3 className="font-semibold text-gray-800 dark:text-white">{list.title}</h3>
            )}
            
            <div className="relative">
              <button 
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                onClick={() => setShowMenu(!showMenu)}
              >
                <FaEllipsisH />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-6 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                  <ul>
                    <li>
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-white flex items-center"
                        onClick={() => {
                          setIsEditing(true); 
                          setShowMenu(false);
                        }}
                      >
                        <FaEdit className="mr-2" />
                        Edit List
                      </button>
                    </li>
                    <li>
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-red-600 flex items-center"
                        onClick={() => {
                          onDelete(list.id);
                          setShowMenu(false);
                        }}
                      >
                        <FaTrash className="mr-2" />
                        Delete List
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <Droppable droppableId={list.id} type="CARD">
            {(droppableProvided, droppableSnapshot) => (
              <div 
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
                className={`flex-grow p-2 overflow-y-auto min-h-[50px] ${
                  droppableSnapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : 'dark:bg-slate-800'
                }`}
                data-list-id={list.id}
              >
                {cards.length > 0 ? (
                  sortByPosition(cards).map((card, cardIndex) => (
                    <Card 
                      key={card.id} 
                      card={card}
                      index={cardIndex}
                      onEdit={handleEditCard} 
                      onDelete={handleDeleteCard}
                    />
                  ))
                ) : (
                  <div className="py-2 text-gray-500 dark:text-gray-400 text-sm italic text-center">
                    No cards yet
                  </div>
                )}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
          
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            {isAddingCard ? (
              <div>
                <textarea
                  placeholder="Enter a title for this card..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-slate-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  rows={3}
                  autoFocus
                />
                <div className="flex">
                  <button
                    onClick={handleAddCard}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-1 rounded-md transition text-sm"
                  >
                    Add Card
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingCard(false);
                      setNewCardTitle('');
                    }}
                    className="ml-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-3 py-1 rounded-md transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button 
                className="w-full text-left px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-md transition flex items-center"
                onClick={() => setIsAddingCard(true)}
              >
                <FaPlus className="mr-2" />
                Add a card
              </button>
            )}
          </div>

          {/* Card Edit Modal */}
          {currentCard && (
            <CardModal
              card={currentCard}
              onClose={() => setCurrentCard(null)}
              onSave={handleCardUpdate}
              onDelete={handleDeleteCard}
            />
          )}
        </div>
      )}
    </Draggable>
  );
};

export default List; 