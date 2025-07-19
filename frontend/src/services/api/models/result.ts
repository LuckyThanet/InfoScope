import { generatePath } from "react-router-dom";
import { ENDPOINTS } from "../../../constants/endponts";
import { api } from "../api";
import type { HistoryResponse } from "../types/result";

export const getInvestigationResults = async (Id: string) => {
  const { data } = await api.get<HistoryResponse>(
    generatePath(ENDPOINTS.RESULTS.FETCH_INVESTIGATION_RESULTS, { Id })
  );
  return data;
};
