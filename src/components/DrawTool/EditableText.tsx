const EditableText = ({ element, updateText, imgHeight }: any) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${element.xRatio * 100}%`,
        top: `${element.yRatio * 100}%`,
        transform: "scaleX(-1)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        value={element.text}
        placeholder="Type here"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) =>
          updateText(
            element.id,
            e.target.value,
            element.xRatio,
            element.yRatio,
            element.fontSize
          )
        }
        className="
          min-w-[40px]
          px-1 py-0.5
          bg-transparent
          border border-dashed border-blue-400
          rounded
          focus:outline-none
          focus:bg-white/80
        "
        style={{
          fontSize: `${element.fontSizeRatio * imgHeight}px`,  // use imgHeight to scale the font size
          transform: "scaleX(-1)",
          direction: "ltr",
        }}
      />
    </div>
  );
};

export default EditableText;
