// import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent } from "../ui/card";
import { useAnalytics } from "@/hooks/useAnalytics";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ProductChart({ productId }: { productId: string }) {
  const { productSales, isProductSalesLoading } = useAnalytics();

  const chartData = productSales
    .filter((product) => product.productId === productId)
    .map((product) => ({
      month: product.month,
      sales: product.totalSold,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  if (isProductSalesLoading) return <p>جاري التحميل...</p>;

  return (
    <Card className="py-6">
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 10,
              right: 10,
              top: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              interval={0}
              tickFormatter={(value) => value.slice(5)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="sales"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
