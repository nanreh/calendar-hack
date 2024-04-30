import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WeekStartsOn, WeekStartsOnValues } from "@/ch/datecalc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function WeekStartsOnPicker({
  weekStartsOn,
  changeHandler,
  className,
}: {
  weekStartsOn: WeekStartsOn;
  changeHandler: (value: WeekStartsOn) => void;
  className?: string;
}) {
  // Convert number to string for SelectItem value
  const handleSelectChange = (value: string) => {
    const numericValue = parseInt(value, 10); // Convert back to number
    changeHandler(numericValue as WeekStartsOn);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Week start on</CardTitle>
        <CardDescription>
          Set day the week starts on, the plan will update accordingly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          onValueChange={handleSelectChange}
          value={weekStartsOn.toString()}
        >
          <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md shadow-sm">
            <SelectValue placeholder="Week Starts On">
              {getDayLabel(weekStartsOn)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg rounded-md p-1">
            <SelectGroup>
              {Object.entries(WeekStartsOnValues).map(([day, value]) => (
                <div key={day} className="flex items-center space-x-2">
                  <SelectItem value={value.toString()}>{day}</SelectItem>
                </div>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

// Utility to get label from value
function getDayLabel(value: WeekStartsOn) {
  return Object.keys(WeekStartsOnValues).find(
    (key) =>
      WeekStartsOnValues[key as keyof typeof WeekStartsOnValues] === value
  );
}
