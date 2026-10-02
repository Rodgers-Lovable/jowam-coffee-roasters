import { siteInfo } from "@/data/site";

// Keyless Google Maps embed: no API key, so it works on localhost and any domain.
const MAP_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(siteInfo.mapsQuery)}&z=16&output=embed`;

export function LocationMap({ className = "aspect-[4/3] w-full" }: { className?: string }) {
  return (
    <div className={`overflow-hidden bg-muted ${className}`}>
      <iframe
        title="Map showing Jowam Coffee Roasters at Lavington Mall, James Gichuru Road"
        src={MAP_SRC}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}
