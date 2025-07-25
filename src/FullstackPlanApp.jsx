import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UserIcon,
  CalendarIcon,
  BookIcon,
  Code2Icon,
  Bell,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Planner() {
  const [checkedWeeks, setCheckedWeeks] = useState(Array(4).fill(false));
  const [reminderTime, setReminderTime] = useState("");

  useEffect(() => {
    document.title = "Upnexo | Jornada Dev";
  }, []);

  useEffect(() => {
    if (!reminderTime) return;
    const [hours, minutes] = reminderTime.split(":").map(Number);
    const now = new Date();
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0, 0);

    if (reminderDate > now) {
      const timeout = reminderDate - now;
      const timer = setTimeout(() => {
        alert("Lembrete: Hora de revisar sua Jornada Dev!");
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [reminderTime]);

  const weeks = [
    {
      title: "Semana 1",
      description: "Fundamentos de HTML, CSS e Git",
      icon: <UserIcon className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: "Semana 2",
      description: "JavaScript moderno e DOM",
      icon: <Code2Icon className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: "Semana 3",
      description: "React e componentes reutilizáveis",
      icon: <BookIcon className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: "Semana 4",
      description: "Projetos práticos e integração com API",
      icon: <CalendarIcon className="h-6 w-6 text-indigo-500" />,
    },
  ];

  const handleCheckboxChange = (index) => {
    const updated = [...checkedWeeks];
    updated[index] = !updated[index];
    setCheckedWeeks(updated);
  };

  const progressValue = (checkedWeeks.filter(Boolean).length / weeks.length) * 100;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1 className="text-4xl font-bold text-center text-indigo-600 dark:text-indigo-300 mb-8">
        Jornada Dev - Upnexo
      </h1>

      <div className="max-w-xl mx-auto mb-6">
        <Progress value={progressValue} className="h-4" />
      </div>

      <div className="max-w-xl mx-auto mb-8">
        <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
          Definir horário de lembrete:
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="border rounded p-2 w-full dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
          <Bell className="w-5 h-5 text-indigo-500" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {weeks.map((week, index) => (
          <motion.div
            key={index}
            className="hover:scale-105 transform transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <Card className="bg-white dark:bg-gray-900 shadow-xl border border-indigo-100 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center gap-4">
                {week.icon}
                <div>
                  <CardTitle className="text-lg text-indigo-700 dark:text-indigo-300">
                    {week.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {week.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Conteúdo planejado para dominar as bases da programação e avançar com projetos reais.
                </p>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={checkedWeeks[index]}
                    onChange={() => handleCheckboxChange(index)}
                    className="form-checkbox h-4 w-4 text-indigo-600"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Concluído</span>
                </label>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
