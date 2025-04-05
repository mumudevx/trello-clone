import React, { useState, useEffect } from 'react';
import { Label } from '../../utils/types';
import { getAllLabels, saveLabel, deleteLabel } from '../../utils/labels';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

// Default colors for labels
const LABEL_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-teal-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-gray-500',
];

interface LabelManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const LabelManagement: React.FC<LabelManagementProps> = ({ isOpen, onClose }) => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [newLabel, setNewLabel] = useState<Partial<Label>>({ name: '', color: LABEL_COLORS[0] });
  
  // Load labels on mount
  useEffect(() => {
    if (isOpen) {
      loadLabels();
    }
  }, [isOpen]);
  
  const loadLabels = () => {
    const allLabels = getAllLabels();
    setLabels(allLabels);
  };
  
  const handleAddLabel = () => {
    if (!newLabel.name) return;
    
    saveLabel({
      name: newLabel.name,
      color: newLabel.color || LABEL_COLORS[0]
    });
    
    setNewLabel({ name: '', color: LABEL_COLORS[0] });
    loadLabels();
  };
  
  const handleUpdateLabel = () => {
    if (!editingLabel || !editingLabel.name) return;
    
    saveLabel(editingLabel);
    setEditingLabel(null);
    loadLabels();
  };
  
  const handleDeleteLabel = (labelId: string) => {
    if (window.confirm('Bu etiketi silmek istediğinizden emin misiniz?')) {
      deleteLabel(labelId);
      loadLabels();
    }
  };
  
  const startEditing = (label: Label) => {
    setEditingLabel({ ...label });
  };
  
  const cancelEditing = () => {
    setEditingLabel(null);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">Etiket Yönetimi</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <FaTimes />
          </button>
        </div>
        
        {/* Add new label form */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Yeni Etiket Ekle</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newLabel.name}
              onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
              placeholder="Etiket adı"
              className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded px-3 py-2"
            />
            <div className="flex space-x-1">
              {LABEL_COLORS.slice(0, 5).map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full ${color} ${newLabel.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  onClick={() => setNewLabel({ ...newLabel, color })}
                  title={color.replace('bg-', '')}
                />
              ))}
            </div>
            <button
              onClick={handleAddLabel}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
              title="Etiket Ekle"
            >
              <FaPlus />
            </button>
          </div>
        </div>
        
        {/* All labels list */}
        <div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Mevcut Etiketler</h3>
          {labels.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Henüz etiket bulunmamaktadır.</p>
          ) : (
            <ul className="space-y-2">
              {labels.map((label) => (
                <li key={label.id} className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 rounded p-2">
                  {editingLabel && editingLabel.id === label.id ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="text"
                        value={editingLabel.name}
                        onChange={(e) => setEditingLabel({ ...editingLabel, name: e.target.value })}
                        className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded px-2 py-1"
                        autoFocus
                      />
                      <div className="flex space-x-1">
                        {LABEL_COLORS.map((color) => (
                          <button
                            key={color}
                            className={`w-5 h-5 rounded-full ${color} ${editingLabel.color === color ? 'ring-2 ring-blue-500' : ''}`}
                            onClick={() => setEditingLabel({ ...editingLabel, color })}
                            title={color.replace('bg-', '')}
                          />
                        ))}
                      </div>
                      <button
                        onClick={handleUpdateLabel}
                        className="text-green-500 hover:text-green-600"
                        title="Değişiklikleri Kaydet"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-red-500 hover:text-red-600"
                        title="İptal"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className={`w-4 h-4 rounded-full ${label.color}`}></span>
                        <span className="dark:text-white">{label.name}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(label)}
                          className="text-blue-500 hover:text-blue-600"
                          title="Düzenle"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteLabel(label.id)}
                          className="text-red-500 hover:text-red-600"
                          title="Sil"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabelManagement; 