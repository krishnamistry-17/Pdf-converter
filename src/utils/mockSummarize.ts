import { executivePoints, keyPoints } from "../constance/Text";

const mockSummarize = async (text: string, type: string) => {
  console.log("text", text);
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(
        type === "executive" ? executivePoints.join("\n") : keyPoints.join("\n")
      );
    }, 2000);
  });
};

export default mockSummarize;
