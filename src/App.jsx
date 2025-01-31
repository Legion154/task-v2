import React, { useState, useEffect } from "react";
import translations from "../lang.json";
import uz from "./assets/uz.png";
import ru from "./assets/ru.png";
import en from "./assets/en.png";
import { toast, ToastContainer } from "react-toastify";

const App = () => {
  const defaultDateInp = new Date().toISOString().split("T")[0];

  const [sidebar, setSidebar] = useState(false);
  const [completedTasks, setCompletedtasks] = useState([]);
  const [taskToConfirm, setTaskToConfirm] = useState(null);
  const [h1story, setH1story] = useState(false);
  const [taskFocus, setTaskfocus] = useState(false);
  const [date, setDate] = useState(defaultDateInp);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "true"
  );
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem("lang");
    return savedLang ? savedLang : "en";
  });
  const [langX, setLangx] = useState(translations[lang]);

  const notify = () => toast(langX.error);

  const choosenDate = (e) => {
    setDate(e.target.value);
  };

  useEffect(() => {
    setLangx(translations[lang]);
  }, [lang]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
    const savedCompletedTasks = JSON.parse(
      localStorage.getItem("completedTasks")
    );
    if (savedCompletedTasks) {
      setCompletedtasks(savedCompletedTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    if (completedTasks.length > 0) {
      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    }
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const inputVal = (e) => {
    setTask(e.target.value);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!task) {
      return notify();
    }

    const newTask = {
      id: Date.now(),
      task: task,
      deadline: date,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  const completedTask = (id) => {
    const taskToComplete = tasks.find((task) => task.id === id);
    if (taskToComplete) {
      setTaskToConfirm(taskToComplete);
      setLoading(true);
    }
  };

  const deleteTask = (id) => {
    const taskToDelete = completedTasks.find((task) => task.id === id);

    if (taskToDelete) {
      const updatedCompletedTasks = completedTasks.filter(
        (task) => task.id !== id
      );

      setCompletedtasks(updatedCompletedTasks);
      localStorage.setItem(
        "completedTasks",
        JSON.stringify(updatedCompletedTasks)
      );
    }
  };

  const confirmDelete = () => {
    setTasks(tasks.filter((task) => task.id !== taskToConfirm.id));

    setCompletedtasks([...completedTasks, taskToConfirm]);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

    setTaskToConfirm(null);
    setLoading(false);
  };

  const cancelDelete = () => {
    setTaskToConfirm(null);
    setLoading(false);
  };

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

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

  const closeSidebar = () => {
    setSidebar(false);
  };

  const openHistory = () => {
    setSidebar(false);
    setTimeout(() => {
      setH1story(true);
    }, 200);
  };

  const closeAll = () => {
    setSidebar(false);
    setLoading(false);
  };

  return (
    <main className="overflow-hidden relative bg-primary w-full sm:hidden">
      {/* -- UI */}
      <div className="flex flex-row items-center justify-between px-5 py-3">
        <h1 className="text-lg font-medium text-secondary">
          {langX.taskleft}: {tasks.length}
        </h1>
        <div onClick={openSidebar} className="cursor-pointer select-none">
          <i className="fa-solid fa-bars-staggered text-xl text-secondary"></i>
        </div>
      </div>

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
          <button type="button" onClick={closeSidebar}>
            <i className="fa-solid fa-xmark text-lg text-secondary"></i>
          </button>
        </div>
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-2">
            <div
              onClick={openHistory}
              className="shadow-sm shadow-[#4F5665] text-secondary rounded-lg px-3 py-3 hover:bg-gray-400/10 hover:text-[#17252a] hover:opacity-80 dark:hover:bg-gray-200 duration-200 cursor-pointer"
            >
              {langX.history}
            </div>
            <div
              onClick={closeSidebar}
              className="shadow-sm shadow-[#4F5665] text-secondary rounded-lg px-3 py-3 hover:bg-gray-400/10 hover:text-[#17252a] hover:opacity-80 dark:hover:bg-gray-200 duration-200 cursor-pointer"
            >
              {langX.dailytasks}
            </div>
            <div className="shadow-sm shadow-[#4F5665] text-secondary rounded-lg px-3 py-3 duration-200 cursor-pointer line-through relative before:absolute before:top-0 before:left-0 before:content-normal before:w-full before:h-full before:bg-gray-500 before:opacity-80 before:rounded-md">
              {" "}
              {/* hover:bg-gray-400/10 hover:text-[#17252a] hover:opacity-80 dark:hover:bg-gray-200 */}
              {langX.purposes}
            </div>
          </div>

          {/* EXTRA OPTIONS */}
          <div className="flex flex-row items-center justify-between">
            <div className="flex text-secondary flex-row items-center gap-3">
              <h1>{langX.mode}</h1>
              <div className="relative inline-block w-8 h-4 focus:outline-none cursor-pointer rounded-full">
                <input
                  type="checkbox"
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

      {/* HISTORY */}

      <div
        className={`${
          h1story ? "translate-x-0" : "translate-x-[800px]"
        } fixed z-10 top-0 right-0 px-5 py-3 pb-20 bg-inherit w-screen h-screen flex flex-col gap-5 overflow-hidden duration-500 sm:hidden`}
      >
        {/* INTRO */}

        <span className="text-center text-secondary opacity-60 relative before:absolute before:content-normal before:-bottom-1 before:left-0 before:right-0 before:m-auto before:h-[1px] before:w-full before:bg-opacity-60 before:bg-current">
          {langX.historyInt}
        </span>

        {/* BACK BUTTON */}

        <button
          onClick={() => setH1story(false)}
          type="button"
          className="select-none px-7 py-3 font-medium text-white bg-red-500 active:bg-red-600 rounded-md duration-200"
        >
          <i className="fa-solid fa-arrow-left pr-2"></i> {langX.back}
        </button>

        {/* FINISHED TASKS */}

        <div className="flex flex-col gap-4 overflow-y-scroll overflow-x-hidden">
          {completedTasks.map(({ id, task }) => (
            <div
              key={`completed_${id}`}
              className="flex flex-row items-center justify-between gap-4 bg-input rounded-md px-5 py-5"
            >
              <h1 className="px-3 py-0.5 text-secondary">{task}</h1>
              <button
                onClick={() => deleteTask(id)}
                className="py-1 px-2 bg-red-500 text-secondary font-bold rounded-md hover:bg-red-600 select-none duration-200"
              >
                {langX.remove}
              </button>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer
        theme={dark}
        toastStyle={{ color: "var(--secondary)" }}
        style={{ backgroundColor: "var(--primary)", color: "var(--secondary)" }}
      />

      <section className="relative px-7 py-5 rounded-md flex flex-col gap-5 mt-28 items-center w-full sm:w-auto">
        <form
          onSubmit={addTask}
          className="flex flex-row items-center gap-4 bg-input rounded-md px-5 py-5 w-full sm:w-auto"
        >
          <input
            id="deadline"
            value={task}
            onChange={inputVal}
            placeholder={langX.placeholder}
            type="text"
            className="bg-transparent focus:outline-none rounded-md px-3 py-0.5 border border-slate-300 text-secondary w-full"
            onFocus={() => setTaskfocus(true)}
            onBlur={() => setTaskfocus(false)}
          />
          <button
            type="submit"
            className="py-1 px-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 select-none duration-200"
          >
            <h1>{langX.add}</h1>
          </button>
        </form>

        {/* DEADLINE */}
        <div
          onFocus={() => setTaskfocus(true)}
          onBlur={() => setTaskfocus(false)}
          className={`${
            taskFocus
              ? "opacity-100 -top-10 visible"
              : "opacity-0 -top-8 invisible"
          } absolute flex flex-row items-center bg-input text-secondary rounded-md px-5 py-2 duration-300`}
        >
          <input
            type="date"
            value={date}
            onChange={choosenDate}
            className="bg-transparent focus:outline-none rounded-md px-3 py-0.5"
          />
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-3 w-full h-screen mt-4 overflow-y-scroll">
          {tasks.map(({ id, task, deadline }) => (
            <div
              key={`task_${id}`}
              className="tasks flex flex-col gap-2 bg-input rounded-md px-5 pt-5 py-1.5"
            >
              <div className="flex flex-row items-start justify-between gap-4">
                <h1 className="px-3 py-0.5 text-pretty text-secondary">
                  {task}
                </h1>
                <button
                  onClick={() => completedTask(id)}
                  className="py-1 px-2 bg-emerald-500 text-white font-bold rounded-md hover:bg-emerald-600 select-none duration-200"
                >
                  {langX.done}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-400 font-bold">
                  {langX.deadline}{" "}
                  <span className="text-blue-400">
                    {deadline && deadline !== ""
                      ? deadline
                      : langX.nullDeadline}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* ADMISSION */}
        <div
          className={`${
            loading ? "opacity-100 visible" : "opacity-0 invisible"
          } absolute top-20 z-10 select-none duration-300`}
        >
          <span
            className={`${
              dark ? "bg-slate-300" : "bg-slate-200"
            } flex flex-col justify-center items-center gap-6 px-10 py-5 rounded-md shadow-xl duration-300`}
          >
            <h1 className="text-3xl font-bold text-center">
              {langX.admission}
            </h1>
            <div>
              <button
                id="confirm"
                type="button"
                onClick={confirmDelete}
                className="py-2 px-4 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 duration-200"
              >
                {langX.yes}
              </button>
              <button
                id="cancel"
                type="button"
                onClick={cancelDelete}
                className="py-2 px-4 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 duration-200 ml-3"
              >
                {langX.no}
              </button>
            </div>
          </span>
        </div>
      </section>

      {/* PURPOSED TASKS */}

      <section className="relative px-7 py-5 rounded-md hidden flex-col gap-5 mt-28 items-center w-full sm:w-auto">
        <form
          onSubmit={addTask}
          className="flex flex-row items-center gap-4 bg-input rounded-md px-5 py-5 w-full sm:w-auto"
        >
          <input
            id="deadline"
            value={task}
            onChange={inputVal}
            placeholder={langX.placeholder}
            type="text"
            className="bg-transparent focus:outline-none rounded-md px-3 py-0.5 border border-slate-300 text-secondary w-full"
            onFocus={() => setTaskfocus(true)}
            onBlur={() => setTaskfocus(false)}
          />
          <button
            type="submit"
            className="py-1 px-2 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 select-none duration-200"
          >
            {langX.add}
          </button>
        </form>

        {/* DEADLINE */}
        <div
          onFocus={() => setTaskfocus(true)}
          onBlur={() => setTaskfocus(false)}
          className={`${
            taskFocus
              ? "opacity-100 -top-10 visible"
              : "opacity-0 -top-8 invisible"
          } absolute flex flex-row items-center bg-input text-secondary rounded-md px-5 py-2 duration-300`}
        >
          <input
            type="date"
            value={date}
            onChange={choosenDate}
            className="bg-transparent focus:outline-none rounded-md px-3 py-0.5"
          />
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-3 w-full h-screen mt-4 overflow-y-scroll">
          {tasks.map(({ id, task, deadline }) => (
            <div
              key={`task_${id}`}
              className="tasks flex flex-col gap-2 bg-input rounded-md px-5 pt-5 py-1.5"
            >
              <div className="flex flex-row items-start justify-between gap-4">
                <h1 className="px-3 py-0.5 text-pretty text-secondary">
                  {task}
                </h1>
                <button
                  onClick={() => completedTask(id)}
                  className="py-1 px-2 bg-indigo-500 text-white font-bold rounded-md hover:bg-indigo-600 select-none duration-200"
                >
                  {langX.done}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-400 font-bold">
                  {langX.deadline}{" "}
                  <span className="text-blue-400">
                    {deadline && deadline !== ""
                      ? deadline
                      : langX.nullDeadline}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* ADMISSION */}
        <div
          className={`${
            loading ? "opacity-100 visible" : "opacity-0 invisible"
          } absolute top-20 z-10 select-none duration-300`}
        >
          <span
            className={`${
              dark ? "bg-slate-300" : "bg-slate-200"
            } flex flex-col justify-center items-center gap-6 px-10 py-5 rounded-md shadow-xl duration-300`}
          >
            <h1 className="text-3xl font-bold text-center">
              {langX.admission}
            </h1>
            <div>
              <button
                id="confirm"
                type="button"
                onClick={confirmDelete}
                className="py-2 px-4 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 duration-200"
              >
                {langX.yes}
              </button>
              <button
                id="cancel"
                type="button"
                onClick={cancelDelete}
                className="py-2 px-4 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 duration-200 ml-3"
              >
                {langX.no}
              </button>
            </div>
          </span>
        </div>
      </section>

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

export default App;
