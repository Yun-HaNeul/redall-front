import {useOAuthCallback} from "../hook/useOAuthCallback.ts";
import OAuthCallbackView from "../components/OAuthCallbackView.tsx";
import {naverLogin} from "../api/Auth.ts";

function NaverCallbackPage(){
    const { errorMsg } = useOAuthCallback(
        (code, state) => naverLogin(code, state ?? ""),
        true    // 네이버는 state 필요
    );
    return <OAuthCallbackView errorMsg={errorMsg} />;
}

export default NaverCallbackPage;