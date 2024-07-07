import axios from "axios";
import { useCallback, useState } from "react";
import { userState } from "../utils/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";

export const useFetchUser = () => {
    const setUser = useSetRecoilState(userState);
    const currentUser = useRecoilValue(userState);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = useCallback(async () => {

        if (currentUser && currentUser.id) {
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            localStorage.setItem('isAuth', 'true');
            setUser({...response.data, isAuth: true});
        } catch (error) {
            console.error("Failed to fetch user:", error);
            setUser({
                id: "",
                email: "",
                name: "",
                bookmarks: [],
                isAuth: false,
                createdAt: new Date(),
                posts: [],
            });
        } finally {
            setIsLoading(false);
        }
    }, [setUser]);

    return { fetchUser, isLoading };
};