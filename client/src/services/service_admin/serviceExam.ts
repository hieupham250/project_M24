import { AxiosResponse } from "axios";
import baseUrl from "../../api";

export const getAllExams = async (
  examId?: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.get(`/exams?examSubjectId=${examId}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching exams: ${error}`);
  }
};

export const createExam = async (exam: any): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.post(`/exams`, exam);
    return response;
  } catch (error) {
    throw new Error(`Error adding exams: ${error}`);
  }
};

export const getExamById = async (id: any): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.get(`/exams?id=${id}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching exams: ${error}`);
  }
};
export const updateExam = async (
  id: any,
  exam: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.patch(`/exams/${id}`, exam);
    return response;
  } catch (error) {
    throw new Error(`Error fetching exams: ${error}`);
  }
};

export const deleteExam = async (id: any): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.delete(`/exams/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching exams: ${error}`);
  }
};
