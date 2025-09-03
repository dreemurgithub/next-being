import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchPost, fetchGet, queryFetch } from "@/lib/fetch";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export const useAuthReset = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["/api/auth/reset"],
    queryFn: queryFetch,
    refetchInterval: 1000 * 60 * 15 // 15min to reset auth
  });
  useEffect(() => {
    if (data && data.accessToken) {
      localStorage.setItem('jwt', data.accessToken as string)
      return
    }
    if (error && router && pathname !== '/login') router.push('/login');
  }, [data, pathname, error, router])

  return {
    isPending,
    error,
    data,
    isFetching,
  };
};
