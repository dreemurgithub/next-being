import { useQuery } from "@tanstack/react-query";
import { queryFetch } from "@/lib/fetch";
import { useAuthReset } from "./useAuthReset";

interface SerializedImage {
  id: string;
  filename: string;
  url: string;
  size: number;
  folder: string;
  uploadedAt: Date;
}

interface SelfUser {
  id: string;
  email: string;
  name: string | null;
  avatarId: string | null;
  avatar: SerializedImage | null;
  posts: any[]; // SerializedPost[]
  createdAt: Date;
  updatedAt: Date;
}

export const useSelfData = () => {
  useAuthReset();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: queryFetch,
  });

  return {
    isPending,
    error,
    data,
    isFetching,
  };
};
