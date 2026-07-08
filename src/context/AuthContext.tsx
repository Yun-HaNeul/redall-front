import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { MeResponse } from "../types/auth";
import { getMe } from "../api/auth";
import { saveTokens, logout as clearTokens, isLoggedIn } from "../utils/auth";

/**
 * 로그인 상태 전역 관리 Context 타입 정의.
 * - user: 현재 로그인한 사용자 (없으면 null)
 * - loading: 초기 사용자 정보 조회 중인지
 * - login: 토큰 저장 + 사용자 정보 로드
 * - logout: 토큰 삭제 + 사용자 정보 비움
 */
interface AuthContextType {
  user: MeResponse | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 실제 로그인 상태를 관리하는 곳
// { children } -> props (컴포넌트에 전달하는 값)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // 사용자 정보를 백엔드에서 가져와 상태에 저장
  const loadUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data);
    } catch {
      setUser(null);   // 토큰 없거나 만료 → 로그아웃 상태로 간주
    } finally {
      setLoading(false);
    }
  };

  // 앱 시작 시: 토큰이 있으면 사용자 정보 로드
  // 특정 시점에 코드 실행 [] 빈 배열은 처음 한번만 실행
  useEffect(() => {
    if (isLoggedIn()) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  // 로그인: 토큰 저장 후 사용자 정보 로드
  const login = async (accessToken: string, refreshToken: string) => {
    saveTokens(accessToken, refreshToken);
    setLoading(true);
    await loadUser();
  };

  // 로그아웃: 토큰 삭제 + 상태 비움
  const logout = () => {
    clearTokens();
    setUser(null);
  };

  // 실제로 값 공유
  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated: user !== null }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 컴포넌트에서 로그인 상태를 쉽게 쓰는 훅.
 * 사용: const { user, logout } = useAuth();
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}