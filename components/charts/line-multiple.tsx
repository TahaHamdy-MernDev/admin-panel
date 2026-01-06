"use client";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import MainCard from "../cards/main-card";
import { useTranslations } from "next-intl";
import { useLocaleDirection } from "@/hooks/use-locale-direction";
export const description = "A multiple line chart";

export function ChartLineMultiple({
  data,
  config,
  data_key,
  keys,
  t_key,
  label,
}: {
  data: unknown[];
  config: ChartConfig;
  data_key: string;
  keys: string[];
  t_key: string;
  label: string;
}) {
  const t = useTranslations(t_key);
  const { is_rtl } = useLocaleDirection();
  return (
    <MainCard title={t(label)} classes={{ content: "px-2" }}>
      <ChartContainer config={config} className="aspect-auto h-[260px] w-full">
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ top: 8, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={data_key}
            tickLine={false}
            axisLine={true}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={true}
            width={34}
            tickMargin={8}
            direction={"ltr"}
            fill="var(--chart-axis-tick)"
            tick={{ color: "#fff" }}
            orientation={is_rtl ? "right" : "left"}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey={keys[0]}
            type="monotone"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey={keys[1]}
            type="monotone"
            stroke="var(--chart-2)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </MainCard>
  );
}
