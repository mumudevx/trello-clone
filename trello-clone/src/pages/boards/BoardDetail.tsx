import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Board, List as ListType, Card as CardType } from '../../utils/types';
import { STORAGE_KEYS, getItem, setItem } from '../../utils/localStorage';
import { generateId, getCurrentTimestamp, sortByPosition, reorder } from '../../utils/helpers';
import List from '../../components/list/List';

const BoardDetail: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<ListType[]>([]);
  const [cards, setCards] = useState<CardType[]>([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [editedBoardTitle, setEditedBoardTitle] = useState('');

  // Load board data
  useEffect(() => {
    const boards = getItem<Board[]>(STORAGE_KEYS.BOARDS, []);
    const currentBoard = boards.find(b => b.id === boardId);
    
    if (currentBoard) {
      setBoard(currentBoard);
      setEditedBoardTitle(currentBoard.title);
      
      // Load lists for this board
      const allLists = getItem<ListType[]>(STORAGE_KEYS.LISTS, []);
      const boardLists = allLists.filter(list => list.boardId === boardId);
      setLists(sortByPosition(boardLists));
      
      // Load cards for this board
      const allCards = getItem<CardType[]>(STORAGE_KEYS.CARDS, []);
      const boardCards = allCards.filter(card => 
        boardLists.some(list => list.id === card.listId)
      );
      setCards(boardCards);
    } else {
      // Board not found, redirect to boards page
      navigate('/boards');
    }
  }, [boardId, navigate]);

  // Handle adding a new list
  const handleAddList = () => {
    if (!newListTitle.trim() || !board) return;

    const newList: ListType = {
      id: generateId(),
      boardId: board.id,
      title: newListTitle.trim(),
      position: lists.length, // Add at the end
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    const updatedLists = [...lists, newList];
    setLists(updatedLists);
    
    // Save to localStorage
    const allLists = getItem<ListType[]>(STORAGE_KEYS.LISTS, []);
    const listsWithoutBoardLists = allLists.filter(list => list.boardId !== board.id);
    const newAllLists = [...listsWithoutBoardLists, ...updatedLists];
    setItem(STORAGE_KEYS.LISTS, newAllLists);
    
    // Reset form
    setNewListTitle('');
    setIsAddingList(false);
  };

  // Handle board title edit
  const handleUpdateBoardTitle = () => {
    if (!editedBoardTitle.trim() || !board) return;
    
    const updatedBoard = {
      ...board,
      title: editedBoardTitle.trim(),
      updatedAt: getCurrentTimestamp(),
    };
    
    setBoard(updatedBoard);
    
    // Update in localStorage
    const boards = getItem<Board[]>(STORAGE_KEYS.BOARDS, []);
    const updatedBoards = boards.map(b => (b.id === board.id ? updatedBoard : b));
    setItem(STORAGE_KEYS.BOARDS, updatedBoards);
    
    setIsEditingBoard(false);
  };

  // Handle board deletion
  const handleDeleteBoard = () => {
    if (!board || !window.confirm('Are you sure you want to delete this board?')) return;
    
    // Delete board
    const boards = getItem<Board[]>(STORAGE_KEYS.BOARDS, []);
    const updatedBoards = boards.filter(b => b.id !== board.id);
    setItem(STORAGE_KEYS.BOARDS, updatedBoards);
    
    // Delete associated lists
    const allLists = getItem<ListType[]>(STORAGE_KEYS.LISTS, []);
    const updatedLists = allLists.filter(list => list.boardId !== board.id);
    setItem(STORAGE_KEYS.LISTS, updatedLists);
    
    // Delete associated cards
    const allCards = getItem<CardType[]>(STORAGE_KEYS.CARDS, []);
    const listsToDelete = allLists.filter(list => list.boardId === board.id);
    const listIds = listsToDelete.map(list => list.id);
    const updatedCards = allCards.filter(card => !listIds.includes(card.listId));
    setItem(STORAGE_KEYS.CARDS, updatedCards);
    
    // Redirect to boards page
    navigate('/boards');
  };

  // Handle list deletion
  const handleDeleteList = (listId: string) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;
    
    // Delete list from state
    const updatedLists = lists.filter(list => list.id !== listId);
    setLists(updatedLists);
    
    // Delete list from localStorage
    const allLists = getItem<ListType[]>(STORAGE_KEYS.LISTS, []);
    const newAllLists = allLists.filter(list => list.id !== listId);
    setItem(STORAGE_KEYS.LISTS, newAllLists);
    
    // Delete associated cards from state
    const updatedCards = cards.filter(card => card.listId !== listId);
    setCards(updatedCards);
    
    // Delete associated cards from localStorage
    const allCards = getItem<CardType[]>(STORAGE_KEYS.CARDS, []);
    const newAllCards = allCards.filter(card => card.listId !== listId);
    setItem(STORAGE_KEYS.CARDS, newAllCards);
  };

  // Handle list update
  const handleUpdateList = (updatedList: ListType) => {
    // Update list in state
    const updatedLists = lists.map(list => 
      list.id === updatedList.id ? updatedList : list
    );
    setLists(updatedLists);
    
    // Update list in localStorage
    const allLists = getItem<ListType[]>(STORAGE_KEYS.LISTS, []);
    const newAllLists = allLists.map(list => 
      list.id === updatedList.id ? updatedList : list
    );
    setItem(STORAGE_KEYS.LISTS, newAllLists);
  };

  // Handle cards change
  const handleCardsChange = () => {
    // Reload cards from localStorage
    const allCards = getItem<CardType[]>(STORAGE_KEYS.CARDS, []);
    const listIds = lists.map(list => list.id);
    const boardCards = allCards.filter(card => listIds.includes(card.listId));
    setCards(boardCards);
  };

  // Handle drag end - drag-and-drop logic
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    
    console.log('Drag ended:', result);

    // Dropped outside the list
    if (!destination) {
      console.log('Dropped outside any droppable area');
      return;
    }

    // If the position didn't change
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      console.log('Dropped in the same position, no change needed');
      return;
    }

    // If dragging lists
    if (type === 'LIST') {
      console.log('Reordering lists');
      const reorderedLists = reorder(
        lists,
        source.index,
        destination.index
      );
      
      // Update positions
      const listsWithUpdatedPositions = reorderedLists.map((list, index) => ({
        ...list,
        position: index,
        updatedAt: getCurrentTimestamp()
      }));
      
      setLists(listsWithUpdatedPositions);
      
      // Update in localStorage
      const allLists = getItem<ListType[]>(STORAGE_KEYS.LISTS, []);
      const listsWithoutBoardLists = allLists.filter(list => list.boardId !== boardId);
      const newAllLists = [...listsWithoutBoardLists, ...listsWithUpdatedPositions];
      setItem(STORAGE_KEYS.LISTS, newAllLists);
      
      console.log('Lists reordered and saved:', listsWithUpdatedPositions);
      return;
    }

    // If dragging cards
    const sourceListId = source.droppableId;
    const destListId = destination.droppableId;
    
    console.log('Card drag detected:', { 
      sourceListId, 
      destListId, 
      sourceIndex: source.index, 
      destIndex: destination.index 
    });
    
    // Get cards from source list
    const sourceCards = cards.filter(card => card.listId === sourceListId);
    console.log('Source cards:', sourceCards);
    
    // Same list - reordering
    if (sourceListId === destListId) {
      console.log('Reordering cards within the same list');
      const reorderedCards = reorder(
        sourceCards,
        source.index,
        destination.index
      );
      
      // Update positions
      const updatedCards = reorderedCards.map((card, index) => ({
        ...card,
        position: index,
        updatedAt: getCurrentTimestamp()
      }));
      
      // Update state - replace source list cards with reordered cards
      const newCards = cards.filter(card => card.listId !== sourceListId).concat(updatedCards);
      setCards(newCards);
      
      // Update localStorage
      const allCards = getItem<CardType[]>(STORAGE_KEYS.CARDS, []);
      const cardsWithoutSourceList = allCards.filter(card => card.listId !== sourceListId);
      const newAllCards = [...cardsWithoutSourceList, ...updatedCards];
      setItem(STORAGE_KEYS.CARDS, newAllCards);
      
      console.log('Cards reordered within list and saved');
    } 
    // Different lists - moving card
    else {
      console.log('Moving card between lists');
      // Get cards from destination list
      const destCards = cards.filter(card => card.listId === destListId);
      console.log('Destination cards:', destCards);
      
      // Clone source cards to avoid mutation
      const sourceCardsCopy = [...sourceCards];
      
      // Get the card being moved
      const [movedCard] = sourceCardsCopy.splice(source.index, 1);
      console.log('Card being moved:', movedCard);
      
      // Create a copy of destination cards
      const destCardsCopy = [...destCards];
      
      // Insert card into destination list
      const updatedMovedCard = {
        ...movedCard,
        listId: destListId,
        position: destination.index,
        updatedAt: getCurrentTimestamp()
      };
      
      // Insert the card at the right position
      destCardsCopy.splice(destination.index, 0, updatedMovedCard);
      
      // Update positions for source list
      const updatedSourceCards = sourceCardsCopy.map((card, index) => ({
        ...card,
        position: index,
        updatedAt: getCurrentTimestamp()
      }));
      
      // Update positions for destination list
      const updatedDestCards = destCardsCopy.map((card, index) => ({
        ...card,
        position: index,
        updatedAt: getCurrentTimestamp()
      }));
      
      // Combine all cards
      const newCards = cards
        .filter(card => card.listId !== sourceListId && card.listId !== destListId)
        .concat(updatedSourceCards)
        .concat(updatedDestCards);
      
      setCards(newCards);
      
      // Update localStorage
      const allCards = getItem<CardType[]>(STORAGE_KEYS.CARDS, []);
      const filteredCards = allCards.filter(
        card => card.listId !== sourceListId && card.listId !== destListId
      );
      const newAllCards = [...filteredCards, ...updatedSourceCards, ...updatedDestCards];
      setItem(STORAGE_KEYS.CARDS, newAllCards);
      
      console.log('Card moved between lists and saved');
    }
  };

  if (!board) {
    return <div className="text-center p-8">Loading board...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        {isEditingBoard ? (
          <div className="flex items-center w-full sm:w-auto">
            <input
              type="text"
              value={editedBoardTitle}
              onChange={(e) => setEditedBoardTitle(e.target.value)}
              className="mr-2 px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              autoFocus
            />
            <button
              onClick={handleUpdateBoardTitle}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-2 rounded-md transition"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditingBoard(false)}
              className="ml-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-3 py-2 rounded-md transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{board.title}</h1>
        )}
        
        <div className="flex space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setIsEditingBoard(true)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-3 py-2 rounded-md transition flex items-center"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
          <button
            onClick={handleDeleteBoard}
            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-2 rounded-md transition flex items-center"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-x-auto overflow-y-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
            {(provided) => (
              <div 
                className="flex gap-4 h-full pb-4 min-h-[calc(100vh-12rem)] overflow-x-auto"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {lists.map((list, index) => (
                  <List
                    key={list.id}
                    list={list}
                    index={index}
                    cards={sortByPosition(cards.filter(card => card.listId === list.id))}
                    onDelete={handleDeleteList}
                    onUpdate={handleUpdateList}
                    onCardsChange={handleCardsChange}
                  />
                ))}
                {provided.placeholder}

                {isAddingList ? (
                  <div className="flex-shrink-0 w-72 bg-gray-100 dark:bg-slate-800 rounded-md shadow-sm p-2">
                    <input
                      type="text"
                      placeholder="Enter list title"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      autoFocus
                    />
                    <div className="flex">
                      <button
                        onClick={handleAddList}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-2 rounded-md transition"
                      >
                        Add List
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingList(false);
                          setNewListTitle('');
                        }}
                        className="ml-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-3 py-2 rounded-md transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingList(true)}
                    className="flex-shrink-0 w-72 bg-gray-100 dark:bg-slate-800 bg-opacity-60 hover:bg-opacity-80 dark:bg-opacity-60 dark:hover:bg-opacity-80 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center transition"
                  >
                    <FaPlus className="mr-2" />
                    Add another list
                  </button>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default BoardDetail; 