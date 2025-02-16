import { AxiosResponse } from "axios";
import baseUrl from "../../api";

export const getAllExams = async (
  examSubjectId?: any,
  search?: any
): Promise<AxiosResponse<any>> => {
  let url = `/exams?`;
  if (examSubjectId && examSubjectId !== "") {
    url += `examSubjectId=${examSubjectId}`;
  }
  if (search && search !== "") {
    url += `&title_like=${search}`;
  }

  try {
    const response = await baseUrl.get(url);
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
