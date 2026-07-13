import Header from "../components/Header.tsx";
import {Outlet} from "react-router-dom";


/**
 * 공통 레이아웃
 * 헤더 + 페이지 내용
 * @constructor
 */
function MainLayout(){
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default MainLayout;