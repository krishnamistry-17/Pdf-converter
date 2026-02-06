import { useRef, useEffect } from "react";

interface Props {
  element: {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
  };
  updateText: (
    id: string,
    text: string,
    x: number,
    y: number,
    fontSize: number
  ) => void;
}

const EditableText = ({ element, updateText }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      contentEditable
      className="absolute max-w-[40px] h-[20px] px-4 cursor-text  border border-blue-500"
      style={{
        left: element.x,
        top: element.y,
        fontSize: element.fontSize,
      }}
      onInput={(e) =>
        updateText(
          element.id,
          e.currentTarget.innerText,
          element.x,
          element.y,
          element.fontSize
        )
      }
    >
      {element.text}
    </div>
  );
};

export default EditableText;
