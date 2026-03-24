export type UserRole = "admin" | "analyst";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};
