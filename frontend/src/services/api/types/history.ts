export type HistoryResponse = {
  success: boolean;
  count: number;
  totalPages: number;
  currentPage: number;
  cases: HistoryEntry[];
};

export type HistoryEntry = {
  case_id: number;
  case_name: string;
  case_type: string;
  created_at: string;
  tools: string[];
};

export type HistoryBody = {
  rowPerPage?: number;
  page?: number;
  searchName?: string;
};
