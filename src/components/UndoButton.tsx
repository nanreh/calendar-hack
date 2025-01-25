
interface Props {
  undoHandler: () => void;
  disabled: boolean;
}

const UndoButton = ({ undoHandler, disabled }: Props) => {

  const onClick = () => {
    undoHandler();
  };
  return (
      <button className="app-button" onClick={onClick} disabled={disabled}> Undo </button>
  );
};

export default UndoButton;
