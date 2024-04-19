import { END_POINTS } from '../constants/api';
import type { Ingredient, StepImage } from '../pages/AddRecipe';
import { axiosAuth, axiosDefault, axiosFormData } from './axiosInstance';

interface Requset {
  content: string;
  tip: string;
  title: string;
  summary: string;
}

interface AddRecipeData {
  title: string | Requset;
  summary: string | Requset;
  recipeImage: File;
  steps: {
    description: string;
    tip: string;
  }[];
  ingredient: Ingredient[] | undefined;
  stepImage: StepImage[];
}

interface UpdateRecipeData {
  recipeId: string;
  recipeData: {
    updateSteps: {
      id: number;
      stepNo: number;
      description: string;
      tip: string;
    }[];
    deleteSteps: number[];
    recipeImage: File | null;
    stepImages: StepImage[] | null;
    title: string | undefined;
    summary: string | undefined;
    ingredient: Ingredient[] | undefined;
  };
}

export const getNewRecipe = async () => {
  const response = await axiosDefault.get(END_POINTS.RECIPES, {
    params: { keyword: '당근', sortType: 'hot' },
  });
  return response.data;
};

export const getDetailRecipe = async (recipeId: string) => {
  const result = await axiosAuth.get(`${END_POINTS.RECIPES}/${recipeId}`);
  return result.data;
};

export const addNewRecipe = async (recipeData: AddRecipeData) => {
  const formData = new FormData();

  const requestData = {
    title: recipeData.title,
    summary: recipeData.summary,
    ingredients: recipeData.ingredient,
    steps: recipeData.steps,
  };

  console.log(requestData);

  const requestBlob = new Blob([JSON.stringify(requestData)], { type: 'application/json' });

  formData.append('request', requestBlob);

  recipeData.stepImage.forEach((item) => {
    formData.append(`stepImages`, item.image || new Blob());
  });

  formData.append('recipeImage', recipeData.recipeImage);

  const { data } = await axiosFormData.post(END_POINTS.RECIPES, formData);

  return data;
};

export const toggleBookmark = async (recipeId: string) => {
  const result = await axiosAuth.post(`${END_POINTS.RECIPES}/${recipeId}/bookmark`);
  return result.data;
};

export const updateRecipe = async ({ recipeId, recipeData }: UpdateRecipeData) => {
  const formData = new FormData();

  const requestData = {
    title: recipeData.title,
    summary: recipeData.summary,
    ingredients: recipeData.ingredient,
    updateSteps: recipeData.updateSteps,
    deleteSteps: recipeData.deleteSteps,
  };

  const requestBlob = new Blob([JSON.stringify(requestData)], { type: 'application/json' });

  formData.append('request', requestBlob);

  recipeData.stepImages?.forEach((item) => {
    formData.append(`stepImages`, item.image || new Blob());
  });

  if (recipeData.recipeImage) {
    formData.append('recipeImage', recipeData.recipeImage);
  }

  const { data } = await axiosFormData.patch(`${END_POINTS.RECIPES}/${recipeId}`, formData);
  return data;
};

export const getLatestRecipes = async (size: number, page = 0) => {
  const result = await axiosDefault.get(`${END_POINTS.RECIPES}/recent?page=${page}&size=${size}`);
  return result.data;
};

export const getPopularRecipes = async (size: number, page = 0) => {
  const result = await axiosDefault.get(`${END_POINTS.RECIPES}/popular?page=${page}&size=${size}`);
  return result.data;
};

export const getRecipesCount = async () => {
  const result = await axiosDefault.get(`${END_POINTS.RECIPES}`);
  return result.data;
};

export const deleteRecipe = async (recipeId: string) => {
  const result = await axiosAuth.delete(`${END_POINTS.RECIPES}/${recipeId}`);
  return result.data;
};
