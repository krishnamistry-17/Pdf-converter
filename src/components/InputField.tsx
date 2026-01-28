interface InputFieldProps {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  label: string;
}

const InputField = ({
  handleFileUpload,
  accept = ".csv,.xlsx,.xls,.json,.pdf,.jpg,.jpeg,.png,.ppt,application/pdf,.doc,.docx",
  label,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className=" relative w-full flex flex-col items-center justify-center">
        <label
          className="w-full max-w-sm sm:mx-0 mx-auto cursor-pointer flex flex-col
         bg-gray-50 border border-gray-300 rounded-lg p-3 text-center hover:bg-gray-100 transition"
        >
          <span className="text-gray-600">{label}</span>
          <input
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default InputField;
