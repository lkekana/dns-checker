type MsgHdr = {
  Id: number;
  Response: boolean;
  Opcode: number;
  Authoritative: boolean;
  Truncated: boolean;
  RecursionDesired: boolean;
  RecursionAvailable: boolean;
  Zero: boolean;
  AuthenticatedData: boolean;
  CheckingDisabled: boolean;
  Rcode: number;
};

type Question = {
  Name: string; // `dns:"cdomain-name"` // "cdomain-name" specifies encoding (and may be compressed)
  Qtype: number;
  Qclass: number;
};

type RR_Header = {
  Name: string; // `dns:"cdomain-name"` // "cdomain-name" specifies encoding (and may be compressed)
  Rrtype: number;
  Class: number;
  Ttl: number;
  Rdlength: number;
};

type Msg = MsgHdr & {
  Compress?: boolean;
  Question: Question[];
  Answer: RR[];
  Ns: RR[] | null;
  Extra: RR[] | null;
};

type RR = {
  Hdr: RR_Header;
  A: string;
};

export type JSONMsg = Msg & {
  elapsed: number;
};