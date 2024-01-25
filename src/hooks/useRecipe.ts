import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { addNewRecipe } from '../api/recipe'; // addNewRecipe API 호출 함수를 임포트해야 합니다.
import type { Ingredient } from '../pages/AddRecipe';
import { useMutation } from '@tanstack/react-query';
import { useSelectItem } from './useSelectItem';
import { useNavigate } from 'react-router-dom';
import type {
  FieldValues,
  UseFormGetValues,
  UseFormSetValue,
  UseFormUnregister,
} from 'react-hook-form';

interface StepImg {
  image: File | null | string;
}

export function useRecipe(
  getValues: UseFormGetValues<FieldValues>,
  setValue: UseFormSetValue<FieldValues>,
  unregister: UseFormUnregister<FieldValues>
) {
  const navigate = useNavigate();
  const [stepImage, setStepImage] = useState<StepImg[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [ingredient, setIngredient] = useState<Ingredient[]>();
  const { addItemList, setAddItemList } = useSelectItem();
  const [deleteStep, setDeleteStep] = useState<number[]>([]);

  useEffect(() => {
    const uniqueAddItemList = Array.from(new Set(addItemList));
    const newIngredients = uniqueAddItemList
      .filter((name) => !ingredient?.some((item) => item.name === name))
      .map((name) => ({ name, amount: '' }));

    setIngredient((prev) => [...(prev || []), ...newIngredients]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addItemList]);

  const setIngridentAmount = (name: string, amount: string) => {
    const newIngrident = ingredient?.map((item) =>
      item.name === name ? { ...item, amount } : item
    );

    setIngredient(newIngrident);
  };

  const deleteIngredientByName = (name: string) => {
    const updatedIngredients = ingredient?.filter((item) => item.name !== name);
    setIngredient(updatedIngredients);

    const updatedAddItemList = addItemList?.filter((itemName) => itemName !== name);
    setAddItemList(updatedAddItemList);
  };

  const onThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const thumbnail = event.target.files && event.target.files[0];
      setThumbnail(thumbnail);
    }
  };

  const onThumbnailRemove = () => {
    setThumbnail(null);
  };

  const handleImageStep = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const newImage = [...stepImage];
    const file = event.target.files && event.target.files[0];

    if (file) {
      newImage[index] = {
        image: file,
      };
      setStepImage(newImage);
    }
  };

  const deleteImageStep = (index: number) => {
    const newStep = [...stepImage];
    newStep[index] = {
      ...newStep[index],
      image: null,
    };
    setStepImage(newStep);
  };

  const addRecipeMutation = useMutation({
    mutationFn: addNewRecipe,
    onError: (error) => console.log(error),
    onSuccess: (data) => {
      // eslint-disable-next-line no-alert
      alert('레시피를 성공적으로 저장했습니다.');
      navigate(`/recipe/${data.data.id}`);
    },
  });

  const handleDeleteStep = (index: number, id: number) => {
    deleteImageStep(index);

    if (!deleteStep.includes(id)) {
      setDeleteStep([...deleteStep, id]);
    }

    stepImage.forEach((_, i) => {
      if (i >= index && i < stepImage.length - 1) {
        setValue(`${i}.tip`, getValues(`${i + 1}.tip`));
        setValue(`${i}.content`, getValues(`${i + 1}.content`));
      }
    });

    const lastIndex = stepImage.length - 1;
    unregister(`${lastIndex}.tip`);
    unregister(`${lastIndex}.content`);

    const newStepImage = stepImage.filter((_, idx) => idx !== index);
    setStepImage(newStepImage);
  };

  return {
    deleteStep,
    setValue,
    stepImage,
    thumbnail,
    ingredient,
    addItemList,
    setIngridentAmount,
    deleteIngredientByName,
    onThumbnailChange,
    onThumbnailRemove,
    setIngredient,
    handleImageStep,
    deleteImageStep,
    addRecipeMutation,
    handleDeleteStep,
    setAddItemList,
    setStepImage,
  };
}
