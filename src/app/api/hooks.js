import {
    useQuery,
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { api } from "./axios";

// ===== Дни месяца =====
export function useDayStatuses(year, month) {
    return useQuery({
        queryKey: ["dayStatuses", year, month],
        queryFn: () =>
            api
                .get("/day-statuses", { params: { year, month } })
                .then((r) => r.data.data),
    });
}

// ===== Список appointments =====
export function useAppointments({
    since,
    until,
    search,
    masterIds,
    serviceIds,
    page,
    perPage,
}) {
    
    const params = { page, perPage };
    if (since) params.since = since;
    if (until) params.until = until;
    if (search) params.search = search;
    if (masterIds?.length) params.masterIds = masterIds;
    if (serviceIds?.length) params.serviceIds = serviceIds;

    return useQuery({
        queryKey: ["appointments", params],
        queryFn: () => api.get("/appointments", { params }).then((r) => r.data),
        keepPreviousData: true,
    });
}

// ===== Создание записи =====
export function useCreateAppointment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.post("/appointments", data).then((r) => r.data.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["appointments"] });
            qc.invalidateQueries({ queryKey: ["dayStatuses"] });
        },
    });
}

// ===== Infinite Masters/Services =====
function makeInfiniteHook(url) {
    return ({ search }) =>
        useInfiniteQuery({
            queryKey: [url, search],
            queryFn: ({ pageParam = 1 }) =>
                api
                    .get(`/${url}`, { params: { search, page: pageParam, perPage: 10 } })
                    .then((r) => r.data),
            getNextPageParam: (lastPage, all) =>
                all.length * 10 < lastPage.total ? all.length + 1 : undefined,
        });
}

export const useInfiniteMasters = makeInfiniteHook("masters");
export const useInfiniteServices = makeInfiniteHook("services");
