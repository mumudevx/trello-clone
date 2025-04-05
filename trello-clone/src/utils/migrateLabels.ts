/**
 * Mevcut kartlardaki etiketleri yeni yapıya geçirmek için geçiş betiği
 */

import { Card, Label } from './types';
import { STORAGE_KEYS, getItem, setItem } from './localStorage';
import { createDefaultLabels } from './labels';

interface OldCard {
  id: string;
  listId: string;
  title: string;
  description?: string;
  position: number;
  labels?: Label[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Etiketleri yeni yapıya geçir
 */
export const migrateLabels = (): void => {
  console.log('Etiket geçişi başlatılıyor...');
  
  // Mevcut kartları getir
  const oldCards = getItem<OldCard[]>(STORAGE_KEYS.CARDS, []);
  
  // Tüm kartlarda etiket varsa bunları topla
  const allLabelsMap = new Map<string, Label>();
  
  // Varsayılan etiketleri oluştur
  const defaultLabels = createDefaultLabels();
  defaultLabels.forEach(label => allLabelsMap.set(label.id, label));
  
  // Her kartın etiketlerini topla
  oldCards.forEach(card => {
    if (card.labels && card.labels.length > 0) {
      card.labels.forEach(label => {
        // Etiketin bir kimliği yoksa eklemek için benzersiz bir kimlik oluştur
        const labelId = label.id || `label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        allLabelsMap.set(labelId, { ...label, id: labelId });
      });
    }
  });
  
  // Toplanan etiketleri kaydet
  const allLabels = Array.from(allLabelsMap.values());
  setItem(STORAGE_KEYS.LABELS, allLabels);
  
  console.log(`${allLabels.length} etiket kaydedildi`);
  
  // Kartları yeni yapıya geçir
  const newCards: Card[] = oldCards.map(oldCard => {
    if (!oldCard.labels || oldCard.labels.length === 0) {
      // Etiket yoksa sadece tipini değiştir
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { labels, ...rest } = oldCard;
      return rest as unknown as Card;
    }
    
    // Etiket varsa, etiket kimliklerini al
    const labelIds = oldCard.labels.map(label => {
      // Etiket kimliği veya eşleşen etiket bul
      const matchedLabel = allLabelsMap.get(label.id) || 
        Array.from(allLabelsMap.values()).find(l => l.color === label.color && l.name === label.name);
      
      return matchedLabel?.id || label.id;
    });
    
    // Eski etiketleri kaldır, yeni etiket kimliklerini ekle
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { labels, ...rest } = oldCard;
    return {
      ...rest,
      labelIds
    } as unknown as Card;
  });
  
  // Yeni kartları kaydet
  setItem(STORAGE_KEYS.CARDS, newCards);
  
  console.log(`${newCards.length} kart güncellendi`);
  console.log('Etiket geçişi tamamlandı');
}; 