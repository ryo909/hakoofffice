export interface User {
  id: string;
  name: string;
  departmentId: string;
  avatarUrl?: string; // or seed string for generative avatar
  status: 'available' | 'working' | 'focus';
  statusLine: string;
  likes: string[]; // max 3
  topicsTags: string[];
  happyRecent: string;
  helpTopics: string[]; // "Consultation OK themes"
  contactPreference: string[]; // e.g. ['slack', 'discord']
  chatworkLink?: string;
  editTokenHash?: string; // Hashed version of the token (only present in secure context or local mock)
  visibility: 'company' | 'department' | 'private';
}

export interface Zone {
  id: string;
  name: string;
  x: number; // 0..1
  y: number; // 0..1
  w: number; // 0..1
  h: number; // 0..1
  color: string;
  labelColor?: string;
}

export interface MapPosition {
  userId: string;
  x: number; // 0..1
  y: number; // 0..1
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  userIds: string[];
}

export interface Department {
  id: string;
  name: string;
  color: string;
}
