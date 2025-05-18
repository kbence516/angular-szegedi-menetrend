import { Timestamp } from "firebase/firestore";

export interface Opinion {
  id: string;
  author: string;
  content: string;
  created: Timestamp;
}