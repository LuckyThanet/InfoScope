export  type ParsedWhois = {
  ip: string;
  domain_name: string;
  registry_domain_id?: string;
  created_at?: string;
  updated_at?: string;
  expires_at?: string;
  status?: string[];
  registrar?: {
    name?: string;
    whois_server?: string;
    url?: string;
    abuse_email?: string;
    abuse_phone?: string;
  };
  name_servers?: string[];
  dnssec?: string;
}

export type WhoisResponse = {
  success: boolean;
  ip: string;
  family: number;
  data: string;
}