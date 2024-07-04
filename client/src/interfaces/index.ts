export interface User {
  id?: number; // id người dùng
  fullName: string; // tên đầy đủ
  avatar: string; // ảnh đại diện
  email: string;
  password: string;
  address: string;
  dayOfBirth: string;
  gender: string;
  phone: string;
  status: boolean;
  role: string;
  created_at: string; // thời gian tạo
  updated_at: string; // thời gian cập nhật
}
