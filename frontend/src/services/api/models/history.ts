import { generatePath } from "react-router-dom";
import { ENDPOINTS } from "../../../constants/endponts";
import { api } from "../api";
import type { HistoryResponse, HistoryBody } from "../types/history";

export const getHistory = async (body?: HistoryBody) => {
  const { data } = await api.post<HistoryResponse>(
    ENDPOINTS.HISTORY.FETCH_HISTORY,
    body
  );
  return data;
};
