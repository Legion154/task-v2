import React, { useState, useEffect } from "react";
import uz from "./assets/uz.png";
import ru from "./assets/ru.png";
import en from "./assets/en.png";
import history from "./assets/history.png";
import { ToastContainer, toast } from "react-toastify";

const App = () => {
  const defaultDateInp = new Date().toISOString().split("T")[0];

  const [completedTasks, setCompletedtasks] = useState([]);
  const [taskToConfirm, setTaskToConfirm] = useState(null);
  const [h1story, setH1story] = useState(false);
  const [taskFocus, setTaskfocus] = useState(false);
  const [date, setDate] = useState(defaultDateInp);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem("lang");
    return savedLang ? savedLang : "en";
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const english = {
    add: "Add",
    done: "Done",
    yes: "Of course",
    no: "Nope",
    remove: "Remove",
    admission: "Are you sure!",
    historyInt: "Finished tasks of todays",
    back: "Back",
    placeholder: "Enter your task",
    deadline: "Deadline:",
    nullDeadline: "no deadline",
    error: "That place must not be empty",
  };

  const russian = {
    add: "Добавить",
    done: "Готово",
    yes: "Конечно",
    no: "Нет",
    remove: "Удалять",
    admission: "Вы уверены!",
    historyInt: "Выполненные задачи на сегодня",
    back: "Назад",
    placeholder: "Введите вашу задачу",
    deadline: "Крайний срок:",
    nullDeadline: "нет крайнего срока",
    error: "Это место не должно быть пустым.",
  };

  const uzbek = {
    add: "Qo'shish",
    done: "Bajarildi",
    yes: "Albatta",
    no: "Yo'q",
    remove: "O'chirish",
    admission: "Aniqmi!",
    historyInt: "Bugungi kunning tugallangan vazifalari",
    back: "Orqaga",
    placeholder: "Vazifangizni kiriting",
    deadline: "Muddat:",
    nullDeadline: "muddat yo'q",
    error: "Bu joy bo'sh bo'lmasligi kerak",
  };

  const notify = () =>
    toast(
      lang === "en"
        ? english.error
        : lang === "ru"
        ? russian.error
        : uzbek.error
    );

  const choosenDate = (e) => {
    setDate(e.target.value);
  };

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

  const switchLanguage = (language) => {
    setLang(language);
    setMenuOpen(false);
  };

  const handleClickOutside = (e) => {
    if (
      !e.target.closest(".language-menu") &&
      !e.target.closest(".lang-toggle-btn")
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <main className="overflow-hidden relative bg-[#f4f4f4] selection:bg-emerald-500 selection:text-white w-full sm:hidden">
      <ToastContainer />
      <div className="flex flex-row items-center justify-between px-5 py-3">
        <div
          onClick={() => setMenuOpen((prev) => !prev)}
          className="cursor-pointer select-none text-lg lang-toggle-btn"
        >
          <span>{lang === "en" ? "EN" : lang === "ru" ? "RU" : "UZ"}</span>
        </div>
        <div
          onClick={() => setH1story((prev) => !prev)}
          className="cursor-pointer select-none"
        >
          <img src={history} alt="history" width={25} />
        </div>
      </div>

      {/* LANG TOGGLE */}

      <div
        id="lm"
        className={`language-menu ${
          menuOpen ? "opacity-100 top-10 visible" : "opacity-0 top-8 invisible"
        } absolute rounded-md shadow-lg shadow-gray-500/10 py-3 p-3 border border-transparent bg-primary focus:outline-none overflow-hidden duration-300`}
      >
        <div
          onClick={() => switchLanguage("en")}
          className="pt-[9px] pb-2 px-7 rounded-md text-secondary hover:text-black hover:bg-gray-200 hover:bg-opacity-80 focus:bg-gray-200 focus:bg-opacity-80 select-none cursor-pointer"
        >
          <div className="flex flex-row items-center space-x-2 text-sm">
            <img src={en} className="size-5 relative" alt="en" />
            <span>en</span>
          </div>
        </div>
        <div
          onClick={() => switchLanguage("ru")}
          className="pt-[9px] pb-2 px-7 rounded-md text-secondary hover:text-black hover:bg-gray-200 hover:bg-opacity-80 hover:text-blue-gray-900/10 select-none cursor-pointer"
        >
          <div className="flex flex-row items-center space-x-2 text-sm">
            <img src={ru} className="size-5 relative" alt="ru" />
            <span>ru</span>
          </div>
        </div>
        <div
          onClick={() => switchLanguage("uz")}
          className="pt-[9px] pb-2 px-7 rounded-md text-secondary hover:text-black hover:bg-gray-200 hover:bg-opacity-80 hover:text-blue-gray-900/10 select-none cursor-pointer"
        >
          <div className="flex flex-row items-center space-x-2 text-sm">
            <img src={uz} className="size-5 relative" alt="uz" />
            <span>uz</span>
          </div>
        </div>
      </div>

      <section className="h-screen w-full flex justify-center pb-28">
        <div className="relative px-7 py-5 rounded-md flex flex-col gap-5 mt-28 items-center w-full sm:w-auto">
          <form
            onSubmit={addTask}
            className="flex flex-row items-center gap-4 bg-white rounded-md px-5 py-5 w-full sm:w-auto"
          >
            <input
              id="deadline"
              value={task}
              onChange={inputVal}
              placeholder={
                lang === "en"
                  ? english.placeholder
                  : lang === "ru"
                  ? russian.placeholder
                  : uzbek.placeholder
              }
              type="text"
              className="bg-transparent focus:outline-none rounded-md px-3 py-0.5 border border-slate-300 w-full"
              onFocus={() => setTaskfocus(true)}
              onBlur={() => setTaskfocus(false)}
            />
            <button
              type="submit"
              className="py-1 px-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 select-none duration-200"
            >
              <h1>
                {lang === "en"
                  ? english.add
                  : lang === "ru"
                  ? russian.add
                  : uzbek.add}
              </h1>
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
            } absolute flex flex-row items-center bg-white rounded-md px-5 py-2 duration-300`}
          >
            <input
              type="date"
              value={date}
              onChange={choosenDate}
              className="bg-transparent focus:outline-none rounded-md px-3 py-0.5"
            />
          </div>

          {/* Task List */}
          <div
            id="sortable"
            className="flex flex-col gap-3 w-full mt-4 overflow-y-scroll"
          >
            {tasks.map(({ id, task, deadline }) => (
              <div
                key={`task_${id}`}
                className="flex flex-col gap-2 bg-white rounded-md px-5 pt-5 py-1.5"
              >
                <div className="flex flex-row items-start justify-between gap-4">
                  <h1 className="px-3 py-0.5 text-pretty">{task}</h1>
                  <button
                    onClick={() => completedTask(id)}
                    className="py-1 px-2 bg-emerald-500 text-white font-bold rounded-md hover:bg-emerald-600 select-none duration-200"
                  >
                    {lang === "en"
                      ? english.done
                      : lang === "ru"
                      ? russian.done
                      : uzbek.done}
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-gray-400 font-bold">
                    {lang === "en"
                      ? english.deadline
                      : lang === "ru"
                      ? russian.deadline
                      : uzbek.deadline}{" "}
                    <span className="text-blue-400">
                      {deadline && deadline !== ""
                        ? deadline
                        : lang === "en"
                        ? english.nullDeadline
                        : lang === "ru"
                        ? russian.nullDeadline
                        : uzbek.nullDeadline}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ADMISSION */}

        <div
          className={`${
            loading ? "flex" : "hidden"
          } absolute z-10 flex justify-center items-center h-[80vh] select-none duration-300`}
        >
          <span
            className={`${
              loading ? "h-auto" : "h-0"
            } flex flex-col justify-center items-center gap-6 px-10 py-5 bg-slate-100 rounded-md shadow-xl duration-300`}
          >
            <h1 className="text-3xl font-bold text-center">
              {lang === "en"
                ? english.admission
                : lang === "ru"
                ? russian.admission
                : uzbek.admission}
            </h1>
            <div>
              <button
                id="confirm"
                type="button"
                onClick={confirmDelete}
                className="py-2 px-4 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 duration-200"
              >
                {lang === "en"
                  ? english.yes
                  : lang === "ru"
                  ? russian.yes
                  : uzbek.yes}
              </button>
              <button
                id="cancel"
                type="button"
                onClick={cancelDelete}
                className="py-2 px-4 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 duration-200 ml-3"
              >
                {lang === "en"
                  ? english.no
                  : lang === "ru"
                  ? russian.no
                  : uzbek.no}
              </button>
            </div>
          </span>
        </div>
      </section>

      {/* HISTORY */}

      <div
        className={`${
          h1story ? "translate-x-0" : "translate-x-[800px]"
        } fixed z-10 top-0 right-0 px-5 py-3 pb-20 bg-inherit w-screen h-screen flex flex-col gap-5 overflow-hidden duration-500 sm:hidden`}
      >
        {/* INTRO */}

        <span className="text-center opacity-60 relative before:absolute before:content-normal before:-bottom-1 before:left-0 before:right-0 before:m-auto before:h-[1px] before:w-full before:bg-opacity-60 before:bg-current">
          {lang === "en"
            ? english.historyInt
            : lang === "ru"
            ? russian.historyInt
            : uzbek.historyInt}
        </span>

        {/* BACK BUTTON */}

        <button
          onClick={() => setH1story(false)}
          type="button"
          className="select-none px-7 py-3 font-medium text-white bg-red-500 active:bg-red-600 rounded-md duration-200"
        >
          <i className="fa-solid fa-arrow-left pr-2"></i>{" "}
          {lang === "en"
            ? english.back
            : lang === "ru"
            ? russian.back
            : uzbek.back}
        </button>

        {/* FINISHED TASKS */}

        <div className="flex flex-col gap-4 overflow-y-scroll overflow-x-hidden">
          {completedTasks.map(({ id, task }) => (
            <div
              key={`completed_${id}`}
              className="flex flex-row items-center justify-between gap-4 bg-white rounded-md px-5 py-5"
            >
              <h1 className="px-3 py-0.5">{task}</h1>
              <button
                onClick={() => deleteTask(id)}
                className="py-1 px-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 select-none duration-200"
              >
                {lang === "en"
                  ? english.remove
                  : lang === "ru"
                  ? russian.remove
                  : uzbek.remove}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default App;
