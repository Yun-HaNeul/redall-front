import {useAuth} from "../context/AuthContext.tsx";
import {Center, Loader} from "@mantine/core";
import {Navigate, Outlet} from "react-router-dom";

function ProtectedRoute() {
    const { isAuthenticated, loading} = useAuth();

    console.log("ProtectedRoute:", { isAuthenticated, loading });  // 임시

    // 인증 상태 확인 중 ( 앱 시작 시 /me 호출 등)
    if (loading){
        return (
            <Center h="60vh">
                <Loader />
            </Center>
        );
    }

    // 미로그인 -> 로그인 페이지로 (replace로 뒤로가기 방지)
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // 로그인 됨 -> 자식 페이지 표시
    return <Outlet />;
}

export default ProtectedRoute;