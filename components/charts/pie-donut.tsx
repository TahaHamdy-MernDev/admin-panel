"use client";
import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import MainCard from "../cards/main-card";
import { useTranslations } from "next-intl";

export function ChartPieDonut({
  data_key,
  name_key,
  data,
  t_key,
  label,
  config,
  innerRadius = 65,
  outerRadius = 95,
  paddingAngle = 3,
}: {
  data_key: string;
  name_key: string;
  data: { name: string; value: number }[];
  t_key: string;
  label: string;
  config: ChartConfig;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
}) {
  const t = useTranslations(t_key);
  const TOTAL = data.reduce((a, b) => a + Number(b.value), 0);

  const pieColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  return (
    <MainCard
      title={t(label)}
      classes={{
        content:
          "flex flex-col sm:flex-row items-center gap-2 px-2",
      }}
    >
      <ChartContainer config={config} className="aspect-auto h-[260px] w-full">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          <Pie
            data={data}
            dataKey={data_key}
            nameKey={name_key}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            strokeWidth={4}
            stroke="var(--surface)"
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={pieColors[i % pieColors.length]}
                filter="url(#shadow)"
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="flex-1 space-y-2 px-3">
        {data.map((p, i) => {
          const percent = TOTAL ? ((p.value / TOTAL) * 100).toFixed(1) : 0;
          return (
            <div
              key={i}
              className="flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-110"
                  style={{ background: pieColors[i] }}
                />
                <span className="dark:text-gray-200 text-gray-800 text-sm truncate">
                  {p.name}
                </span>
              </div>

              <span className="text-sm font-bold dark:text-gray-200 text-gray-900">
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
    </MainCard>
  );
}
