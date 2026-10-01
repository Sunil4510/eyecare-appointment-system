/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Route, Routes } from "react-router-dom";
import Login from "./page/Login.tsx";
import { SharedComponents } from "./page/SharedComponents.tsx";
import Home from "./page/Home.tsx";
import Catalogue from "./page/Catalogue.tsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/shared-components" element={<SharedComponents />} />
      {/**
       * TODO: Add more paths as needed
       */}
    </Routes>
  );
};

export default AppRoutes;
