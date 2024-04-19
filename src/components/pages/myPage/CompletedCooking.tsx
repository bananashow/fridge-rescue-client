import { useInfiniteQuery } from '@tanstack/react-query';
import { getCompletedCooking } from '../../../api/member';
import { QUERY_KEY } from '../../../constants/queryKey';
import InfiniteScroll from 'react-infinite-scroll-component';
import { type CompletedDish } from '../../../types/recipeType';
import { RecipeCard } from '../../common/RecipeCard';
import styled from 'styled-components';

export const CompletedCooking = () => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEY.GET_COMPLETED_COOKING],
    queryFn: ({ pageParam }) => getCompletedCooking(6, pageParam),
    initialPageParam: 0,
    getNextPageParam: (_, allPages) => {
      return allPages.length;
    },
  });

  return (
    <>
      <InfiniteScroll
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={null}
        dataLength={data ? data.pages?.flatMap((page) => page.data.content).length : 0}
      >
        <CardList>
          {data?.pages
            .flatMap((page) => page.data.content)
            .map((info: CompletedDish) => (
              <RecipeCard
                recipeId={info?.id}
                key={info?.id}
                recipeTitle={info?.recipeInfoDto.title}
                briefExplanation={info?.recipeInfoDto.summary}
                imageURL={info?.recipeInfoDto.imageUrl}
                date={info?.recipeInfoDto.createdAt}
                reviewCount={info?.recipeInfoDto.reviewCount}
                auther={info?.recipeInfoDto.author.nickname}
                viewCount={info?.recipeInfoDto.viewCount}
                size="small"
              />
            ))}
        </CardList>
      </InfiniteScroll>

      {!data?.content && <NoRecipe>완료한 요리가 없어요!</NoRecipe>}
    </>
  );
};

const CardList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 48px;
`;

const NoRecipe = styled.div`
  margin: -48px auto;
  font-size: 18px;
  text-align: center;
`;
