import { useQuery } from "@tanstack/react-query";
import { queryFetch } from "@/lib/fetch";
import { useAuthReset } from "./useAuthReset";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

interface UsePostSearchParams {
  title?: string;
  content?: string;
  minComments?: number;
  maxComments?: number;
//   page?: number;
}

export const usePostSearch = (params: UsePostSearchParams = {}) => {
  useAuthReset();
  const searchParams = useSearchParams();
  const router = useRouter();

//   useEffect(() => {
//     const pageParam = searchParams.get('page');
//     if (!pageParam) {
//       router.push('/?page=1');
//       return;
//     }
//     const pageNum = parseInt(pageParam, 10);
//     if (isNaN(pageNum) || pageNum < 1) {
//       router.push('/?page=1');
//       return;
//     }
//   }, [searchParams, router]);

//   const page = params.page || parseInt(searchParams.get('page') || '1', 10);
//   const setPage = (newPage: number) => {
//     const currentParams = new URLSearchParams(searchParams);
//     currentParams.set('page', newPage.toString());
//     router.push(`?${currentParams.toString()}`);
//   };

  const queryString = new URLSearchParams({
    // page: page.toString(),
    ...(params.title && { title: params.title }),
    ...(params.content && { content: params.content }),
    ...(params.minComments !== undefined && { minComments: params.minComments.toString() }),
    ...(params.maxComments !== undefined && { maxComments: params.maxComments.toString() }),
  }).toString();

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [`/api/post?${queryString}`],
    queryFn: queryFetch,
  });

  return {
    isPending,
    error,
    data,
    isFetching,
    // page,
    // setPage,
  };
};
