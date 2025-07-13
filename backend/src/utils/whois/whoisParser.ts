import type { ParsedWhois , WhoisResponse } from '../../types/whois/parsedWhois';


export default function parseWhois(response:WhoisResponse ): ParsedWhois {
  const result: ParsedWhois = {
    ip: response.ip,
    domain_name: "",
    registry_domain_id: "",
    created_at: "",
    updated_at: "",
    expires_at: "",
    status: [],
    registrar: {
      name: "",
      whois_server: "",
      url: "",
      abuse_email: "",
      abuse_phone: ""
    },
    name_servers: [],
    dnssec: ""
  };
   

const handlers: Record<string, (value: string) => void> = {
    'domain name': val => result.domain_name = val.toLowerCase(),
    'registry domain id': val => result.registry_domain_id = val,
    'creation date': val => result.created_at = val.split('T')[0],
    'updated date': val => result.updated_at = val.split('T')[0],
    'registrar registration expiration date': val => result.expires_at = val.split('T')[0],
    'domain status': val => {
      const status = val.split(' ')[0];
      if (!result.status!.includes(status)) result.status!.push(status);
    },
    'registrar': val => result.registrar!.name = val,
    'registrar whois server': val => result.registrar!.whois_server = val,
    'registrar url': val => result.registrar!.url = val,
    'registrar abuse contact email': val => result.registrar!.abuse_email = val,
    'registrar abuse contact phone': val => result.registrar!.abuse_phone = val,
    'name server': val => result.name_servers!.push(val),
    'dnssec': val => result.dnssec = val.toLowerCase()
  };

 const lines = response.data.split('\n');
  for (let line of lines) {
    // line = line.trim();
    if (!line || line.startsWith('>>>')) continue;

    const [keyRaw, ...rest] = line.split(':');
    if (!keyRaw || rest.length === 0) continue;

    const key = keyRaw.trim().toLowerCase();
    const value = rest.join(':').trim();

    const handler = handlers[key];
    if (handler) {
      handler(value);
    }
  }

    return result;
}