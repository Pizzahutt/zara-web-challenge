import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="relative w-full aspect-[510/630] md:w-[510px] md:h-[630px] shrink-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 510px"
        className="object-contain"
        priority
      />
    </div>
  );
}
