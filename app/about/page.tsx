export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">About UNISAVE</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        UNISAVE is a universal media toolkit for analyzing and saving publicly accessible media
        from supported platforms through one premium interface. We focus on speed, clarity, and
        responsible use — without bypassing DRM, authentication, or private content restrictions.
      </p>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        The platform is built with a modular adapter architecture so new services can be added
        safely and independently over time.
      </p>
    </div>
  );
}

