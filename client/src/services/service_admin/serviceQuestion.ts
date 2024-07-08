import { AxiosResponse } from "axios";
import baseUrl from "../../api";

export const getAllQuestions = async (): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.get("/questions");
    return response;
  } catch (error) {
    throw new Error(`Error fetching questions: ${error}`);
  }
};

export const createQuestion = async (
  exam: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.post(`/questions`, exam);
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
  exam: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.patch(`/questions/${id}`, exam);
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
