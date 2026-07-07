import { kakaoLogin } from "../api/Auth";
import {useOAuthCallback} from "../hook/useOAuthCallback.ts";
import OAuthCallbackView from "../components/OAuthCallbackView.tsx";

/**
 * 카카오 로그인 콜백 페이지.
 * 카카오가 이 주소로 리다이렉트하면서 URL에 인가 코드(code)를 붙여준다.
 * 그 code를 백엔드로 보내 우리 JWT를 받아 저장한다.
 */
function KakaoCallbackPage() {
  const {errorMsg} = useOAuthCallback((code) => kakaoLogin(code));
  return <OAuthCallbackView errorMsg={errorMsg}/>;
}
export default KakaoCallbackPage;