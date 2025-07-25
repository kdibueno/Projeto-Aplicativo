import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Sun, Moon, CheckCircle2, Timer, Bell } from "lucide-react";
import { useLocalStorage } from "@uidotdev/usehooks";

const plans = {
  desenvolvedor: [
    {
      week: "Semana 1 (Jul 29 – Ago 4)",
      focus: "Fundamentos + JavaScript Básico",
      tasks: [
        "Finalizar Trilha Fundamentos",
        "Variáveis, tipos, operadores",
        "Funções, arrays, objetos",
        "DOM e eventos (mini-projeto: contador)",
      ],
    },
    {
      week: "Semana 2 (Ago 5 – Ago 11)",
      focus: "JavaScript Avançado + Mini-projetos",
      tasks: [
        "Funções assíncronas, fetch API",
        "async/await, promises",
        "Mini-projeto: To-do list com localStorage",
        "Git e GitHub básico",
      ],
    },
    {
      week: "Semana 3 (Ago 12 – Ago 18)",
      focus: "Mini-projeto: app de tarefas + revisão JS",
      tasks: ["Desenvolver app de tarefas", "Revisar variáveis, funções e DOM"],
    },
    {
      week: "Semana 4 (Ago 19 – Ago 25)",
      focus: "Finalizar mini-projetos + revisão geral JS",
      tasks: ["Finalizar mini-projetos", "Revisar eventos e funções assíncronas"],
    },
    {
      week: "Semana 5 (Ago 26 – Set 1)",
      focus: "Tailwind CSS básico",
      tasks: ["Estudar Tailwind CSS", "Aplicar em pequenos projetos"],
    },
    {
      week: "Semana 6 (Set 2 – Set 8)",
      focus: "Tailwind CSS avançado + React Básico",
      tasks: [
        "Finalizar Tailwind CSS",
        "Estudar componentes React, props, estado, eventos",
      ],
    },
    {
      week: "Semana 7 (Set 9 – Set 15)",
      focus: "Hooks React (useState, useEffect)",
      tasks: [
        "Estudar e aplicar useState e useEffect",
        "Criar componentes interativos",
      ],
    },
    {
      week: "Semana 8 (Set 16 – Set 22)",
      focus: "React Router DOM + Projeto React + Tailwind",
      tasks: [
        "Aprender React Router DOM",
        "Iniciar projeto prático (ex: app de receitas)",
      ],
    },
    {
      week: "Semana 9 (Set 23 – Set 29)",
      focus: "Projeto React + Tailwind avançado",
      tasks: [
        "Avançar no projeto prático",
        "Implementar rotas, estado e estilização",
      ],
    },
    {
      week: "Semana 10 (Set 30 – Out 6)",
      focus: "React Avançado: Context API e useReducer",
      tasks: ["Estudar Context API", "Estudar useReducer"],
    },
    {
      week: "Semana 11 (Out 7 – Out 13)",
      focus: "React Avançado: custom hooks e organização",
      tasks: ["Criar custom hooks", "Organizar pastas e código"],
    },
    {
      week: "Semana 12 (Out 14 – Out 20)",
      focus: "TypeScript básico com React",
      tasks: ["Aprender fundamentos TS", "Aplicar TS em componentes React"],
    },
    {
      week: "Semana 13 (Out 21 – Out 27)",
      focus: "Projeto React + TypeScript",
      tasks: ["Criar painel admin ou lista de tarefas com filtros"],
    },
    {
      week: "Semana 14 (Out 28 – Nov 3)",
      focus: "Backend: Node.js e Express",
      tasks: ["Estudar Node.js e Express", "Configurar servidor básico"],
    },
    {
      week: "Semana 15 (Nov 4 – Nov 10)",
      focus: "APIs REST",
      tasks: ["Criar e consumir APIs REST"],
    },
    {
      week: "Semana 16 (Nov 11 – Nov 17)",
      focus: "Autenticação JWT",
      tasks: ["Estudar autenticação com JWT", "Implementar autenticação básica"],
    },
    {
      week: "Semana 17 (Nov 18 – Nov 24)",
      focus: "Banco de dados MongoDB + projeto backend",
      tasks: ["Estudar MongoDB", "Desenvolver API de blog com usuários"],
    },
    {
      week: "Semana 18 (Nov 25 – Dez 1)",
      focus: "Projeto Fullstack: integrar frontend e backend",
      tasks: ["Unir React frontend com backend Node"],
    },
    {
      week: "Semana 19 (Dez 2 – Dez 8)",
      focus: "Deploy frontend e backend",
      tasks: ["Deploy frontend no Vercel", "Deploy backend no Render ou Railway"],
    },
    {
      week: "Semana 20 (Dez 9 – Dez 15)",
      focus: "Documentação e portfólio",
      tasks: ["Criar README detalhado no GitHub", "Organizar portfólio para apresentação"],
    },
  ],

  fitness: [
    {
      week: "Semana 1 (Jul 29 – Ago 4)",
      focus: "Rotina inicial + alimentação",
      tasks: [
        "Criar plano alimentar semanal",
        "Treino funcional 3x na semana",
        "Beber 2L de água por dia",
        "Registrar hábitos no app de saúde",
      ],
    },
    // Você pode adicionar outras semanas aqui
  ],
};

function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

function sendReminderNotification(message) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Lembrete", {
      body: message,
    });
  }
}

