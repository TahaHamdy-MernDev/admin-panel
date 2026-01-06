"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import MainCard from "../cards/main-card";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useLocaleDirection } from "@/hooks/use-locale-direction";

type Props = {
  t_key: string;
  label: string;
  label_one: string;
  label_two: string;
  data_key: string;
  data: unknown[];
};
function ChartMultipleBar({
  t_key,
  label,
  label_one,
  label_two,
  data_key,
  data,
}: Props) {
  const t = useTranslations(t_key);
  const { is_rtl } = useLocaleDirection();
  const chartConfig = {
    desktop: {
      label: label_one,
      color: "var(--chart-1)",
    },
    mobile: {
      label: label_two,
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <MainCard title={t(label)} classes={{ content: "px-2" }}>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[260px] w-full"
      >
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={data_key}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => String(value).slice(0, 4)}
          />
          <YAxis
            width={30}
            tickLine={false}
            axisLine={true}
            direction={"ltr"}
            fill="var(--chart-axis-tick)"
            tick={{ color: "#fff" }}
            orientation={is_rtl ? "right" : "left"}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey={label_one} fill="var(--color-desktop)" radius={4} />
          <Bar dataKey={label_two} fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </MainCard>
  );
}

export default ChartMultipleBar;
