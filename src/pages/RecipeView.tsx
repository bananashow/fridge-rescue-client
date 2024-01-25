/* eslint-disable no-alert */
import styled from 'styled-components';
import { BasicButton } from '../components/common/BasicButton';
import { BasicTitle } from '../components/common/BasicTitle';
import { RiBookmarkLine, RiBookmarkFill } from 'react-icons/ri';
import { BsExclamationSquare } from 'react-icons/bs';
import { PiSirenFill, PiCookingPotDuotone, PiEyeDuotone } from 'react-icons/pi';
import { GiCook } from 'react-icons/gi';
import { useState } from 'react';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { type ErrorResponse, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteRecipe, getDetailRecipe, toggleBookmark } from '../api/recipe';
import { QUERY_KEY } from '../constants/queryKey';
import { formatDate } from '../utils/formatDate';
import { Chip } from '@mui/material';
import type { Ingredient, RecipeSteps } from '../types/recipeType';
import { ImageModal } from '../components/common/ImageModal';
import { makeReport } from '../api/report';
import { BasicInput } from '../components/common/BasicInput';
import { type AxiosError } from 'axios';
import { RecipeReviewList } from '../components/pages/recipe/RecipeReviewList';
import { useRecoilValue } from 'recoil';
import { NickNameAtom } from '../store/auth';

