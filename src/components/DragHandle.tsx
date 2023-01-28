import React from "react";
import styled from "styled-components";

interface Props {
  viewBox?: string;
}

const DragHandleSvg = styled.svg`
  fill: gray;
  cursor: grab;
`;

export const DragHandle: React.FC<Props> = ({ viewBox = "0 0 32 52" }) => {
  return (
    <DragHandleSvg viewBox={viewBox}>
      <rect height="4" width="4" y="4" x="0" />
      <rect height="4" width="4" y="12" x="0" />
      <rect height="4" width="4" y="20" x="0" />
      <rect height="4" width="4" y="28" x="0" />
      <rect height="4" width="4" y="36" x="0" />
      <rect height="4" width="4" y="44" x="0" />
      <rect height="4" width="4" y="52" x="0" />

      <rect height="4" width="4" y="4" x="8" />
      <rect height="4" width="4" y="12" x="8" />
      <rect height="4" width="4" y="20" x="8" />
      <rect height="4" width="4" y="28" x="8" />
      <rect height="4" width="4" y="36" x="8" />
      <rect height="4" width="4" y="44" x="8" />
      <rect height="4" width="4" y="52" x="8" />

      <rect height="4" width="4" y="4" x="16" />
      <rect height="4" width="4" y="12" x="16" />
      <rect height="4" width="4" y="20" x="16" />
      <rect height="4" width="4" y="28" x="16" />
      <rect height="4" width="4" y="36" x="16" />
      <rect height="4" width="4" y="44" x="16" />
      <rect height="4" width="4" y="52" x="16" />

      <rect height="4" width="4" y="4" x="24" />
      <rect height="4" width="4" y="12" x="24" />
      <rect height="4" width="4" y="20" x="24" />
      <rect height="4" width="4" y="28" x="24" />
      <rect height="4" width="4" y="36" x="24" />
      <rect height="4" width="4" y="44" x="24" />
      <rect height="4" width="4" y="52" x="24" />

      <rect height="4" width="4" y="4" x="32" />
      <rect height="4" width="4" y="12" x="32" />
      <rect height="4" width="4" y="20" x="32" />
      <rect height="4" width="4" y="28" x="32" />
      <rect height="4" width="4" y="36" x="32" />
      <rect height="4" width="4" y="44" x="32" />
      <rect height="4" width="4" y="52" x="32" />
    </DragHandleSvg>
  );
};
