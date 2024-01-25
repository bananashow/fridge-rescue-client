/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styled, { keyframes } from 'styled-components';
import { useEffect } from 'react';
import { device } from '../../styles/media';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/queryKey';
import { notification } from '../../api/notification';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import type { NotificationData } from '../../types/notification';
import { useNotification } from '../../hooks/useNotification';

interface Props {
  handleSidebar: () => void;
  isOpen: boolean;
}

export const SideBar = ({ handleSidebar, isOpen }: Props) => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [QUERY_KEY.NOTIFICATION],
    queryFn: notification,
    select: (data) => data.data.content,
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.NOTIFICATION] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  dayjs.extend(relativeTime);
  dayjs.locale('ko');
  const now = dayjs();

  const { handleRead, handleAllRead } = useNotification({ handleSidebar, data });

  return (
    <Container onClick={handleSidebar}>
      <SideMenuWrapper
        style={{ transform: `translateX(${isOpen ? '0' : '-100%'})` }}
        onClick={(event) => event.stopPropagation()}
      >
        <p>알림</p>
        <NotificationList>
          <AllRead>
            <button type="button" onClick={handleAllRead}>
              모두 읽음
            </button>
          </AllRead>
          {data?.map((item: NotificationData) => (
            <div key={item.id}>
              {!item.checkedAt && (
                <Wrapper>
                  <Item
                    onClick={() =>
                      handleRead(
                        item.id,
                        item.notificationType,
                        item.notificationProperty.originId,
                        item.checkedAt
                      )
                    }
                  >
                    <Notification>
                      <Content>{item.notificationProperty.contents}</Content>
                      <Time>{dayjs(item.createdAt).from(now)}</Time>
                    </Notification>
                  </Item>
                  <DeleteButtonWrapper>
                    {item.checkedAt && <span>{dayjs(item.checkedAt).from(now)}에 읽음</span>}
                  </DeleteButtonWrapper>
                </Wrapper>
              )}
            </div>
          ))}
        </NotificationList>
      </SideMenuWrapper>
    </Container>
  );
};

const SlideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const Item = styled.div`
  cursor: pointer;
`;

const Container = styled.div`
  width: 100%;
  min-width: 360px;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  z-index: 200;
  top: 0;
`;

const AllRead = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
`;

const SideMenuWrapper = styled.div`
  font-size: 35px;
  font-weight: 700;
  position: fixed;
  top: 0;
  left: 0;
  width: 450px;
  height: 100%;
  padding: 30px;
  background-color: ${(props) => props.theme.colors.white};
  display: flex;
  flex-direction: column;
  animation: ${SlideIn} 0.5s ease-in-out;

  @media ${device.mobile} {
    width: 200px;
  }
`;

const Wrapper = styled.div`
  position: relative;
`;

const NotificationList = styled.ul`
  margin-top: 20px;
  display: grid;
  gap: 10px;
`;

const Notification = styled.li`
  border: 2px solid ${(props) => props.theme.colors.lightGray};
  border-radius: 10px;
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Content = styled.p`
  padding-left: 10px;
  font-weight: 600;
  font-size: 17px;

  width: 390px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;

  @media ${device.mobile} {
    font-size: 13px;
  }
`;

const Time = styled.span`
  padding-left: 10px;
  margin-top: 10px;
  font-size: 12px;
  color: ${(props) => props.theme.colors.darkGray};
`;

const DeleteButtonWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  bottom: 15px;
  right: 2px;

  & > span {
    font-size: 12px;
    color: ${(props) => props.theme.colors.darkGray};
    margin-right: 10px;
  }
`;
