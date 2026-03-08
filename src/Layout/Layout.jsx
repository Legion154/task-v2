import { toast, ToastContainer } from "react-toastify";
import { useState, useEffect, useContext } from "react";
import Loading from "../components/Loading";
import uz from "../assets/uz.png";
import ru from "../assets/ru.png";
import en from "../assets/en.png";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../GlobalProvider";

const Layout = ({ children }) => {
  const {
    completedDailyTasks,
    setCompletedDailyTasks,
    completedMainGoals,
    setCompletedMainGoals,
    loading,
    setLoading,
    dailyTasksHistory,
    setDailyTasksHistory,
    mainGoalsHistory,
    setMainGoalsHistory,
    mainGoals,
    dailyTasks,
    lang,
    setLang,
    langX,
    setLangx,
  } = useContext(GlobalContext);

  const [loadingScreen, setLoadingscreen] = useState(true);
  const [sidebar, setSidebar] = useState(false);
  const [tasks, setTasks] = useState(0);
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "true",
  );

  const navigate = useNavigate();
  const location = useLocation().pathname;

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
    const savedCompletedDailyTasks = JSON.parse(
      localStorage.getItem("completedDailyTasks"),
    );
    if (savedCompletedDailyTasks) {
      setCompletedDailyTasks(savedCompletedDailyTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    if (completedDailyTasks.length > 0) {
      localStorage.setItem(
        "completedDailyTasks",
        JSON.stringify(completedDailyTasks),
      );
    }
  }, [completedDailyTasks]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    location === "/" ? setTasks(dailyTasks.length) : setTasks(mainGoals.length);
  }, [mainGoals, dailyTasks]);

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    setTimeout(() => {
      setLoadingscreen(false);
    }, 2500);
  }, []);

  const mode = () => {
    setDark((prevtheme) => {
      const newState = !prevtheme;
      localStorage.setItem("theme", newState);
      if (newState) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
      return newState;
    });
  };

  const openSidebar = () => {
    setSidebar(true);
  };

  const closeSidebar = (route) => {
    navigate(route);
    setSidebar(false);
  };

  const openHistory = () => {
    setSidebar(false);
    setTimeout(() => {
      location === "/" ? setDailyTasksHistory(true) : setMainGoalsHistory(true);
    }, 200);
  };

  const closeAll = () => {
    setSidebar(false);
    location === "/" ? setDailyTasksHistory(false) : setMainGoalsHistory(false);
  };

  return loadingScreen ? (
    <Loading />
  ) : (
    <main className="relative overflow-hidden bg-primary w-full sm:hidden">
      {/* -- UI */}
      <div className="flex flex-row justify-between px-5 py-3">
        <h1 className="text-lg font-medium text-secondary">
          {langX.taskleft}: {tasks}
        </h1>
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={openSidebar}
            className="cursor-pointer select-none"
          >
            <i className="fa-solid fa-bars-staggered text-xl text-secondary"></i>
          </button>
          <button type="button" onClick={openHistory}>
            <i className="fa-solid fa-clock-rotate-left text-xl text-secondary"></i>
          </button>
        </div>
      </div>

      {children}

      {/* SIDEBAR */}
      <div
        className={`${
          sidebar ? "translate-x-0" : "translate-x-[800px]"
        } fixed z-10 top-0 right-0 px-5 py-3 pb-20 bg-primary w-[330px] h-screen flex flex-col gap-16 overflow-hidden duration-500 sm:hidden`}
      >
        <div className="flex flex-row items-center justify-between">
          <h1 className="font-bold text-3xl text-secondary">
            Task-v2{" "}
            <code className="text-xs opacity-60">({langX.version})</code>
          </h1>
          <button type="button" onClick={() => closeSidebar(null)}>
            <i className="fa-solid fa-xmark text-lg text-secondary"></i>
          </button>
        </div>
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-2">
            {/* DailyTasks path -- */}
            <button
              type="button"
              onClick={() => closeSidebar("/")}
              className={`${location == "/" ? "bg-gray-400/10 opacity-80 dark:bg-gray-200 dark:text-[#17252a]" : "hover:opacity-60"} shadow-sm shadow-[#4F5665] text-secondary rounded-lg px-3 py-3 duration-200 cursor-pointer`}
            >
              {langX.dailytasks}
            </button>
            {/* Purposes path -- */}
            <button
              type="button"
              onClick={() => closeSidebar("/goals")}
              className={`${location == "/goals" ? "bg-gray-400/10 opacity-80 dark:bg-gray-200 dark:text-[#17252a]" : "hover:opacity-60"} shadow-sm shadow-[#4F5665] text-secondary rounded-lg px-3 py-3 duration-200 cursor-pointer`}
            >
              {langX.purposes}
            </button>
          </div>

          {/* EXTRA OPTIONS */}
          <div className="flex flex-row items-center justify-between">
            <div className="flex text-secondary flex-row items-center gap-3">
              <h1>{langX.mode}</h1>
              <div className="relative inline-block w-8 h-4 focus:outline-none cursor-pointer rounded-full">
                <input
                  type="checkbox"
                  id="modeMobile"
                  defaultChecked={dark}
                  onChange={mode}
                  className="peer appearance-none w-8 h-4 absolute rounded-full cursor-pointer transition-colors duration-300 bg-gray-300 peer-checked:border-gray-900 peer-checked:before:bg-gray-900 checked:bg-[#4F5665]"
                />
                <label
                  htmlFor="modeMobile"
                  className="bg-white w-5 h-5 border border-blue-gray-100 rounded-full shadow-md absolute top-2/4 -left-1 -translate-y-2/4 peer-checked:translate-x-full transition-all duration-300 cursor-pointer"
                ></label>
              </div>
            </div>

            {/* SEPERATE */}
            <span className="h-10 w-[1.5px] bg-secondary rounded-xl"></span>

            {/* LANG */}
            <div className="flex flex-row items-center gap-2.5">
              <button
                onClick={() => setLang("en")}
                className={`${
                  lang == "en"
                    ? "bg-selected hover:bg-selected"
                    : "bg-transparent hover:bg-hovered"
                } size-8 flex justify-center items-center rounded-full duration-200`}
              >
                <img src={en} alt="English" className="size-5" />
              </button>
              <button
                onClick={() => setLang("ru")}
                className={`${
                  lang == "ru"
                    ? "bg-selected hover:bg-selected"
                    : "bg-transparent hover:bg-hovered"
                } size-8 flex justify-center items-center rounded-full duration-200`}
              >
                <img src={ru} alt="Russia" className="size-5" />
              </button>
              <button
                onClick={() => setLang("uz")}
                className={`${
                  lang == "uz"
                    ? "bg-selected hover:bg-selected"
                    : "bg-transparent hover:bg-hovered"
                } size-8 flex justify-center items-center rounded-full duration-200`}
              >
                <img src={uz} alt="Uzbek" className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        theme={dark}
        toastStyle={{ color: "var(--secondary)" }}
        style={{ backgroundColor: "var(--primary)", color: "var(--secondary)" }}
      />

      {/* OVERFLOW */}
      <div
        onClick={closeAll}
        className={`${
          sidebar || loading ? "block" : "hidden"
        } inset-0 fixed top-0 z-0 bg-black bg-opacity-40 backdrop-blur-md sm:hidden`}
      ></div>
    </main>
  );
};

export default Layout;
