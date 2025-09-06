import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAnalytics } from "@/hooks/useAnalytics";

export const description = "An area chart with a legend";

const chartConfig = {
  sales: {
    label: "عدد المبيعات",
    color: "var(--chart-1)",
  },
  amount: {
    label: "إجمالي الإيرادات",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function YearlyChart() {
  const { monthlySales, isMonthlySalesLoading } = useAnalytics();

  const chartData = monthlySales.map((monthlySale) => ({
    month: monthlySale.month,
    sales: monthlySale.totalSold,
    amount: monthlySale.totalAmount,
  }));

  if (isMonthlySalesLoading) return <p>جاري التحميل...</p>;

  return (
    <Card className="p-3 sm:p-6 overflow-hidden">
      <CardHeader>
        <CardTitle>مخطط بياني</CardTitle>
        <CardDescription>
          يريك إجمالي المبيعات والإيرادات لكل شهر على مدار العام
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="my-7 w-[180px] h-80 sm:w-full sm:h-full"
          config={chartConfig}
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 17,
              right: 17,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              interval={0}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              yAxisId="right"
              dataKey="amount"
              type="natural"
              fill="#1d65d2"
              fillOpacity={0.4}
              stroke="#1d65d2"
              stackId="a"
            />
            <Area
              yAxisId="left"
              dataKey="sales"
              type="natural"
              fill="blue"
              fillOpacity={0.3}
              stroke="blue"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
