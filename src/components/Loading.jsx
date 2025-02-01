import React, { useEffect, useState } from "react";
import DarkLoading from "./DarkLoading/DarkLoading"
import LightLoading from "./LightLoading/LightLoading"

const Loading = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  useEffect(() => {
    setTheme(localStorage.getItem("theme"));
  }, [theme]);

  return (
    <main>
      {theme === "true" ? <DarkLoading /> : <LightLoading />}
    </main>
  );
};

export default Loading;
