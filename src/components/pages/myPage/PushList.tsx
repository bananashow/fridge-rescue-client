/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useInfiniteQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { QUERY_KEY } from '../../../constants/queryKey';
import { myPageNotification } from '../../../api/notification';
import type { NotificationData } from '../../../types/notification';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { useNotification } from '../../../hooks/useNotification';
import InfiniteScroll from 'react-infinite-scroll-component';

export const PushList = () => {
  const noticData = useInfiniteQuery({
    queryKey: [QUERY_KEY.MYPAGE_NOTIC],
    queryFn: ({ pageParam = 1 }) => myPageNotification(pageParam),
    getNextPageParam: (_, allPages) => allPages.length,
    initialPageParam: 0,
  });

  dayjs.extend(relativeTime);
  dayjs.locale('ko');
  const now = dayjs();

  const notic = noticData.data ? noticData.data.pages.flatMap((page) => page.data.content) : [];

  const { handleRead } = useNotification({ data: notic });

  // TODO : 데이터 연동 후 map 돌리기
  return (
    <PushListContainer>
      <InfiniteScroll
        dataLength={notic.length}
        next={noticData.fetchNextPage}
        hasMore={noticData.hasNextPage || false}
        loader={null}
      >
        {notic?.map((item: NotificationData) => (
          <div
            key={item.id}
            onClick={() =>
              handleRead(
                item.id,
                item.notificationType,
                item.notificationProperty.originId,
                item.checkedAt
              )
            }
          >
            <div>
              <span className="time">{dayjs(item.createdAt).from(now)}</span>
              <p>{item.notificationProperty.contents}</p>
            </div>
            <div className="delete-btn">
              {item.checkedAt && <span>{dayjs(item.checkedAt).from(now)}에 읽음</span>}
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </PushListContainer>
  );
};

const PushListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  .time {
    font-size: 12px;
    color: ${(props) => props.theme.colors.darkGray};
  }

  & > div > div > div {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.sky}40;
    padding: 12px 16px;
    border-radius: 12px;
    margin: 12px 0 12px 0;

    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
  }

  .delete-btn {
    padding: 6px 12px;
    border-radius: 6px;
    transition: all 0.3s;
    font-size: 14px;
    color: ${(props) => props.theme.colors.blue};
  }
`;
