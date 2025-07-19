


export type HistoryResponse = {
 success: boolean;
 data: InvestigationResults;
};

export type InvestigationResults = {
  case_name: string;
  results: InvestigationResult[];
};

export type InvestigationResult = {
  tool_name: string;
  indicator_type_name: string;
  indicator_value: string;
  result_data: WhoisResultData | WhatMyNameResultData | HibpResultData | Record<string, unknown>;
};

// WHOIS tool result
export type WhoisResultData = {
  ip?: string;
  domain_name?: string;
  registrar?: { name: string };
  created_at?: string;
  updated_at?: string;
  expires_at?: string;
  status?: string[];
  name_servers?: string[];
  dnssec?: string;
};

// WhatMyName tool result
export type WhatMyNameResultData = {
  found: string[];
};

// HaveIBeenPwned (hibp) tool result
export type HibpResultData = {
  breached: boolean;
  count: number;
  message: string;
};