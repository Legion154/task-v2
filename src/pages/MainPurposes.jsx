import { toast, ToastContainer } from "react-toastify";
import { useState, useEffect, useContext, useRef } from "react";
import Loading from "../components/Loading";
import uz from "../assets/uz.png";
import ru from "../assets/ru.png";
import en from "../assets/en.png";
import { GlobalContext } from "../../GlobalProvider";

const MainPurposes = () => {
  const defaultDateInp = new Date().toISOString().split("T")[0];

  const {
    mainGoals,
    setMainGoals,
    loading,
    setLoading,
    completedMainGoals,
    setCompletedMainGoals,
    mainGoalsHistory,
    setMainGoalsHistory,
    lang,
    setLang,
    langX,
    setLangx,
  } = useContext(GlobalContext);

  const [taskToConfirm, setTaskToConfirm] = useState(null);
  const [taskFocus, setTaskfocus] = useState(false);
  const [date, setDate] = useState(defaultDateInp);
  const [task, setTask] = useState("");
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "true",
  );
  const [clientMaxed, setClientMaxed] = useState(false);
  const listRef = useRef(null);

  const notify = () => toast(langX.error);

  const choosenDate = (e) => {
    setDate(e.target.value);
  };

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("mainGoals"));
    if (savedTasks) {
      setMainGoals(savedTasks);
    }
    const savedmainGoals = JSON.parse(localStorage.getItem("mainGoals"));
    if (savedmainGoals) {
      setMainGoals(savedmainGoals);
    }
  }, []);

  useEffect(() => {
    if (mainGoals.length > 0) {
      localStorage.setItem("mainGoals", JSON.stringify(mainGoals));
    }
  }, [mainGoals]);

  useEffect(() => {
    if (mainGoals.length > 0) {
      localStorage.setItem("mainGoals", JSON.stringify(mainGoals));
    }
  }, [mainGoals]);

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

    setMainGoals([...mainGoals, newTask]);
    setTask("");
  };

  const completedTask = (id) => {
    const taskToComplete = mainGoals.find((task) => task.id === id);
    if (taskToComplete) {
      setTaskToConfirm(taskToComplete);
      setLoading(true);
    }
  };

  const deleteTask = (id) => {
    const taskToDelete = mainGoals.find((task) => task.id === id);

    if (taskToDelete) {
      const updatedmainGoals = mainGoals.filter((task) => task.id !== id);

      setMainGoals(updatedmainGoals);
      localStorage.setItem("mainGoals", JSON.stringify(updatedmainGoals));
    }
  };

  const confirmDelete = () => {
    if (!taskToConfirm) return;

    // 1️⃣ mainGoals dan o‘chiramiz
    setMainGoals((prev) => prev.filter((task) => task.id !== taskToConfirm.id));

    // 2️⃣ completedMainGoals ga qo‘shamiz
    setCompletedMainGoals((prev) => [...prev, taskToConfirm]);

    setTaskToConfirm(null);
    setLoading(false);
  };

  const cancelDelete = () => {
    setTaskToConfirm(null);
    setLoading(false);
  };

  const taskRangeCondition = () => {
    const el = listRef.current;

    if (!el) return;

    const maxScrolled = el.scrollHeight - el.scrollTop <= el.clientHeight + 5;

    setClientMaxed(maxScrolled);
  };

  const closeHistoy = () => {
    setMainGoalsHistory(false);
  };

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  return (
    <main className="px-3.5 py-5 rounded-md flex flex-col items-center gap-5 mt-28 w-full h-screen">
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
      <ul
        ref={listRef}
        onScroll={taskRangeCondition}
        className="flex flex-col gap-3 w-full mt-4 overflow-y-scroll h-[58vh]"
      >
        {mainGoals.map(({ id, task, deadline }) => (
          <li
            key={`task_${id}`}
            className="tasks flex flex-col gap-2 bg-input rounded-md px-5 pt-5 py-1.5"
          >
            <div className="flex flex-row items-start justify-between gap-4">
              <h1 className="px-3 py-0.5 text-pretty text-secondary">{task}</h1>
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
                  {deadline && deadline !== "" ? deadline : langX.nullDeadline}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* HISTORY */}
      <div
        className={`${
          mainGoalsHistory ? "translate-x-0" : "translate-x-[800px]"
        } fixed z-50 top-0 right-0 px-5 py-3 pb-2 w-screen h-screen bg-primary flex flex-col gap-5 overflow-hidden duration-500 sm:hidden`}
      >
        {/* INTRO */}

        <span className="text-center text-secondary opacity-60 relative before:absolute before:content-normal before:-bottom-1 before:left-0 before:right-0 before:m-auto before:h-[1px] before:w-full before:bg-opacity-60 before:bg-current">
          {langX.historyInt}
        </span>

        {/* BACK BUTTON */}

        <button
          onClick={closeHistoy}
          type="button"
          className="select-none px-7 py-3 font-medium text-white bg-red-500 active:bg-red-600 rounded-md duration-200"
        >
          <i className="fa-solid fa-arrow-left pr-2"></i> {langX.back}
        </button>

        {/* FINISHED TASKS */}

        <div className="flex flex-col gap-4 overflow-y-scroll overflow-x-hidden">
          {completedMainGoals.map(({ id, task }) => (
            <div
              key={`completed_${id}`}
              className="flex flex-row items-center justify-between gap-4 bg-input rounded-md px-5 py-5"
            >
              <h1 className="px-3 py-0.5 text-secondary">{task}</h1>
              <button
                onClick={() => deleteTask(id)}
                className={`${dark ? "text-[#181d19]" : "text-[#f4f4f4]"} py-1 px-2 bg-red-500 font-bold rounded-md hover:bg-red-600 select-none duration-200`}
              >
                {langX.remove}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ADMISSION */}
      <div
        className={`${
          loading ? "opacity-100 visible" : "opacity-0 invisible"
        } absolute top-60 z-10 select-none duration-300`}
      >
        <span
          className={`${
            dark ? "bg-slate-300" : "bg-slate-200"
          } flex flex-col justify-center items-center gap-6 px-10 py-5 rounded-md shadow-xl duration-300`}
        >
          <h1 className="text-3xl font-bold text-center">{langX.admission}</h1>
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

      {/* Bottom overlay */}
      <span
        className={`${mainGoals.length <= 4 || clientMaxed ? "hidden" : "block"} fixed bottom-0 left-0 w-full h-5 pointer-events-none bg-black opacity-90 blur-md`}
      ></span>
    </main>
  );
};

export default MainPurposes;
