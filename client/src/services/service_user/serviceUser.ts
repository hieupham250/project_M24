import { AxiosResponse } from "axios";
import baseUrl from "../../api";

export const getAllUsers = async (): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.get("/users");
    return response;
  } catch (error) {
    throw new Error(`Error fetching users: ${error}`);
  }
};

export const getUserById = async (id: any): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.get(`/users?id=${id}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching users: ${error}`);
  }
};
export const updateUser = async (user: any): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.patch(`/users/${user.id}`, user);
    return response;
  } catch (error) {
    throw new Error(`Error fetching users: ${error}`);
  }
};

export const deleteUser = async (id: any): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.delete(`/users/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching users: ${error}`);
  }
};

export const createUser = async (user: any): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.post(`/users`, user);
    return response;
  } catch (error) {
    throw new Error(`Error adding user: ${error}`);
  }
};
