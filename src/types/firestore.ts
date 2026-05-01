export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: 'parent' | 'admin' | 'moderator';
  verifiedParent: boolean;
  bio?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  children?: ChildProfile[];
  createdAt: string;
  updatedAt: string;
}

export interface ChildProfile {
  id: string;
  firstName: string;
  age: number;
  interests?: string[];
  gradeLevel?: string;
}

export interface FitoEvent {
  id: string;
  hostId: string;
  hostName: string;
  title: string;
  type: 'Park Day' | 'Study Group' | 'Field Trip' | 'Co-Op Meeting' | 'P.E. Session' | 'Social Hangout' | 'Other';
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  ageRange: string;
  maxAttendees?: number;
  attendees: string[]; // List of user UIDs
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface FitoGroup {
  id: string;
  creatorId: string;
  name: string;
  description: string;
  location: string;
  schedule: string;
  visibility: 'Public' | 'Private';
  members: string[]; // List of user UIDs
  subjects: string[];
  materials: string[]; // List of material IDs
  createdAt: string;
  updatedAt: string;
}

export interface LearningMaterial {
  id: string;
  uploaderId: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  fileType: string;
  fileUrl: string;
  tags: string[];
  isAdminOnly: boolean;
  createdAt: string;
  updatedAt: string;
}
