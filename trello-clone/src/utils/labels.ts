import { Label } from './types';
import { STORAGE_KEYS, getItem, setItem } from './localStorage';
import { generateId } from './helpers';

/**
 * Tüm etiketleri getir
 * @returns Etiketlerin listesi
 */
export const getAllLabels = (): Label[] => {
  return getItem<Label[]>(STORAGE_KEYS.LABELS, []);
};

/**
 * Verilen ID'lere göre etiketleri getir
 * @param labelIds - Etiket ID'leri dizisi
 * @returns Bulunan etiketlerin listesi
 */
export const getLabelsByIds = (labelIds: string[]): Label[] => {
  const allLabels = getAllLabels();
  return allLabels.filter(label => labelIds.includes(label.id));
};

/**
 * Etiket ekle veya güncelle
 * @param label - Eklenecek veya güncellenecek etiket
 * @returns Eklenen veya güncellenen etiket
 */
export const saveLabel = (label: Omit<Label, 'id'> & { id?: string }): Label => {
  const allLabels = getAllLabels();
  
  // Etiket ID'si yoksa yeni bir etiket oluştur
  if (!label.id) {
    const newLabel: Label = {
      id: generateId(),
      name: label.name,
      color: label.color,
    };
    
    // Etiketleri kaydet
    setItem(STORAGE_KEYS.LABELS, [...allLabels, newLabel]);
    return newLabel;
  }
  
  // Mevcut etiketi güncelle
  const updatedLabels = allLabels.map(l => (l.id === label.id ? { ...l, ...label } : l));
  setItem(STORAGE_KEYS.LABELS, updatedLabels);
  
  return label as Label;
};

/**
 * Birden çok etiketi toplu olarak kaydet
 * @param labels - Kaydedilecek etiketler
 * @returns Kaydedilen etiketler
 */
export const saveManyLabels = (labels: Label[]): Label[] => {
  const allLabels = getAllLabels();
  
  // Yeni etiketleri mevcut etiket listesiyle birleştir
  // ID'ye göre güncelleme yap
  const updatedLabels = [...allLabels];
  
  for (const label of labels) {
    const existingIndex = updatedLabels.findIndex(l => l.id === label.id);
    if (existingIndex >= 0) {
      updatedLabels[existingIndex] = label;
    } else {
      updatedLabels.push(label);
    }
  }
  
  setItem(STORAGE_KEYS.LABELS, updatedLabels);
  return labels;
};

/**
 * Bir etiketi sil
 * @param labelId - Silinecek etiketin ID'si
 * @returns Silme başarılı mı?
 */
export const deleteLabel = (labelId: string): boolean => {
  const allLabels = getAllLabels();
  const updatedLabels = allLabels.filter(label => label.id !== labelId);
  
  if (updatedLabels.length !== allLabels.length) {
    setItem(STORAGE_KEYS.LABELS, updatedLabels);
    return true;
  }
  
  return false;
};

/**
 * Varsayılan etiketleri oluştur
 * @returns Oluşturulan varsayılan etiketler
 */
export const createDefaultLabels = (): Label[] => {
  const defaultLabels: Label[] = [
    { id: generateId(), color: 'bg-blue-500', name: 'Düşük Öncelik' },
    { id: generateId(), color: 'bg-green-500', name: 'Kolay İş' },
    { id: generateId(), color: 'bg-yellow-500', name: 'Beklemede' },
    { id: generateId(), color: 'bg-red-500', name: 'Yüksek Öncelik' },
    { id: generateId(), color: 'bg-purple-500', name: 'Hata' },
    { id: generateId(), color: 'bg-orange-500', name: 'Özellik İsteği' },
  ];
  
  // Eğer daha önce etiket yoksa varsayılan etiketleri kaydet
  const existingLabels = getAllLabels();
  if (existingLabels.length === 0) {
    setItem(STORAGE_KEYS.LABELS, defaultLabels);
  }
  
  return defaultLabels;
}; 