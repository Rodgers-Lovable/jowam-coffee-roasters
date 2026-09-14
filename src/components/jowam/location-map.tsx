import { PLACE_ID } from "@/lib/place.functions";

export function LocationMap({ className = "aspect-[4/3] w-full" }: { className?: string }) {
  const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"] as string | undefined;
  if (!key) return null;
  const src = `https://www.google.com/maps/embed/v1/place?key=${key}&q=place_id:${PLACE_ID}&zoom=16`;
  return (
    <div className={`overflow-hidden bg-muted ${className}`}>
      <iframe
        title="Map showing Jowam Coffee Roasters at Lavington Mall, James Gichuru Road"
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}