export const RecipeView = () => {
  const navigation = useNavigate();
  const { pathname } = useLocation();
  const recipeId = pathname.split('/').pop() || '';
  const [cookingCompletion, setCookingCompletion] = useState(false);
  const [isImageModalOpened, setImageModalOpen] = useState(false);
  const [reportModalIsOpened, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const user = useRecoilValue(NickNameAtom);

  const handleImageModal = (isOpen: boolean) => {
    setImageModalOpen(isOpen);
  };

  const cookingCompletionOnAgree = () => {
    navigation('/review/ingredient', {
      state: {
        recipeId,
      },
    });
  };

  const handleCookingCompletion = (isComplete: boolean) => {
    setCookingCompletion(isComplete);
  };

  // ------------------------- 북마크 -------------------------

  const bookmarkMutation = useMutation({
    mutationFn: toggleBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.DETAIL_RECIPE],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GET_BOOKMARKED_RECIPE],
      });
    },
  });

  const handleBookmark = () => {
    bookmarkMutation.mutate(recipeId);
  };

  // ------------------------- 신고 -------------------------

  const queryClient = useQueryClient();
  const handleReportModal = (isOpen: boolean) => {
    setReportModalOpen(isOpen);
  };

  const reportMutation = useMutation({
    mutationFn: () => makeReport(recipeId, reportReason),
    onSuccess: () => {
      alert('신고 처리 되었습니다.');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.DETAIL_RECIPE],
      });
    },
    onError: (err) => {
      const axiosError = err as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 409) {
        alert('이미 신고한 레시피입니다.');
      }
    },
  });

  const reportOnAgree = () => {
    if (reportReason === '') {
      alert('신고 내용을 입력하세요!');
      return;
    }
    reportMutation.mutate();
  };

  const { data } = useQuery({
    queryKey: [QUERY_KEY.DETAIL_RECIPE, recipeId],
    queryFn: () => getDetailRecipe(recipeId),
    select: (data) => data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_MY_RECIPE, recipeId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_LATEST_RECIPE] });
      navigation('/mypage');
      alert('삭제가 완료되었습니다.');
    },
  });

  const handleDeleteRecipe = () => {
    deleteMutation.mutate(recipeId);
  };

  return (
    <>
      <RecipeViewContainer>
        <div className="recipe-detail">
          <div className="header">
            <BasicTitle title={data?.title} />
          </div>
          <div className="post-info">
            <div>
              <span className="name">{data?.author.nickname}</span>
              <span className="date">{formatDate(data?.createdAt)}</span>
              <span className="count">
                <span>
                  <PiEyeDuotone /> {data?.viewCount}
                </span>
                <span>
                  <PiCookingPotDuotone />
                  {data?.reviewCount}
                </span>
                {user === data?.author.nickname && (
                  <>
                    <UpdateBtn onClick={() => navigation(`/recipe/update/${recipeId}`)}>
                      수정
                    </UpdateBtn>
                    <UpdateBtn onClick={handleDeleteRecipe}>삭제</UpdateBtn>
                  </>
                )}
              </span>
            </div>
            <div>
              <div className="icons">
                <span role="button" onClick={handleBookmark}>
                  {data?.isBookmarked ? <RiBookmarkFill /> : <RiBookmarkLine />}
                </span>
                <span>{data?.bookmarkCount}</span>
              </div>
              <div className="icons siren">
                <span role="button" onClick={() => handleReportModal(true)}>
                  <PiSirenFill />
                </span>
                <span>{data?.reportCount}</span>
              </div>
            </div>
          </div>
          <div className="recipe-step">
            <div className="thumbnail">
              <img src={data?.recipeImageUrl} alt="썸네일" />
            </div>
            <p className="summary">{data?.summary}</p>

            <div className="ingredient">
              <h3>
                <GiCook />
                재료
              </h3>
              <span className="chips">
                {data?.recipeIngredients.map((ingredient: Ingredient) => {
                  return (
                    <Chip label={`${ingredient.name} ${ingredient.amount}`} key={ingredient.name} />
                  );
                })}
              </span>
            </div>

            {data?.recipeSteps.map((step: RecipeSteps) => {
              return (
                <div className="step" key={step.stepNo}>
                  <div role="button" onClick={() => handleImageModal(true)}>
                    <img src={step?.stepImageUrl} alt="단계별 레시피" />
                  </div>
                  <div>
                    {step.stepNo}. {step.stepDescription}
                  </div>
                  {step.stepTip && (
                    <div className="tip">
                      <BsExclamationSquare />
                      tip : {step.stepTip}
                    </div>
                  )}
                  {isImageModalOpened && (
                    <ImageModal
                      imageUrl={step.stepImageUrl}
                      alt="음식 재료"
                      handleImageModal={handleImageModal}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <BasicButton
            $bgcolor="#ff8527"
            type="text"
            $fontcolor="#fff"
            onClick={() => handleCookingCompletion(true)}
          >
            요리 완료
          </BasicButton>
        </div>
        <RecipeReviewList />
        {cookingCompletion && (
          <ConfirmModal
            title="요리를 완료할까요?"
            description="냉장고 재료 수정 페이지로 이동합니다"
            isOpen={cookingCompletion}
            handleOpen={handleCookingCompletion}
            onAgree={cookingCompletionOnAgree}
          />
        )}
        {reportModalIsOpened && (
          <ConfirmModal
            title="해당 레시피를 신고할까요?"
            description="신고 내용을 아래에 기재해 주세요!"
            handleOpen={handleReportModal}
            isOpen={reportModalIsOpened}
            onAgree={reportOnAgree}
          >
            <BasicInput
              type="text"
              placeholder="신고 내용"
              onChange={(e) => setReportReason(e!.target.value)}
            />
          </ConfirmModal>
        )}
      </RecipeViewContainer>
    </>
  );
};

const RecipeViewContainer = styled.div`
  .header {
    display: flex;
    justify-content: space-between;

    & > svg {
      font-size: 26px;
      cursor: pointer;
    }
  }

  .post-info {
    display: flex;
    justify-content: space-between;

    & > div {
      display: flex;
      gap: 12px;

      &:first-child {
        font-size: 15px;
      }
    }

    svg {
      font-size: 18px;
      cursor: pointer;
    }

    .icons {
      display: flex;
      gap: 2px;
    }

    .siren {
      color: #e30000;
    }

    .name {
      color: ${(props) => props.theme.colors.blue};
      font-family: Pretendard-SemiBold;
    }

    .date {
      color: ${(props) => props.theme.colors.darkGray}90;
    }

    .count {
      color: ${(props) => props.theme.colors.darkGray};
      display: flex;
      gap: 12px;

      & > span {
        display: flex;
        gap: 3px;
      }
    }
  }

  .recipe-step {
    .ingredient {
      border: 1px solid ${(props) => props.theme.colors.lightGray};
      border-radius: 12px;
      padding: 24px;
      margin-top: 24px;

      h3 {
        color: ${(props) => props.theme.colors.black};
        margin: 0 0 12px 4px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
    }

    .summary {
      padding: 24px 0;
    }

    .thumbnail {
      margin: 12px 0;
      width: 100%;
      max-height: 380px;
      overflow: hidden;

      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }

    .step {
      font-size: 16px;
      padding: 12px 0;

      display: grid;
      align-items: center;
      gap: 12px;
      grid-template-columns: 30% 1fr;
      grid-template-areas:
        'image content'
        'tip tip';
      margin-top: 36px;

      img {
        width: 100%;
        height: auto;
        display: block;
      }

      .tip {
        grid-area: tip;
        display: flex;
        align-items: center;
        gap: 6px;
        color: ${(props) => props.theme.colors.darkGray};

        & > svg {
          color: ${(props) => props.theme.colors.orange};
        }
      }
    }
  }

  button {
    margin-top: 12px;
  }
`;

const UpdateBtn = styled.span`
  cursor: pointer;
`;
