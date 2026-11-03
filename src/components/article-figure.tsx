type ArticleFigureProps = {
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
};

export function ArticleFigure({
  src,
  alt,
  caption,
  width = 960,
  height = 640,
}: ArticleFigureProps) {
  return (
    <figure className="my-8">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="border-border h-auto w-full rounded-xl border"
      />
      <figcaption className="text-muted-foreground mt-3 text-sm leading-6">
        {caption}
      </figcaption>
    </figure>
  );
}
