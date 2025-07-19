import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getHistory } from "../models/history";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import type { HistoryBody } from "../types/history";
import { getInvestigationResults } from "../models/result";

export const useFetchByIdResults = (Id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.RESULTS, Id],
    queryFn: () => getInvestigationResults(Id),
  });
};
