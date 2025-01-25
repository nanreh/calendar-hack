import { Outlet } from 'react-router';

import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer";

const About = () => {
    return <>
        <Toolbar />
        <Outlet />
        <Footer />
    </>
}

export default About;