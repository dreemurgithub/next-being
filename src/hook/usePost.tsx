import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPost, fetchGet, queryFetch, } from "@/lib/fetch";
import type { LoginRequest, SignupRequest, AuthResponse } from "@/service/auth";
import { useEffect, useState } from "react";
import { useAuthReset } from "./useAuthReset";

export const usePost = () => {
    useAuthReset()
    const queryClient = useQueryClient();
    const [page, setpage] = useState(1)
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: [`/api/post?page=${page}`],
        queryFn: queryFetch,
    });
    const mutation = useMutation({
        mutationFn: (formData: FormData) => {
            return fetchPost('/api/post', { body: formData })
        },
        onSuccess: () => {
            setpage(1)
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
