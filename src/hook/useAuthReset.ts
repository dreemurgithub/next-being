import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchPost, fetchGet, queryFetch } from "@/lib/fetch";
import type { LoginRequest, SignupRequest, AuthResponse } from "@/service/auth";
import { useEffect } from "react";

export const useAuthReset = () => {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["/api/auth/reset"],
    queryFn: queryFetch,
    refetchInterval: 1000 * 60 * 15 // 15min to reset auth
  });
  useEffect(()=>{
    if(!data) localStorage.setItem('jwt',data.accessToken as string)
  },[data])

  return {
    isPending,
    error,
    data,
    isFetching,
  };
};
