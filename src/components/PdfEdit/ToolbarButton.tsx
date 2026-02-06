interface ToolButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const ToolButton = ({ icon, active, onClick }: ToolButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition
          ${
            active
              ? "bg-primary/10 text-primary"
              : "text-text-muted hover:bg-bg-muted hover:text-text-body"
          }
        `}
    >
      {icon}
    </button>
  );
};

export default ToolButton;
