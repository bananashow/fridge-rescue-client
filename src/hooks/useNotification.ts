/* eslint-disable no-console */
import { useNavigate } from 'react-router-dom';
import { axiosAuth } from '../api/axiosInstance';
import { QUERY_KEY } from '../constants/queryKey';
import { useQueryClient } from '@tanstack/react-query';
import { END_POINTS } from '../constants/api';
import type { NotificationData } from '../types/notification';

interface Props {
  handleSidebar?: () => void;
  data: NotificationData[];
}

export const useNotification = ({ handleSidebar, data }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleRead = async (
    id: number,
    notificationType: string,
    originId: number,
    checkedAt: string
  ) => {
    try {
      if (!checkedAt) {
        const fetchRead = await axiosAuth.get(`${END_POINTS.NOTIFICATION}/${id}`);
        console.log(fetchRead.data.message);
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.NOTIFICATION] });

      if (notificationType === 'RECIPE_REVIEWED' || notificationType === 'RECIPE_RECOMMENDED') {
        navigate(`/recipe/${originId}`);
      } else {
        navigate(`/refrigerator`);
      }

      if (handleSidebar) {
        handleSidebar();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAllRead = async () => {
    try {
      const fetchAllRead = await axiosAuth.patch(END_POINTS.NOTIFICATION, {
        notificationIds: data
          .filter((item: NotificationData) => item.checkedAt! == null)
          .map((item: NotificationData) => item.id),
      });
      console.log(fetchAllRead.data.message);
      if (handleSidebar) {
        handleSidebar();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { handleRead, handleAllRead };
};
