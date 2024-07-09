import { AxiosResponse } from "axios";
import baseUrl from "../../api";

export const getAllQuestions = async (
  examId?: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.get(`/questions?examId=${examId}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching questions: ${error}`);
  }
};

export const createQuestion = async (
  question: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.post(`/questions`, question);
    return response;
  } catch (error) {
    throw new Error(`Error adding questions: ${error}`);
  }
};

export const getQuestionById = async (id: any): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.get(`/questions?id=${id}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching questions: ${error}`);
  }
};
export const updateQuestion = async (
  id: any,
  question: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.patch(`/questions/${id}`, question);
    return response;
  } catch (error) {
    throw new Error(`Error fetching questions: ${error}`);
  }
};

export const deleteQuestion = async (id: any): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.delete(`/questions/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching questions: ${error}`);
  }
};
