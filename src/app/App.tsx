import {Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "../pages/Loginpage.tsx";
import SignupPage from "../pages/Signuppage.tsx";
import KakaoCallbackPage from "../pages/KakaoCallbackPage.tsx";
import GoogleCallbackPage from "../pages/GoogleCallbackPage.tsx";
import NaverCallbackPage from "../pages/NaverCallbackPage.tsx";
import MainPage from "../pages/MainPage.tsx";


/**
 * 라우팅: 어떤 주소(URL)로 가면 어떤 화면을 보여줄지 정의
 * - /login         ->  로그인
 * - /main → 로그인 후 메인 페이지
 * - /signup        ->  회원가입
 * - /oauth/kakao   ->  카카오 로그인 콜백 (카카오가 리다이렉트하는 주소)
 * - /oauth/google   ->  구글 로그인 콜백 (구글이 리다이렉트하는 주소)
 * - /oauth/naver   ->  네이버 로그인 콜백 (네이버가 리다이렉트하는 주소)
 * - /              ->  로그인 상태면 메인, 아니면 로그인으로 (아래 Navigate는 기본 진입)
 */
function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route path="/main" element={<MainPage/>}/>
            <Route path="/oauth/kakao" element={<KakaoCallbackPage/>}/>
            <Route path="/oauth/google" element={<GoogleCallbackPage/>}/>
            <Route path="/oauth/naver" element={<NaverCallbackPage/>}/>
            <Route path="/" element={<Navigate to="/login" replace/>}/>
        </Routes>
    );
}

export default App;