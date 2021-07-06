export class AuditLogEntry {
  id: number;
  timestamp: number;
  username: string;
  action: string;
  data: string;
  details: object;
}
