import { AxiosResponse } from "axios";
import baseUrl from "../../api";

export const getAllUsers = async (
  filter?: any,
  status?: any,
  name?: any,
  page: number = 1,
  perPage: number = 10
): Promise<AxiosResponse<any>> => {
  let url = `/users?_sort=fullname&_order=${filter}&_page=${page}&_limit=${perPage}`;
  if (status) {
    url += `&status=${status}`;
  }
  if (name) {
    url += `&fullname_like=${name}`;
  }
  try {
    const response = await baseUrl.get(url);
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
