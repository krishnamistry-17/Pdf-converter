interface SelectFileProps {
  heading: string;
  description: string;
}

const SelectFile = ({ heading, description }: SelectFileProps) => {
  return (
    <div>
      <div className="flex flex-col items-center gap-2 py-8">
        <h3 className="text-3xl font-bold tracking-tight text-blue text-center">
          {heading}
        </h3>
        <p className="text-lg text-teal text-center font-semibold">
          {description}
        </p>
      </div>
    </div>
  );
};

export default SelectFile;
