import { AxiosResponse } from "axios";
import baseUrl from "../../api";

export const getAllExamSubjects = async (
  courseId?: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.get(`/examSubjects?courseId=${courseId}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching examSubjects: ${error}`);
  }
};
export const getAllExamSubjectsSelect = async (): Promise<
  AxiosResponse<any>
> => {
  try {
    const response = await baseUrl.get(`/examSubjects`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching examSubjects: ${error}`);
  }
};
export const createExamSubject = async (
  examSubject: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.post(`/examSubjects`, examSubject);
    return response;
  } catch (error) {
    throw new Error(`Error adding examSubjects: ${error}`);
  }
};

export const getExamSubjectById = async (
  id: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.get(`/examSubjects?id=${id}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching examSubjects: ${error}`);
  }
};
export const updateExamSubject = async (
  id: any,
  examSubject: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.patch(`/examSubjects/${id}`, examSubject);
    return response;
  } catch (error) {
    throw new Error(`Error fetching examSubjects: ${error}`);
  }
};

export const deleteExamSubject = async (
  id: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.delete(`/examSubjects/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching examSubjects: ${error}`);
  }
};
