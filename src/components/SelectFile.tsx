interface SelectFileProps {
  heading: string;
  description: string;
}

const SelectFile = ({ heading, description }: SelectFileProps) => {
  return (
    <div>
      <div className="text-center mb-10">
        <h1
          className="text-3xl sm:text-4xl font-semibold
           text-text-heading leading-tight tracking-tight  mb-3"
        > 
          {heading}
        </h1>
        <p
          className="text-text-body max-w-2xl mx-auto text-sm
          font-medium text-center
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default SelectFile;
