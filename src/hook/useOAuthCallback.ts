import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { LoginResponse } from "../types/auth";
import type { AxiosResponse } from "axios";
import {useAuth} from "../context/AuthContext";

/**
 * 소셜 로그인 콜백 처리 공통 훅.
 * provider별로 다른 것은 "code로 로그인하는 함수"뿐이므로,
 * 그 함수만 받아서 공통 흐름(code 추출 → 호출 → JWT 저장)을 처리한다.
 * code 추출 -> 백엔드 호출 -> Context 로그인 -> 메인 이동
 *
 * @param loginFn code(및 state)를 받아 백엔드에 로그인 요청하는 함수
 * @param needState 네이버처럼 state가 필요한지 여부
 */
export function useOAuthCallback(
  loginFn: (code: string, state?: string) => Promise<AxiosResponse<LoginResponse>>,
  needState = false
) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [errorMsg, setErrorMsg] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state") ?? undefined;

    if (!code) {
      setErrorMsg("인가 코드를 받지 못했습니다.");
      return;
    }
    if (needState && !state) {
      setErrorMsg("state 값을 받지 못했습니다.");
      return;
    }

    // code는 한 번만 사용 가능 → 중복 호출 방지
    if (calledRef.current) return;
    calledRef.current = true;

    loginFn(code, state)
      .then(async (res) => {
        await login(res.data.accessToken, res.data.refreshToken);
        navigate("/main", { replace: true });
      })
      .catch((err) => {
        const error = err as { response?: { data?: { message?: string } } };
        setErrorMsg(
          error.response?.data?.message ?? "소셜 로그인에 실패했습니다."
        );
      });
  }, [searchParams]);

  return { errorMsg };
}