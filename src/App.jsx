import React from "react";
import Layout from "./Layout/Layout";
import { Route, Routes } from "react-router-dom";
import DailyTasks from "./pages/DailyTasks";
import MainPurposes from "./pages/MainPurposes";
import GlobalProvider from "../GlobalProvider";

const App = () => {
  return (
    <GlobalProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<DailyTasks />} />
          <Route path="/goals" element={<MainPurposes />} />
        </Routes>
      </Layout>
    </GlobalProvider>
  );
};

export default App;
