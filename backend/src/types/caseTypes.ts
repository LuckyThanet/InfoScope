export interface CaseAttributes {
  case_id: number;
  startDate: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface IndicatorAttributes {
  indicator_id: number;
  type: number;
  value: string;
  case: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IndicatorTypeAttributes {
  type_id: number;
  type_name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ResultAttributes {
  result_id: number;
  result: string;
  tool: number;
  indicator: number;
  type: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ResultTypeAttributes {
  result_type_id: number;
  result_type_name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ToolAttributes {
  tool_id: number;
  tool_name: string;
  created_at?: Date;
  updated_at?: Date;
}
