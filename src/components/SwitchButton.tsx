interface SwitchButtonProps {
  value1: string;
  value2: string;
  activeValue: string;
  onChange: (value: string) => void;
}

const SwitchButton = ({
  value1,
  value2,
  activeValue,
  onChange,
}: SwitchButtonProps) => {
  const isFirstActive = activeValue === value1;


  return (
    <div className="relative inline-flex items-center gap-2 bg-primary/10 rounded-full p-1 w-full">
    
      <span
        className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-primary transition-all duration-300 ease-out
          ${isFirstActive ? "left-1" : "left-1/2"}
        `}
      />

      <button
        onClick={() => onChange(value1)}
        className={`relative z-10 px-4 py-2 w-full text-center text-sm font-medium rounded-full transition-colors
          ${isFirstActive ? "text-white" : "text-primary hover:text-primary/80"}
        `}
      >
        {value1}
      </button>

      <button
        onClick={() => onChange(value2)}
        className={`relative z-10 px-4 py-2 w-full text-center text-sm font-medium rounded-full transition-colors
          ${
            !isFirstActive ? "text-white" : "text-primary hover:text-primary/80"
          }
        `}
      >
        {value2}
      </button>
    </div>
  );
};

export default SwitchButton;
