import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  downloadHandler: () => void;
  className?: string;
}

const DownloadButton: React.FC<Props> = ({ downloadHandler, className }) => {
  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    downloadHandler();
  };
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Download</CardTitle>
        <CardDescription>Download training plan</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onClick}>Download iCal</Button>
      </CardContent>
    </Card>
  );
};

export default DownloadButton;
