"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import MainCard from "../cards/main-card";
import { useTranslations } from "next-intl";
import { useLocaleDirection } from "@/hooks/use-locale-direction";

export function ChartArea({
  t_key,
  label,
  Xdata_key,
  Ydata_key,
  data,
  right,
  description,
}: {
  t_key: string;
  label: string;
  Xdata_key: string;
  Ydata_key: string;
  data: unknown[];
  right?: string;
  description?: string;
}) {
  const t = useTranslations(t_key);
  const {  is_rtl } = useLocaleDirection();

  const chartConfig = {
    dataset: {
      label: t(label),
      color: "var(--color-primary)",
    },
  } satisfies ChartConfig;

  return (
    <MainCard
      title={t(label)}
      description={description ? t(description) : ""}
      right={right ? t(right) : ""}
      classes={{  content: "px-2" }}
    >
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[260px] w-full"
      >
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey={Xdata_key}
            tickLine={false}
            axisLine={true}
            tickMargin={8}
            tick={{ color: "#fff" }}
            reversed={!is_rtl}
          />

          <YAxis
            width={28}
            tickLine={false}
            axisLine={true}
            direction={"ltr"}
            fill="var(--chart-axis-tick)"
            tick={{ color: "#fff" }}
            orientation={is_rtl ? "right" : "left"}
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />

          <Area
            type="monotone"
            dataKey={Ydata_key}
            stroke="var(--color-primary)"
            strokeWidth={2.5}
            fill="var(--color-primary)"
            fillOpacity={0.2}
            dot={false}
            activeDot={{ r: 5, stroke: "white", strokeWidth: 2 }}
          />
        </AreaChart>
      </ChartContainer>
    </MainCard>
  );
}
