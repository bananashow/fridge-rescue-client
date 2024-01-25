import { END_POINTS } from '../constants/api';
import type { PasswordFormData } from '../types/memberType';
import { axiosAuth } from './axiosInstance';

export const editNickname = async (nickname: string) => {
  const result = await axiosAuth.patch(`/members/info/nickname`, nickname);
  return result.data;
};

export const editPassword = async (passwordInfo: PasswordFormData) => {
  const result = await axiosAuth.patch(`/members/info/password`, {
    currentPassword: passwordInfo.currentPassword,
    newPassword: passwordInfo.editPassword,
    newPasswordCheck: passwordInfo.editPassword,
    // newPasswordCheck는 서버 재배포 시 삭제
  });
  return result.data;
};

export const getBookmarkedRecipe = async (page: number) => {
  const result = await axiosAuth.get(`${END_POINTS.BOOKMARK}?page=${page}`);
  return result.data;
};

export const getMyRecipes = async (size: number, page = 0) => {
  const result = await axiosAuth.get(
    `${END_POINTS.MEMBER_RECIPE}?page=${page}&size=${size}&sort=createdAt,desc`
  );
  return result.data;
};

export const getCompletedCooking = async (size: number, page = 0) => {
  const result = await axiosAuth.get(
    `${END_POINTS.MEMBER_COOK}?page=${page}&size=${size}&sort=createdAt,desc`
  );
  return result.data;
};
