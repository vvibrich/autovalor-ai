import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
    urls: string[];
    onRemove?: (index: number) => void;
}

export function ImagePreview({ urls, onRemove }: ImagePreviewProps) {
    if (urls.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {urls.map((url, index) => (
                <div key={index} className="relative group aspect-video rounded-md overflow-hidden border">
                    <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                    />
                    {onRemove && (
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onRemove(index)}
                            type="button"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
}
