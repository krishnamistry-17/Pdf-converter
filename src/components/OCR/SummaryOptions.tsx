
import useExtractPdfStore from "../../store/useExtractPdf";

const SummaryOptions = () => {
  const { setSummaryStatus, setSummaryType } = useExtractPdfStore();

  return (
    <div className=" flex items-center justify-center my-3">
      <div className="bg-blue/10 rounded-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4 text-blue">
          Choose summary type:
        </h3>

        <button
          className="w-full border border-blue rounded-md  p-3  mb-2 text-blue "
          onClick={() => {
            setSummaryType("keypoints");
            setSummaryStatus("loading");
          }}
        >
          Key Points
        </button>

        <button
          className="w-full border border-blue rounded-md  p-3  mb-2 text-blue "
          onClick={() => {
            setSummaryType("executive");
            setSummaryStatus("loading");
          }}
        >
          Executive Summary
        </button>
      </div>
    </div>
  );
};
export default SummaryOptions;
