import Image from "next/image";
import { site } from "@/content/site";

/** Selo "Quem responde é o Otávio": rosto humano sempre junto de um CTA. Não é depoimento. */
export function TrustChip({
  linha1,
  linha2,
  variant = "hero",
}: {
  linha1: string;
  linha2: string;
  variant?: "hero" | "menu";
}) {
  const menu = variant === "menu";
  return (
    <div className="flex items-center gap-3">
      <Image
        src={site.selo.avatar}
        alt=""
        width={40}
        height={40}
        sizes="40px"
        className={`h-10 w-10 flex-none rounded-full object-cover ${menu ? "" : "shadow-[0_0_0_1px_rgb(250_250_250/0.25)]"}`}
      />
      <span className={`leading-[1.4] ${menu ? "text-[15px] text-gray-400" : "text-[14px] text-gray-200"}`}>
        {linha1}
        <br />
        <span className="text-gray-400">{linha2}</span>
      </span>
    </div>
  );
}
