/* eslint-disable no-console */
import { BasicTitle } from '../components/common/BasicTitle';
import { UsedIngrident } from '../components/pages/Recipe/UsedIngrident';
import { IngredientSearchForm } from '../components/pages/fridge/IngredientSearchForm';
import type { Ingredient, InputData } from './AddRecipe';
import {
  ButtonWrapper,
  DeleteWrapper,
  ImageContainer,
  ImagePreview,
  Input,
  InputContainer,
  Placeholder,
  PlusIcon,
  RecipeTitle,
  Summary,
  Thumbnail,
  TitleWrapper,
  WriteContainer,
} from './AddRecipe';
import { useRecipe } from '../hooks/useRecipe';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../constants/queryKey';
import { getDetailRecipe, updateRecipe } from '../api/recipe';
import { BasicInput } from '../components/common/BasicInput';
import { BasicButton } from '../components/common/BasicButton';
import { theme } from '../styles/theme';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { RecipeStep, StepData } from '../components/pages/Recipe/RecipeStep';

export const UpdateRecipe = () => {
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { recipeId } = useParams();
  const id = recipeId?.replace(':', '') as string;
  const [change, setChange] = useState(false);

  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery({
    queryKey: [QUERY_KEY.UPDATE_RECIPE],
    queryFn: () => getDetailRecipe(id),
    select: (data) => data.data,
    staleTime: 0,
  });

  const { register, control, handleSubmit, getValues, setValue, unregister } = useForm();

  const {
    deleteStep,
    stepImage,
    thumbnail,
    ingredient,
    addItemList,
    setIngridentAmount,
    deleteIngredientByName,
    onThumbnailChange,
    setIngredient,
    onThumbnailRemove,
    handleImageStep,
    deleteImageStep,
    handleDeleteStep,
    setAddItemList,
    setStepImage,
  } = useRecipe(getValues, setValue, unregister);

  useEffect(() => {
    setAddItemList(data?.recipeIngredients.map((item: Ingredient) => item.name));
    setIngredient(data?.recipeIngredients);
  }, [data?.recipeIngredients, id, setAddItemList, setIngredient]);

  useEffect(() => {
    setStepImage(
      data?.recipeSteps.map((image: StepData) => {
        return { image: image.stepImageUrl };
      })
    );
  }, [data?.recipeSteps, id, setStepImage]);

  const updateRecipeMutation = useMutation({
    mutationFn: updateRecipe,
    onError: (error) => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.DETAIL_RECIPE, id] });
      alert('수정되었습니다.');
      navigate(`/recipe/${id}`);
    },
  });

  const handleUpdateRecipe = (Updatedata: InputData) => {
    const originalStep = data?.recipeSteps;

    const steps = stepImage.map((_, index) => {
      const { content } = Updatedata[index];
      const { tip } = Updatedata[index];

      return {
        id: data.recipeSteps[index] ? data.recipeSteps[index].id : null,
        stepNo: data.recipeSteps[index] ? data.recipeSteps[index].stepNo : index,
        description: content,
        tip,
      };
    });

    const ChangedStep = steps.filter((changedStep, index) => {
      const originalObj = originalStep[index];
      return (
        changedStep?.description !== originalObj?.stepDescription ||
        changedStep?.tip !== originalObj?.stepTip
      );
    });

    const changedImg = stepImage.map((e) => {
      if (typeof e.image === 'string') {
        return {
          ...e,
          image: null,
        };
      }
      return e;
    });

    const finalData = {
      updateSteps: ChangedStep,
      deleteSteps: deleteStep,
      recipeImage: !thumbnail ? null : thumbnail,
      stepImages: changedImg,
      title: Updatedata.title.title,
      summary: Updatedata.summary.summary,
      ingredient,
    };

    console.log(finalData);

    updateRecipeMutation.mutate({ recipeId: id, recipeData: finalData });
  };

  const onSubmit = handleUpdateRecipe;

  return (
    <>
      <TitleWrapper>
        <BasicTitle title="어떤 재료로 수정할까요?" />
      </TitleWrapper>
      <IngredientSearchForm addItemList={addItemList} setAddItemList={setAddItemList} />
      <UsedIngrident
        addItemList={ingredient}
        setAddItemList={setIngridentAmount}
        deleteItem={deleteIngredientByName}
      />
      <WriteContainer onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title.title"
          control={control}
          defaultValue={data.title}
          render={({ field }) => (
            <RecipeTitle id="title.title" placeholder="레시피 제목 입력" {...field} />
          )}
        />
        <Summary>
          <Controller
            name="summary.summary"
            control={control}
            defaultValue={data.summary}
            render={({ field }) => (
              <BasicInput
                type="text"
                id="summary.summary"
                placeholder="레시피 요약 입력"
                {...field}
              ></BasicInput>
            )}
          />
        </Summary>
        <Thumbnail>
          <DeleteWrapper>
            <BasicButton
              type="button"
              $bgcolor={theme.colors.grayishWhite}
              $fontcolor={theme.colors.black}
              onClick={() => (!change ? setChange(true) : onThumbnailRemove)}
            >
              썸네일 삭제
            </BasicButton>
          </DeleteWrapper>

          {!change ? (
            <ImageContainer>
              {thumbnail ? (
                <ImagePreview src={URL.createObjectURL(thumbnail)} />
              ) : (
                <ImagePreview src={data.recipeImageUrl} />
              )}
            </ImageContainer>
          ) : (
            <>
              <ImageContainer>
                <Placeholder htmlFor="thumbnail">
                  <p>레시피의 썸네일을 등록하세요!</p>
                  <PlusIcon />
                </Placeholder>
              </ImageContainer>
              <InputContainer>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  id="thumbnail"
                  onChange={(e) => {
                    setChange(false);
                    onThumbnailChange(e);
                  }}
                />
              </InputContainer>
            </>
          )}
        </Thumbnail>
        {stepImage.map((e, index) => (
          <RecipeStep
            key={index}
            image={e.image}
            index={index}
            register={register}
            recipeSteps={data.recipeSteps}
            deleteImageStep={deleteImageStep}
            handleDeleteStep={handleDeleteStep}
            handleImageStep={handleImageStep}
          />
        ))}
        <BasicButton
          type="button"
          $bgcolor={theme.colors.orange}
          $fontcolor={theme.colors.white}
          onClick={() => setStepImage([...stepImage, { image: null }])}
        >
          +
        </BasicButton>
        <ButtonWrapper>
          <BasicButton
            type="button"
            $bgcolor={theme.colors.orange}
            $fontcolor={theme.colors.white}
            onClick={() => navigate('/recipe')}
          >
            돌아가기
          </BasicButton>
          <BasicButton type="submit" $bgcolor={theme.colors.orange} $fontcolor={theme.colors.white}>
            완료
          </BasicButton>
        </ButtonWrapper>
      </WriteContainer>
    </>
  );
};
