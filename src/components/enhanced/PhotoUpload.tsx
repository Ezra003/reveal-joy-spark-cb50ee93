import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  onUpload: (file: File, preview: string) => void;
  maxSize?: number; // in MB
  accept?: string;
}

export const PhotoUpload = ({
  onUpload,
  maxSize = 5,
  accept = 'image/jpeg,image/png,image/webp'
}: PhotoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `Maximum file size is ${maxSize}MB`,
        variant: 'destructive'
      });
      return;
    }

    // Validate file type
    if (!accept.split(',').some(type => file.type.includes(type.split('/')[1]))) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a valid image file',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onUpload(file, result);
      setIsUploading(false);
      
      toast({
        title: 'Photo uploaded!',
        description: 'Your photo has been added successfully'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300",
            isDragging
              ? "border-primary bg-primary/10 scale-105"
              : "border-border hover:border-primary/50 hover:bg-accent/5",
            isUploading && "opacity-50 cursor-wait"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          
          <Upload className={cn(
            "w-16 h-16 mx-auto mb-4 transition-transform",
            isDragging && "scale-125",
            "text-muted-foreground"
          )} />
          
          <p className="font-display font-bold text-lg mb-2">
            {isDragging ? 'Drop your photo here' : 'Upload a Photo'}
          </p>
          <p className="text-sm text-muted-foreground">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Maximum {maxSize}MB • JPG, PNG, WebP
          </p>
        </div>
      ) : (
        <div className="relative group rounded-2xl overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
              size="sm"
              className="rounded-xl"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Change
            </Button>
            <Button
              onClick={() => {
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              variant="destructive"
              size="sm"
              className="rounded-xl"
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
          <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
            <Check className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
};


