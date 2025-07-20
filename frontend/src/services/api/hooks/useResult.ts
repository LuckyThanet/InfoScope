import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHistory } from "../models/history";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import type { ResultBody, InvestigationResults } from "../types/result";

import {
  getInvestigationResultsById,
  getInvestigationResults,
  sendDataResults,
} from "../models/result";

export const useFetchByIdResults = (Id: string, status: boolean) => {
  return useQuery({
    queryKey: [QUERY_KEYS.RESULTS, Id],
    queryFn: () => getInvestigationResultsById(Id),
    enabled: status,
  });
};

export const useFetchResultsMutation = () => {
  return useMutation({
    mutationFn: (body: ResultBody) => getInvestigationResults(body),
  });
};

// export const usePostResultsToSave = () => {
//   return useMutation({
//     mutationFn: (body: InvestigationResults) => sendDataResults(body),
//   });
// };

export const usePostResultsToSave = (body: InvestigationResults) => {
  return useQuery({
    queryKey: [QUERY_KEYS.RESULTS, body.case_name],
    queryFn: () => sendDataResults(body),
  });
};
