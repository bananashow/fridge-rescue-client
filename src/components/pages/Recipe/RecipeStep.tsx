import { styled } from 'styled-components';
import { BasicButton } from '../../common/BasicButton';
import { theme } from '../../../styles/theme';
import { type ChangeEvent } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface stepProps {
  image: File | null;
  index: number;
  control: Control;
  handleDeleteStep: (index: number) => void;
  deleteImageStep: (index: number) => void;
  handleImageStep: (event: ChangeEvent<HTMLInputElement>, index: number) => void;
}

export const RecipeStep = ({
  image,
  index,
  control,
  deleteImageStep,
  handleDeleteStep,
  handleImageStep,
}: stepProps) => {
  return (
    <>
      <TopWrapper>
        {image && (
          <BasicButton
            type="button"
            $bgcolor={theme.colors.grayishWhite}
            $fontcolor={theme.colors.black}
            onClick={() => deleteImageStep(index)}
          >
            이미지 삭제
          </BasicButton>
        )}
        {index >= 1 && <StyledTrash onClick={() => handleDeleteStep(index)} />}
      </TopWrapper>

      <RecipeContainer>
        <div>
          {image ? (
            <ImageWrapper>
              <UploadImage
                className="uploadImg"
                src={URL.createObjectURL(image)}
                alt="업로드된 이미지"
              />
            </ImageWrapper>
          ) : (
            <>
              <Placeholder htmlFor={`${index}file`}>
                <p>이미지 추가</p>
                <PlusIcon />
              </Placeholder>

              <FileInput
                type="file"
                id={`${index}file`}
                accept="image/*"
                onChange={(event) => handleImageStep(event, index)}
              />
            </>
          )}
          <Controller
            name={`${index}.tip`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                id={`${index}.tip`}
                type="text"
                placeholder="당신만의 팁은?"
                {...field}
              ></input>
            )}
          />
        </div>
        <Controller
          name={`${index}.content`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Content
              id={`${index}.content`}
              placeholder="레시피의 내용을 입력해 주세요."
              {...field}
            ></Content>
          )}
        />
      </RecipeContainer>
    </>
  );
};

const TopWrapper = styled.div`
  height: 45px;
  position: relative;
  display: flex;
  align-items: center;
  button {
    max-width: 90px;
    padding: 3px 3px 3px 3px;
  }
`;

const RecipeContainer = styled.div`
  display: flex;
  margin-bottom: 20px;

  & > div > input[type='text'] {
    margin-top: 14px;
    border-radius: 10px;
    width: 100%;
    padding: 8px;
    border: 1px solid ${(props) => props.theme.colors.gray};
  }
`;

const UploadImage = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const FileInput = styled.input`
  display: none;
`;

const Content = styled.textarea`
  width: 90%;
  height: 247px;
  margin-left: 20px;
  border-radius: 10px;
  padding: 12px;
  font-size: 18px;
  border: 1px solid ${(props) => props.theme.colors.gray};
  resize: none;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const Placeholder = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 200px;
  height: 200px;
  border: 3px dashed ${(props) => props.theme.colors.blue}90;
  border-radius: 5px;
  color: ${(props) => props.theme.colors.blue};
  cursor: pointer;

  P {
    margin-bottom: 17px;
  }
`;

const PlusIcon = styled(FaPlus)`
  font-size: 24px;
  margin-bottom: 4px;
`;

const StyledTrash = styled(FaTrash)`
  position: absolute;
  right: 0;
  bottom: 0;
  fill: ${(props) => props.theme.colors.darkGray};
  min-width: 25px;
  min-height: 25px;
  margin-bottom: 10px;
  margin-right: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
