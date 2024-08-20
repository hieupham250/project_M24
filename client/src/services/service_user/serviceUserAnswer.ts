import { AxiosResponse } from "axios";
import baseUrl from "../../api";

export const getAllUserAnswers = async (
  userId?: any,
  examId?: any
): Promise<AxiosResponse<any>> => {
  let url = `userAnswers`;
  if (userId && userId !== "" && examId && examId !== "") {
    url += `?userId=${userId}&examId=${examId}`;
  }
  try {
    const response = await baseUrl.get(url);
    return response;
  } catch (error) {
    throw new Error(`Error fetching userAnswers: ${error}`);
  }
};

export const createUserAnswer = async (
  userAnswer: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.post(`/userAnswers`, userAnswer);
    return response;
  } catch (error) {
    throw new Error(`Error adding userAnswers: ${error}`);
  }
};

export const getUserAnswerById = async (
  id: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.get(`/userAnswers?id=${id}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching userAnswers: ${error}`);
  }
};
export const updateUserAnswer = async (
  id: any,
  userAnswer: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.patch(`/userAnswers/${id}`, userAnswer);
    return response;
  } catch (error) {
    throw new Error(`Error fetching userAnswers: ${error}`);
  }
};

export const deleteUserAnswer = async (
  id: any
): Promise<AxiosResponse<any>> => {
  try {
    const response = await baseUrl.delete(`/userAnswers/${id}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching userAnswers: ${error}`);
  }
};
