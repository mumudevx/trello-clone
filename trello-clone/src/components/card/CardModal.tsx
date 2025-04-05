import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaTrash, FaTag } from 'react-icons/fa';
import { Card, Label } from '../../utils/types';
import { getCurrentTimestamp } from '../../utils/helpers';
import { getAllLabels, saveLabel, getLabelsByIds } from '../../utils/labels';

interface CardModalProps {
  card: Card;
  onClose: () => void;
  onSave: (updatedCard: Card) => void;
  onDelete: (cardId: string) => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(card.labelIds || []);
  
  // Tüm etiketleri ve kart etiketlerini al
  const [allLabels, setAllLabels] = useState<Label[]>([]);
  const [cardLabels, setCardLabels] = useState<Label[]>([]);
  
  const [showLabelForm, setShowLabelForm] = useState(false);
  const [showLabelSelector, setShowLabelSelector] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('bg-blue-500');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLTextAreaElement>(null);

  // Tüm etiketleri ve seçili etiketleri yükle
  useEffect(() => {
    const labels = getAllLabels();
    setAllLabels(labels);
    
    if (card.labelIds && card.labelIds.length > 0) {
      const cardLabels = getLabelsByIds(card.labelIds);
      setCardLabels(cardLabels);
    }
  }, [card.labelIds]);

  // Focus title input on mount
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleSave();
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [title, description, selectedLabelIds]);

  // Handle save
  const handleSave = () => {
    if (!title.trim()) return;
    
    const updatedCard: Card = {
      ...card,
      title: title.trim(),
      description: description.trim() || undefined,
      labelIds: selectedLabelIds.length > 0 ? selectedLabelIds : undefined,
      updatedAt: getCurrentTimestamp(),
    };
    
    onSave(updatedCard);
    onClose();
  };

  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      onDelete(card.id);
      onClose();
    }
  };

  // Handle add label
  const handleAddLabel = () => {
    if (!newLabelColor) return;
    
    // Yeni etiketi global olarak kaydet
    const newLabel = saveLabel({
      name: newLabelName.trim() || undefined,
      color: newLabelColor,
    });
    
    // Yeni etiketi karta ekle
    setSelectedLabelIds([...selectedLabelIds, newLabel.id]);
    setAllLabels([...allLabels, newLabel]);
    setCardLabels([...cardLabels, newLabel]);
    
    // Formu resetle
    setNewLabelName('');
    setShowLabelForm(false);
  };

  // Handle toggle label
  const handleToggleLabel = (labelId: string) => {
    if (selectedLabelIds.includes(labelId)) {
      // Etiket zaten seçiliyse kaldır
      setSelectedLabelIds(selectedLabelIds.filter(id => id !== labelId));
      setCardLabels(cardLabels.filter(label => label.id !== labelId));
    } else {
      // Etiket seçili değilse ekle
      setSelectedLabelIds([...selectedLabelIds, labelId]);
      const label = allLabels.find(l => l.id === labelId);
      if (label) {
        setCardLabels([...cardLabels, label]);
      }
    }
  };

  // Available colors for labels
  const labelColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <textarea
              ref={titleInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold w-full resize-none border border-gray-300 dark:border-gray-700 dark:bg-slate-700 dark:text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Card title"
              rows={2}
            />
            <button 
              onClick={handleSave}
              className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          {/* Labels */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Labels</h3>
            
            {/* Seçili etiketleri göster */}
            <div className="flex flex-wrap gap-2 mb-2">
              {cardLabels.map((label) => (
                <div 
                  key={label.id} 
                  className={`px-3 py-1 rounded text-white flex items-center ${label.color}`}
                >
                  <span>{label.name || <FaTag className="mr-1" />}</span>
                  <button 
                    onClick={() => handleToggleLabel(label.id)}
                    className="ml-2 text-white opacity-70 hover:opacity-100"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => setShowLabelSelector(!showLabelSelector)}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600 text-sm"
              >
                {showLabelSelector ? 'Kapat' : '+ Etiket Ekle/Seç'}
              </button>
            </div>
            
            {/* Etiket Seçici */}
            {showLabelSelector && (
              <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded mb-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mevcut Etiketler</h4>
                
                <div className="max-h-40 overflow-y-auto mb-2">
                  {allLabels.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {allLabels.map(label => (
                        <div 
                          key={label.id}
                          className={`flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer ${
                            selectedLabelIds.includes(label.id) ? 'bg-gray-200 dark:bg-slate-600' : ''
                          }`}
                          onClick={() => handleToggleLabel(label.id)}
                        >
                          <div className={`w-4 h-4 rounded-sm ${label.color} mr-2`}></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label.name || 'Adsız'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Henüz etiket yok</p>
                  )}
                </div>
                
                <button 
                  onClick={() => {
                    setShowLabelForm(true);
                    setShowLabelSelector(false);
                  }}
                  className="w-full text-left px-2 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
                >
                  + Yeni Etiket Oluştur
                </button>
              </div>
            )}
            
            {/* Yeni Etiket Formu */}
            {showLabelForm && (
              <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded mb-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Yeni Etiket Oluştur</h4>
                
                <input
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  placeholder="Etiket adı (isteğe bağlı)"
                />
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {labelColors.map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full ${color} ${
                        newLabelColor === color ? 'ring-2 ring-offset-2 ring-gray-500 dark:ring-offset-slate-700' : ''
                      }`}
                      onClick={() => setNewLabelColor(color)}
                      title={color.replace('bg-', '').replace('-500', '')}
                    />
                  ))}
                </div>
                
                <div className="flex">
                  <button
                    onClick={handleAddLabel}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-1 rounded-md transition text-sm"
                  >
                    Ekle
                  </button>
                  <button
                    onClick={() => {
                      setShowLabelForm(false);
                      setShowLabelSelector(true);
                    }}
                    className="ml-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-800 dark:text-white px-3 py-1 rounded-md transition text-sm"
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-slate-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a more detailed description..."
              rows={5}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md transition w-full sm:w-auto"
            >
              Save
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-md transition flex items-center justify-center sm:justify-start w-full sm:w-auto"
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal; 