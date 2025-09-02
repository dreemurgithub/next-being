import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchPost, fetchGet, queryFetch } from "@/lib/fetch";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuthReset = () => {
  const router = useRouter();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["/api/auth/reset"],
    queryFn: queryFetch,
    refetchInterval: 1000 * 60 * 15 // 15min to reset auth
  });
  useEffect(() => {
    console.log(data)
    if (data && data.accessToken) localStorage.setItem('jwt', data.accessToken as string)
    else router.push('/login');
  }, [data])

  return {
    isPending,
    error,
    data,
    isFetching,
  };
};
