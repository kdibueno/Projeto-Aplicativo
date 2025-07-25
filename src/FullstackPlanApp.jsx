import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Sun, Moon, CheckCircle2, Timer, Bell } from "lucide-react";
import { useLocalStorage } from "@uidotdev/usehooks";

// Exemplo de objeto 'plans', adapte ao seu
const plans = {
  desenvolvedor: [
    {
      week: "Semana 1",
      focus: "Fundamentos de HTML, CSS e Git",
      tasks: [
        "Aprender estrutura básica HTML",
        "Estilizar páginas com CSS",
        "Entender controle de versões com Git",
      ],
    },
    {
      week: "Semana 2",
      focus: "JavaScript moderno e DOM",
      tasks: [
        "Sintaxe moderna (ES6+)",
        "Manipulação do DOM",
        "Eventos e listeners",
      ],
    },
    {
      week: "Semana 3",
      focus: "React e componentes reutilizáveis",
      tasks: [
        "Criar componentes funcionais",
        "Hooks básicos (useState, useEffect)",
        "Props e estado",
      ],
    },
    {
      week: "Semana 4",
      focus: "Projetos práticos e integração com API",
      tasks: [
        "Consumir API REST",
        "Criar projeto prático",
        "Deploy básico",
      ],
    },
  ],
  fitness: [
    {
      week: "Semana 1",
      focus: "Avaliação física e metas",
      tasks: ["Medir composição corporal", "Definir metas reais", "Plano alimentar básico"],
    },
    {
      week: "Semana 2",
      focus: "Treino de força inicial",
      tasks: ["Aprender técnica correta", "Treinar grupos musculares", "Ajustar cargas"],
    },
    {
      week: "Semana 3",
      focus: "Treino cardiovascular",
      tasks: ["Exercícios aeróbicos", "Treinos intervalados", "Monitorar frequência cardíaca"],
    },
    {
      week: "Semana 4",
      focus: "Acompanhamento e ajustes",
      tasks: ["Reavaliar progresso", "Ajustar treino", "Manter motivação"],
    },
  ],
};

function PomodoroTimer() {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    setSecondsLeft(focusMinutes * 60);
  }, [focusMinutes]);

  useEffect(() => {
    let timer = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      if (!isBreak) {
        setIsBreak(true);
        setSecondsLeft(breakMinutes * 60);
      } else {
        setIsBreak(false);
        setSecondsLeft(focusMinutes * 60);
        setCyclesCompleted((c) => c + 1);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, isBreak, focusMinutes, breakMinutes]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <motion.div
      className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-2xl shadow-md p-6 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-zinc-800 dark:text-white mb-4">Pomodoro</h3>
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-sm text-zinc-600 dark:text-zinc-300">Foco:</label>
        <Input
          type="number"
          min={1}
          max={120}
          value={focusMinutes}
          onChange={(e) => setFocusMinutes(Number(e.target.value))}
          className="w-20"
        />
        <label className="text-sm text-zinc-600 dark:text-zinc-300">Pausa:</label>
        <Input
          type="number"
          min={1}
          max={60}
          value={breakMinutes}
          onChange={(e) => setBreakMinutes(Number(e.target.value))}
          className="w-20"
        />
      </div>
      <div className="text-5xl font-mono text-center my-4 text-zinc-900 dark:text-zinc-100">
        {minutes}:{seconds}
      </div>
      <div className="flex justify-center gap-3">
        <Button onClick={() => setIsRunning(true)} className="flex items-center gap-1">
          <Timer className="w-4 h-4" /> Iniciar
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
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-4">
        Ciclos concluídos: {cyclesCompleted}
      </p>
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

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.title = "Meus Projetos de Vida";
  }, []);

  // Notificação de lembrete simples baseada em horário (exemplo básico)
  useEffect(() => {
    if (!reminder) return;

    const checkReminder = () => {
      const now = new Date();
      const [hourStr, minStr] = reminder.match(/\d+/g) || [];
      if (!hourStr || !minStr) return;

      if (now.getHours() === parseInt(hourStr) && now.getMinutes() === parseInt(minStr)) {
        alert("Lembrete: Hora de estudar seus projetos!");
      }
    };

    const interval = setInterval(checkReminder, 60000); // verifica a cada minuto
    return () => clearInterval(interval);
  }, [reminder]);

  // Alterna progresso entre 0 e 100 para a semana clicada (completar ou limpar)
  function toggleTask(section, index) {
    const newCompleted = { ...completed };
    newCompleted[section][index] = newCompleted[section][index] === 100 ? 0 : 100;
    setCompleted(newCompleted);
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">Meus Projetos de Vida</h1>
          <Button variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className="text-zinc-600 dark:text-zinc-300">Definir lembrete:</label>
          <div className="flex items-center w-full gap-2">
            <Input
              type="text"
              placeholder="Ex: Estudar às 20:00"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="flex-1"
            />
            <Bell className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </div>
        </div>

        <PomodoroTimer />

        <Tabs defaultValue="desenvolvedor" className="w-full">
          <TabsList className="grid grid-cols-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
            <TabsTrigger value="desenvolvedor">Desenvolvedor</TabsTrigger>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
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
                    className="mt-6"
                  >
                    <Card className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            {week.week}
                          </h2>
                        </div>

                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">{week.focus}</p>

                        <ul className="space-y-2">
                          {week.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                onChange={() => toggleTask(section, index)}
                                checked={completed[section][index] === 100}
                              />
                              <span className="flex items-center gap-1 text-zinc-800 dark:text-zinc-200">
                                <CheckCircle2 className="w-4 h-4 text-green-500" /> {task}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4">
                          <Progress value={completed[section][index]} className="h-2 rounded-full" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