function playSound() {
  const audio = new Audio(
    "https://notificationsounds.com/storage/sounds/file-sounds-1152-pristine.mp3"
  );
  audio.play();
}

function PomodoroTimer() {
  const [focusMinutes, setFocusMinutes] = useLocalStorage("focusMinutes", 25);
  const [breakMinutes, setBreakMinutes] = useLocalStorage("breakMinutes", 5);
  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useLocalStorage("pomodoroCycles", 0);

  useEffect(() => {
    setSecondsLeft(focusMinutes * 60);
  }, [focusMinutes]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          playSound();
          sendReminderNotification(
            isBreak ? "Pausa finalizada! Volte ao foco." : "Pomodoro finalizado! Faça uma pausa."
          );
          if (!isBreak) setCyclesCompleted((c) => c + 1);
          setIsBreak(!isBreak);
          return (isBreak ? focusMinutes : breakMinutes) * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, isBreak, focusMinutes, breakMinutes]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-4 p-4 border rounded-xl dark:border-zinc-700 shadow-xl bg-white dark:bg-zinc-800"
    >
      <h3 className="text-lg font-semibold">Pomodoro</h3>
      <div className="flex gap-2">
        <label className="text-sm">Foco:</label>
        <Input
          type="number"
          min="1"
          value={focusMinutes}
          onChange={(e) => setFocusMinutes(Number(e.target.value))}
          className="w-16"
        />
        <label className="text-sm">Pausa:</label>
        <Input
          type="number"
          min="1"
          value={breakMinutes}
          onChange={(e) => setBreakMinutes(Number(e.target.value))}
          className="w-16"
        />
      </div>
      <div className="text-3xl font-mono">
        {minutes}:{seconds}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setIsRunning(true)}>
          <Timer className="w-4 h-4 mr-1" /> Iniciar
        </Button>
        <Button variant="secondary" onClick={() => setIsRunning(false)}>
          Pausar
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setIsRunning(false);
            setSecondsLeft(focusMinutes * 60);
            setIsBreak(false);
          }}
        >
          Resetar
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">Ciclos concluídos: {cyclesCompleted}</p>
    </motion.div>
  );
}

export default function FullstackPlanApp() {
  const [completed, setCompleted] = useLocalStorage("completed", {
    desenvolvedor: Array(plans.desenvolvedor.length).fill(0),
    fitness: Array(plans.fitness.length).fill(0),
  });
  const [reminder, setReminder] = useLocalStorage("reminder", "");
  const [theme, setTheme] = useLocalStorage("theme", "dark");

  // Alterna entre progresso 0 e 100 para cada semana
  const toggleTask = (section, weekIndex) => {
    setCompleted((prev) => {
      const newProgress = { ...prev };
      newProgress[section] = [...newProgress[section]]; // clonar array para React detectar mudança
      newProgress[section][weekIndex] = newProgress[section][weekIndex] === 100 ? 0 : 100;
      return newProgress;
    });
  };

  // Atualiza classe do tema dark
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Pede permissão de notificação
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Verifica lembrete a cada minuto e dispara notificação se horário bate
  useEffect(() => {
    if (!reminder.trim()) return;

    const checkReminder = () => {
      const now = new Date();
      // espera string no formato "HH:mm" (ex: "20:00")
      const regex = /(\d{1,2}):(\d{2})/;
      const match = reminder.match(regex);
      if (!match) return;
      const [_, h, m] = match;
      if (now.getHours() === Number(h) && now.getMinutes() === Number(m)) {
        sendReminderNotification(`Lembrete: ${reminder}`);
      }
    };

    const interval = setInterval(checkReminder, 60 * 1000);
    return () => clearInterval(interval);
  }, [reminder]);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 transition-colors duration-300 bg-zinc-100 dark:bg-zinc-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold">Meus Projetos de Vida</h1>
        <Button variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-2"
      >
        <label className="text-sm">Definir lembrete (HH:mm):</label>
        <div className="flex items-center gap-2 w-full">
          <Input
            type="text"
            placeholder="Ex: 20:00"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          />
          <Bell className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
        </div>
      </motion.div>

      <PomodoroTimer />

      <Tabs defaultValue="desenvolvedor" className="w-full">
        <TabsList className="grid grid-cols-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1">
          <TabsTrigger value="desenvolvedor">Projeto Desenvolvedor</TabsTrigger>
          <TabsTrigger value="fitness">Projeto Fitness</TabsTrigger>
        </TabsList>

        {Object.entries(plans).map(([section, weeks]) => (
          <TabsContent key={section} value={section}>
            <AnimatePresence>
              {weeks.map((week, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="rounded-2xl shadow-md mt-4 dark:bg-zinc-900">
                    <CardContent className="p-4">
                      <h2 className="text-xl font-semibold mb-2">{week.week}</h2>
                      <p className="mb-2 text-muted-foreground">{week.focus}</p>
                      <ul className="space-y-1 mb-4">
                        {week.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              onChange={() => toggleTask(section, index)}
                              checked={completed[section][index] === 100}
                            />
                            <span className="flex items-center gap-1 select-none">
                              <CheckCircle2 className="w-4 h-4 text-green-500" /> {task}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completed[section][index]}%` }}
                        transition={{ duration: 0.6 }}
                      >
                        <Progress value={completed[section][index]} />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
