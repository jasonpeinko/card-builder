import React, { useEffect, useState } from "react";
import { Button, Dialog, Forms } from "../ui";

type ColorDialogProps = {
  modal: DataModalProps<Color>;
  onClose: () => void;
  onSave: (c: Color) => void;
};
export const ColorDialog: React.FC<ColorDialogProps> = ({
  children,
  modal,
  onClose,
  onSave
}) => {
  const [col, setColor] = useState("#ff0000");
  const [name, setName] = useState("");
  const color = modal.data as Color;
  useEffect(() => {
    if (color) {
      setName(color.name);
      setColor(color.hex);
    } else {
      setName("");
      setColor("#ff0000");
    }
  }, [color]);
  return (
    <Dialog.Dialog open={modal.isOpen}>
      <Dialog.Header>
        <h1>{color ? "Edit Color" : "Add Color"}</h1>
      </Dialog.Header>
      <Dialog.Body>
        <form>
          <Forms.Row>
            <Forms.TextInput onChange={setName} value={name} label="Name" />
          </Forms.Row>
          <Forms.Row>
            <Forms.ColorPicker
              color={col}
              onChange={color => {
                setColor(color);
              }}
              label="Color"
            />
          </Forms.Row>
        </form>
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          variant="solid"
          color="secondary"
          label="Cancel"
          onClick={onClose}
        />
        <Button
          variant="solid"
          color="primary"
          label="Save"
          onClick={() => {
            onSave({ name, hex: col, id: color && color.id });
          }}
        />
      </Dialog.Footer>
    </Dialog.Dialog>
  );
};

export default ColorDialog;
