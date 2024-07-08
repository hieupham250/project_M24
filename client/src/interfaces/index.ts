export interface User {
  id?: number;
  fullName: string;
  avatar: string;
  email: string;
  password: string;
  address: string;
  dayOfBirth: string;
  phone: string;
  status: boolean;
  role: string;
  created_at: string;
}

export interface Course {
  id?: number;
  title: string;
  description: string;
  created_at: string;
}

export interface ExamSubject {
  id?: number;
  title: string;
  description: string;
  courseId?: number;
  created_at: string;
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: 90;
  examSubjectId: number;
  created_at: string;
}

export interface Question {
  id: number;
  question: string;
  examId: number;
  options: [];
  answer: string;
}

export interface UserAnswer {
  id: number;
  userId: number;
  examId: number;
  score: number;
}
