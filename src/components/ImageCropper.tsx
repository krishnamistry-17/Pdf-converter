import { useRef, useState } from "react";
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type Props = {
  src: string;
  onCropComplete: (image: string) => void;
  setShowCropImage: (show: boolean) => void;
};

const ImageCropper = ({ src, onCropComplete, setShowCropImage }: Props) => {
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, _setAspect] = useState<number | undefined>(undefined);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;

    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 80,
        },
        aspect || 16 / 9,
        naturalWidth,
        naturalHeight
      ),
      naturalWidth,
      naturalHeight
    );

    setCrop(initialCrop);
  };

  const generateCroppedImage = () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = imgRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );


    const base64Image = canvas.toDataURL("image/png");
    onCropComplete(base64Image);
    setShowCropImage(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <ReactCrop
        crop={crop}
        aspect={aspect}
        keepSelection
        onChange={(c: Crop) => setCrop(c)}
        onComplete={(c: PixelCrop) => setCompletedCrop(c)}
      >
        <img ref={imgRef} src={src} onLoad={onImageLoad} />
      </ReactCrop>

      <button
        onClick={generateCroppedImage}
        className="bg-primary text-white py-2 rounded"
      >
        Apply Crop
      </button>
    </div>
  );
};

export default ImageCropper;
