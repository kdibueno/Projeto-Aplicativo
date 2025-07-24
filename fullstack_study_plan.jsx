import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const plans = {
  desenvolvedor: [
    {
      week: "Semana 1 (Jul 29 – Ago 4)",
      focus: "Fundamentos + JavaScript Básico",
      tasks: [
        "Finalizar Trilha Fundamentos",
        "Variáveis, tipos, operadores",
        "Funções, arrays, objetos",
        "DOM e eventos (mini-projeto: contador)"
      ]
    },
    {
      week: "Semana 2 (Ago 5 – Ago 11)",
      focus: "JavaScript Avançado + Mini-projetos",
      tasks: [
        "Funções assíncronas, fetch API",
        "async/await, promises",
        "Mini-projeto: To-do list com localStorage",
        "Git e GitHub básico"
      ]
    },
    {
      week: "Semana 3 (Ago 12 – Ago 18)",
      focus: "Tailwind CSS + React Básico",
      tasks: [
        "Finalizar módulo Tailwind",
        "React: componentes, props, estado",
        "Eventos e interações",
        "Mini-projeto: app de clima com API"
      ]
    },
    {
      week: "Semana 4 (Ago 19 – Ago 25)",
      focus: "React Router + Organização",
      tasks: [
        "React Router DOM",
        "Hooks: useEffect, useState",
        "Organização de pastas",
        "Projeto: blog com rotas"
      ]
    }
  ],
  fitness: [
    {
      week: "Semana 1 (Jul 29 – Ago 4)",
      focus: "Rotina inicial + alimentação",
      tasks: [
        "Criar plano alimentar semanal",
        "Treino funcional 3x na semana",
        "Beber 2L de água por dia",
        "Registrar hábitos no app de saúde"
      ]
    }
  ]
};

export default function FullstackPlanApp() {
  const [completed, setCompleted] = useState({ desenvolvedor: Array(plans.desenvolvedor.length).fill(0), fitness: Array(plans.fitness.length).fill(0) });
  const [reminder, setReminder] = useState("");

  const toggleTask = (section, weekIndex) => {
    setCompleted(prev => {
      const newProgress = { ...prev };
      const sectionTasks = plans[section][weekIndex].tasks.length;
      const currentProgress = newProgress[section][weekIndex];
      newProgress[section][weekIndex] = currentProgress === 100 ? 0 : 100;
      return newProgress;
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Meus Projetos de Vida</h1>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <label className="text-sm">Definir lembrete:</label>
        <Input
          type="text"
          placeholder="Ex: Estudar às 20h diariamente"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
        />
      </div>

      <Tabs defaultValue="desenvolvedor" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="desenvolvedor">Projeto Desenvolvedor</TabsTrigger>
          <TabsTrigger value="fitness">Projeto Fitness</TabsTrigger>
        </TabsList>

        {Object.entries(plans).map(([section, weeks]) => (
          <TabsContent key={section} value={section}>
            {weeks.map((week, index) => (
              <Card key={index} className="rounded-2xl shadow-md mt-4">
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
                        {task}
                      </li>
                    ))}
                  </ul>
                  <Progress value={completed[section][index]} />
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
