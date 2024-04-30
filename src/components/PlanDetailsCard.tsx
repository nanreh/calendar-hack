import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RacePlan } from "@/ch/models";

interface PlanDetailsCardProps {
  racePlan?: RacePlan | undefined;
  planName?: string;
  className?: string;
}

export function PlanDetailsCard({
  racePlan,
  planName,
  className,
}: PlanDetailsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex justify-between items-start">
        <CardTitle>{planName}</CardTitle>
        {racePlan?.sourceUrl && (
          <div className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-300">
            <a
              href={racePlan?.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkIcon className="h-5 w-5" />
            </a>
          </div>
        )}
      </CardHeader>
      <CardContent>{racePlan?.description || "No Plan Selected"}</CardContent>
    </Card>
  );
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
