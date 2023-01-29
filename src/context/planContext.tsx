import { createContext } from "react";
import { RacePlan } from "../ch/models";

export const RacePlanContext = createContext<{
  racePlan: RacePlan;
  setRacePlan: (rp: RacePlan) => void;
  isEditing: boolean;
} | null>(null);
