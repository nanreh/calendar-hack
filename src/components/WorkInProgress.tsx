import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TriangleAlert } from "lucide-react";

interface WorkInProgressProps {
  className?: string;
}

export default function WorkInProgress({ className }: WorkInProgressProps) {
  return (
    <Card className={`mx-auto ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TriangleAlert className="h-5 w-5 text-red-500" />
          <CardTitle>Work in Progress</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This website is currently under development and not yet complete.
          Please check back soon for updates.
        </p>
      </CardContent>
    </Card>
  );
}
