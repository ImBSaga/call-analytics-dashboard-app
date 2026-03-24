import { api } from "@/lib/api/axiosInstance";
import type {
  CallRecord,
  CDRFilters,
  PaginatedCDR,
} from "@/types/CallRecord.type";

const prefix = "/cdr";

export async function getCallRecords(
  filters: CDRFilters = {},
): Promise<PaginatedCDR> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null,
    ),
  );
  const res = await api.get<{ success: boolean } & PaginatedCDR>(prefix, {
    params,
  });
  return { data: res.data.data, pagination: res.data.pagination };
}

export async function getAvailableCities(): Promise<string[]> {
  const res = await api.get<{ success: boolean; data: string[] }>(
    `${prefix}/cities`,
  );
  return res.data.data;
}

// ─── ADMIN CRUD ─────────────────────────────────────────────────────────────

export async function createCallRecord(
  data: Omit<CallRecord, "id">,
): Promise<CallRecord> {
  const res = await api.post<{ success: boolean; data: CallRecord }>(
    prefix,
    data,
  );
  return res.data.data;
}

export async function updateCallRecord(
  id: string,
  data: Partial<CallRecord>,
): Promise<CallRecord> {
  const res = await api.put<{ success: boolean; data: CallRecord }>(
    `${prefix}/${id}`,
    data,
  );
  return res.data.data;
}

export async function deleteCallRecord(id: string): Promise<void> {
  await api.delete(`${prefix}/${id}`);
}
