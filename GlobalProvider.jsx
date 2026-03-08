import { createContext, useEffect, useState } from "react";
import translations from "./lang.json";

export const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  // First path
  const [dailyTasks, setDailyTasks] = useState([]);
  const [completedDailyTasks, setCompletedDailyTasks] = useState([]);
  // Second path
  const [completedMainGoals, setCompletedMainGoals] = useState([]);
  const [mainGoals, setMainGoals] = useState([]);
  // Others
  const [loading, setLoading] = useState(false);
  const [dailyTasksHistory, setDailyTasksHistory] = useState(false);
  const [mainGoalsHistory, setMainGoalsHistory] = useState(false);
  // Localization tools
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem("lang");
    return savedLang ? savedLang : "en";
  });
  const [langX, setLangx] = useState(translations[lang]);

  useEffect(() => {
    setLangx(translations[lang]);
  }, [lang]);

  return (
    <GlobalContext.Provider
      value={{
        // first path
        completedDailyTasks,
        setCompletedDailyTasks,
        dailyTasks,
        setDailyTasks,
        // second path
        completedMainGoals,
        setCompletedMainGoals,
        mainGoals,
        setMainGoals,
        // other
        loading,
        setLoading,
        dailyTasksHistory,
        setDailyTasksHistory,
        mainGoalsHistory,
        setMainGoalsHistory,
        // localization tools
        lang,
        setLang,
        langX,
        setLangx,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
