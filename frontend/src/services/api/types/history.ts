export type HistoryResponse = {
  success: boolean;
  case: HistoryEntry[];
  total: number;
};

export type HistoryEntry = {
  case_id: number;
  case_name: string;
  case_type: string;
  created_at: string;
  tools: string[];
};
