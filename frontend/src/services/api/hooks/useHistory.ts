import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getHistory } from "../models/history";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import type { HistoryBody } from "../types/history";

export const useFetchAllHistory = (body?: HistoryBody) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.HISTORY,
      body?.rowPerPage,
      body?.page,
      body?.searchName,
    ],
    queryFn: () => getHistory(body),
  });
};
