// declare module 'whois';

declare module 'whois' {
  interface WhoisOptions {
    follow?: number;
    server?: string;
    timeout?: number;
    verbose?: boolean;
  }

  type WhoisCallback = (err: Error | null, data: string) => void;

  function lookup(
    domain: string,
    callback: WhoisCallback
  ): void;

  function lookup(
    domain: string,
    options: WhoisOptions,
    callback: WhoisCallback
  ): void;

  export { lookup };
}
