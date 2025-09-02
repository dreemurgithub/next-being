import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPost, queryFetch } from "@/lib/fetch";
import { useAuthReset } from "./useAuthReset";

interface UseCommentProps {
  postId: string;
}

interface CreateCommentData {
  text: string;
  postId: string;
}

export const useComment = ({ postId }: UseCommentProps) => {
  useAuthReset();
  const queryClient = useQueryClient();

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [`/api/comment?postId=${postId}`],
    queryFn: queryFetch,
  });

  const mutation = useMutation({
    mutationFn: (commentData: CreateCommentData) => {
      return fetchPost('/api/comment', { body: commentData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/comment?postId=${postId}`] });
    },
  });

  return {
    isPending,
    error,
    data,
    isFetching,
    mutation
  };
};
