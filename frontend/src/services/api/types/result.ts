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
  result_data:
    | WhoisResultData
    | WhatMyNameResultData
    | HibpResultData
    | Record<string, unknown>;
};

// WHOIS tool result
export type WhoisResultData = {
  ip?: string;
  domain_name?: string;
  registrar?: { name: string };
  creation_date?: string;
  created_at?: string;
  updated_at?: string;
  expires_at?: string;
  status?: string[];
  name_servers?: string[];
  dnssec?: string;
};

export type WhatMyNameData = {
  link?: string;
  platform?: string;
};

// WhatMyName tool result
export type WhatMyNameResultData = {
  found: WhatMyNameData[];
};

// HaveIBeenPwned (hibp) tool result
export type HibpResultData = {
  breached: boolean;
  count: number;
  message: string;
};

export type InfoData = {
  username?: string;
  domain?: string;
  password?: string;
}

export type ResultBody = {
  case_name: string;
  parameters: InfoData;
  tools_to_run: string[]
};
