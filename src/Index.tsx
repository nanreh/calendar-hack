import { Outlet } from 'react-router';

import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer";

const Index = () => {
    return <>
        <Toolbar />
        <Outlet />
        <Footer />
    </>
}

export default Index;