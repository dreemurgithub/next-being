import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPost, fetchGet, queryFetch, } from "@/lib/fetch";
import type { LoginRequest, SignupRequest, AuthResponse } from "@/service/auth";
import { useEffect } from "react";
import { useAuthReset } from "./useAuthReset";
import { useSearchParams, useRouter } from "next/navigation";

export const usePost = () => {
    useAuthReset()
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const pageParam = searchParams.get('page');
        if (!pageParam) {
            // No page param, navigate to /?page=1
            router.push('/?page=1');
            return;
        }
        const pageNum = parseInt(pageParam, 10);
        if (isNaN(pageNum) || pageNum < 1) {
            // Page param is not a valid number or negative, navigate to /?page=1
            router.push('/?page=1');
            return;
        }
    }, [searchParams, router]);

    const page = parseInt(searchParams.get('page') || '1');
    const setpage = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: [`/api/post?page=${page}`],
        queryFn: queryFetch,
    });
    const mutation = useMutation({
        mutationFn: (formData: FormData) => {
            return fetchPost('/api/post', { body: formData })
        },
        onSuccess: () => {
            setpage(1);
            queryClient.invalidateQueries({ queryKey: [`/api/post?page=${1}`] });
        },
    })


    return {
        isPending,
        error,
        data,
        isFetching,
        page,
        setpage,
        mutation
    };
};
