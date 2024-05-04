import { BarChart } from "@tremor/react";
import { RacePlan } from "@/ch/models";
import { Units } from "@/defy/models";
import { calcWeeklyDistance } from "@/lib/calculateDistance";
import { renderDist } from "@/ch/rendering";

interface PlanDistanceBarChartProps {
  racePlan: RacePlan;
  units: Units;
}

export const PlanDistanceBarChart: React.FC<PlanDistanceBarChartProps> = ({
  racePlan,
  units,
}) => {
  const chartData = racePlan.dateGrid.weeks.map((week, index) => {
    const distanceInMiles = calcWeeklyDistance(week);
    const distanceWithUnit = renderDist(distanceInMiles, "mi", units);
    const distanceInCorrectUnit = parseFloat(distanceWithUnit.split(" ")[0]);
    return {
      name: `Week ${index + 1}`,
      distance: distanceInCorrectUnit,
    };
  });

  return (
    <BarChart
      data={chartData}
      index="name"
      categories={["distance"]}
      colors={["blue"]}
      yAxisWidth={48}
    />
  );
};
