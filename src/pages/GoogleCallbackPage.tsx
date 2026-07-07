import {googleLogin} from "../api/Auth";
import {useOAuthCallback} from "../hook/useOAuthCallback.ts";
import OAuthCallbackView from "../components/OAuthCallbackView.tsx";

/**
 * 구글 로그인 콜백 페이지.
 * 구글이 이 주소로 리다이렉트하면서 URL에 인가 코드(code)를 붙여준다.
 * 그 code를 백엔드로 보내 우리 JWT를 받아 저장한다.
 */
function GoogleCallbackPage() {
  const { errorMsg } = useOAuthCallback((code) => googleLogin(code));
  return <OAuthCallbackView errorMsg={errorMsg} />;
}
export default GoogleCallbackPage;