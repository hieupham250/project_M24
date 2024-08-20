import { AxiosResponse } from "axios";
import baseUrl from "../../api";

export const getAllCourses = async (
  search?: any
): Promise<AxiosResponse<any>> => {
  let url = `/courses`;
  if (search && search !== "") {
    url += `?title_like=${search}`;
  }
  try {
    const response = await baseUrl.get(url);
    return response;
  } catch (error) {
    throw new Error(`Error fetching courses: ${error}`);
  }
};

export const createCourse = async (
  course: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.post(`/courses`, course);
    return response;
  } catch (error) {
    throw new Error(`Error adding courses: ${error}`);
  }
};

export const getCourseById = async (id: any): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.get(`/courses?id=${id}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching courses: ${error}`);
  }
};
export const updateCourse = async (
  id: any,
  course: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.patch(`/courses/${id}`, course);
    return response;
  } catch (error) {
    throw new Error(`Error fetching courses: ${error}`);
  }
};

export const deleteCourse = async (id: any): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.delete(`/courses/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching courses: ${error}`);
  }
};
