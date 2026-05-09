export interface User {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedCollege {
  id: number;
  userId: number;
  collegeId: number;
  createdAt: Date;
}

export const MOCK_USERS: User[] = [];
export const MOCK_SAVED_COLLEGES: SavedCollege[] = [];

let nextUserId = 1;
export const getNextUserId = () => nextUserId++;

let nextSavedId = 1;
export const getNextSavedId = () => nextSavedId++;
