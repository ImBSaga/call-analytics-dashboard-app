import { api } from '@/lib/api/axiosInstance';
import type { CallRecord } from '@/types/CallRecord.type';

const prefix = '/cdr';

export async function getCallRecords() {
  const res = await api.get<CallRecord[]>(`${prefix}`);
  return res.data;
}
