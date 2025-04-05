/**
 * Type definitions for the Trello clone application
 */

// User interface
export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

// Authentication state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

// Board interface
export interface Board {
  id: string;
  title: string;
  description?: string;
  backgroundColor?: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string; // User ID
}

// List interface
export interface List {
  id: string;
  boardId: string;
  title: string;
  position: number;
  createdAt: number;
  updatedAt: number;
}

// Label interface
export interface Label {
  id: string;
  name?: string;
  color: string;
}

// Card interface
export interface Card {
  id: string;
  listId: string;
  title: string;
  description?: string;
  position: number;
  labelIds?: string[]; // Etiket ID'lerini saklayacak
  createdAt: number;
  updatedAt: number;
}

// Boards state
export interface BoardsState {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
}

// Lists state
export interface ListsState {
  lists: List[];
  loading: boolean;
  error: string | null;
}

// Cards state
export interface CardsState {
  cards: Card[];
  currentCard: Card | null;
  loading: boolean;
  error: string | null;
}

// Labels state
export interface LabelsState {
  labels: Label[];
  loading: boolean;
  error: string | null;
} 