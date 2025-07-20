import { generatePath } from "react-router-dom";
import { ENDPOINTS } from "../../../constants/endponts";
import { api } from "../api";
import type {
  HistoryResponse,
  ResultBody,
  InvestigationResults,
} from "../types/result";

export const getInvestigationResultsById = async (Id: string) => {
  const { data } = await api.get<HistoryResponse>(
    generatePath(ENDPOINTS.RESULTS.FETCH_INVESTIGATION_RESULTS_BY_ID, { Id })
  );
  return data;
};

export const getInvestigationResults = async (body: ResultBody) => {
  const { data } = await api.post<HistoryResponse>(
    ENDPOINTS.RESULTS.FETCH_INVESTIGATION_RESULTS,
    body
  );
  return data;
};

export const sendDataResults = async (body: InvestigationResults) => {
  const { data } = await api.post<InvestigationResults>(
    ENDPOINTS.RESULTS.POST_INVESTIGATION_RESULTS
  );
  return data;
};
