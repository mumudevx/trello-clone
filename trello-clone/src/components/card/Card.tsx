import React, { useMemo } from 'react';
import { FaEdit, FaTrash, FaTag } from 'react-icons/fa';
import { Draggable } from 'react-beautiful-dnd';
import { Card as CardType } from '../../utils/types';
import { getLabelsByIds } from '../../utils/labels';

interface CardProps {
  card: CardType;
  index: number; // Index needed for drag and drop
  onEdit: (card: CardType) => void;
  onDelete: (cardId: string) => void;
}

const Card: React.FC<CardProps> = ({ card, index, onEdit, onDelete }) => {
  // Get labels from labelIds
  const cardLabels = useMemo(() => {
    if (!card.labelIds || card.labelIds.length === 0) return [];
    return getLabelsByIds(card.labelIds);
  }, [card.labelIds]);

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group bg-white dark:bg-slate-700 rounded shadow-sm p-3 mb-2 cursor-pointer hover:shadow-md transition ${
            snapshot.isDragging ? 'shadow-lg bg-blue-50 dark:bg-blue-900/30' : ''
          }`}
          onClick={() => onEdit(card)}
        >
          {/* Card Labels */}
          {cardLabels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {cardLabels.map((label) => (
                <span
                  key={label.id}
                  className={`px-2 py-1 rounded-sm text-xs text-white ${label.color}`}
                  title={label.name || ''}
                >
                  {label.name || <FaTag className="text-xs" />}
                </span>
              ))}
            </div>
          )}
          
          {/* Card Title */}
          <h4 className="text-gray-800 dark:text-white font-medium">{card.title}</h4>
          
          {/* Card Description Preview (if exists) */}
          {card.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
              {card.description}
            </p>
          )}
          
          {/* Card Actions */}
          <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(card);
              }}
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-2"
              title="Edit Card"
            >
              <FaEdit />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
              className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              title="Delete Card"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card; 