import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchPost, fetchGet, queryFetch } from "@/lib/fetch";
import type { LoginRequest, SignupRequest, AuthResponse } from "@/service/auth";
import { useEffect, useState } from "react";
import { useAuthReset } from "./useAuthReset";

export const usePost = () => {
    useAuthReset()
    const [page, setpage] = useState(1)
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: [`/api/post?page=${page}`],
        queryFn: queryFetch,
    });

    return {
        isPending,
        error,
        data,
        isFetching,
        page,
        setpage
    };
};
