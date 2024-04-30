import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Units } from "@/defy/models";

interface Props {
  units: Units;
  unitsChangeHandler: (u: Units) => void;
}

const UnitsButtons: React.FC<Props & { className?: string }> = ({
  units,
  unitsChangeHandler,
  className,
}) => {
  const themeContext = useContext(ThemeContext);

  const handleChange = (value: Units) => {
    unitsChangeHandler(value);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Distance Unit Selection</CardTitle>
        <CardDescription>
          Choose your preferred unit of measurement for distance. Select either
          kilometers or miles to best suit your needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          defaultValue={units}
          onValueChange={handleChange}
          className="flex flex-row space-x-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="km" id="radio-km" />
            <Label htmlFor="radio-km" className="text-current">
              Km
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mi" id="radio-mi" />
            <Label htmlFor="radio-mi" className="text-current">
              Mile
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default UnitsButtons;
