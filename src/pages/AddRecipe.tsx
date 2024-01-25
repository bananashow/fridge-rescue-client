import { styled } from 'styled-components';
import { BasicButton } from '../components/common/BasicButton';
import { BasicTitle } from '../components/common/BasicTitle';
import { theme } from '../styles/theme';
import { useRef } from 'react';
import { IngredientSearchForm } from '../components/pages/fridge/IngredientSearchForm';
import { FaPlus } from 'react-icons/fa6';
import { useForm } from 'react-hook-form';
import { RecipeStep } from '../components/pages/Recipe/RecipeStep';
import { UsedIngrident } from '../components/pages/Recipe/UsedIngrident';
import { useRecipe } from '../hooks/useRecipe';
import { useNavigate } from 'react-router-dom';

export interface StepImage {
  image: File | null | string;
}

export interface InputData {
  [index: number | string]: {
    content: string;
    tip: string;
    title: string;
    summary: string;
  };
}

export interface Ingredient {
  id?: number;
  name: string;
  amount: string;
}

export const AddRecipe = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddRecipe = async (data: InputData) => {
    if (thumbnail === null) {
      // eslint-disable-next-line no-alert
      alert('썸네일은 필수 입니다.');
      return;
    }

    const steps = stepImage.map((_, index) => {
      const { content, tip } = data[index];

      return {
        description: content,
        tip,
      };
    });

    const finalData = {
      title: data.title,
      summary: data.summary,
      recipeImage: thumbnail,
      steps,
      ingredient,
      stepImage,
    };

    console.log(finalData);

    addRecipeMutation.mutate(finalData);
  };

  const { register, handleSubmit, getValues, setValue, unregister } = useForm();
  const onSubmit = handleSubmit(handleAddRecipe);

  const {
    stepImage,
    thumbnail,
    ingredient,
    addItemList,
    setIngridentAmount,
    deleteIngredientByName,
    onThumbnailChange,
    onThumbnailRemove,
    handleImageStep,
    deleteImageStep,
    addRecipeMutation,
    handleDeleteStep,
    setAddItemList,
    setStepImage,
  } = useRecipe(getValues, setValue, unregister);

  return (
    <>
      <TitleWrapper>
        <BasicTitle title="어떤 재료를 사용할까요?" />
      </TitleWrapper>
      <IngredientSearchForm addItemList={addItemList} setAddItemList={setAddItemList} />
      <UsedIngrident
        addItemList={ingredient}
        setAddItemList={setIngridentAmount}
        deleteItem={deleteIngredientByName}
      />
      <WriteContainer onSubmit={onSubmit}>
        <RecipeTitle {...register('title')} id="title" placeholder="레시피 제목 입력" />
        <Summary>
          <input {...register('summary')} type="text" id="summary" placeholder="레시피 요약 입력" />
        </Summary>
        <Thumbnail>
          {thumbnail && (
            <DeleteWrapper>
              <BasicButton
                type="button"
                $bgcolor={theme.colors.grayishWhite}
                $fontcolor={theme.colors.black}
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                  onThumbnailRemove();
                }}
              >
                썸네일 삭제
              </BasicButton>
            </DeleteWrapper>
          )}
          <ImageContainer>
            {thumbnail ? (
              <ImagePreview src={URL.createObjectURL(thumbnail)} />
            ) : (
              <Placeholder htmlFor="thumbnail">
                <p>레시피의 썸네일을 등록하세요!</p>
                <PlusIcon />
              </Placeholder>
            )}
          </ImageContainer>
          <InputContainer>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              id="thumbnail"
              onChange={onThumbnailChange}
            />
          </InputContainer>
        </Thumbnail>
        {stepImage.map((e, index) => (
          <RecipeStep
            key={index}
            image={e.image}
            index={index}
            register={register}
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

export const TitleWrapper = styled.div`
  display: grid;
  grid-template-columns: 90% 10%;
`;

export const WriteContainer = styled.form`
  display: grid;
  grid-template-columns: 100%;
  margin-top: 50px;
`;

export const RecipeTitle = styled.input`
  height: 50px;
  border: none;
  font-size: 24px;
  padding-left: 10px;
  outline: none;
`;

export const Summary = styled.div`
  & > input {
    border: none;
    width: 100%;
    outline: none;
    padding-left: 10px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 50px;

  button:nth-child(1) {
    margin-right: 10px;
  }
`;

export const Thumbnail = styled.div`
  margin: 10px 0 5px 0;

  button {
    max-width: 90px;
    padding: 3px 3px 3px 3px;
    margin-bottom: 10px;
  }
`;

export const DeleteWrapper = styled.div`
  display: flex;
  justify-content: end;
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

export const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Placeholder = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border: 3px dashed ${(props) => props.theme.colors.blue}90;
  border-radius: 5px;
  color: ${(props) => props.theme.colors.blue};
  cursor: pointer;

  P {
    margin-bottom: 17px;
  }
`;

export const Input = styled.input`
  display: none;
`;

export const InputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

export const PlusIcon = styled(FaPlus)`
  font-size: 24px;
  margin-bottom: 4px;
`;
