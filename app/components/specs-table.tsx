const MATERIAL_LABELS: Record<string, string> = {
  STAINLESS_STEEL: "Acero inoxidable",
  YELLOW_GOLD: "Oro amarillo",
  WHITE_GOLD: "Oro blanco",
  ROSE_GOLD: "Oro rosa",
  TITANIUM: "Titanio",
  CERAMIC: "Cerámica",
  PLATINUM: "Platino",
  BRONZE: "Bronce",
  CARBON: "Fibra de carbono",
  OTHER: "Otro",
};

const MOVEMENT_LABELS: Record<string, string> = {
  AUTOMATIC: "Automático",
  MANUAL: "Manual",
  QUARTZ: "Cuarzo",
  SOLAR: "Solar",
  SPRING_DRIVE: "Spring Drive",
};

const CRYSTAL_LABELS: Record<string, string> = {
  SAPPHIRE: "Zafiro",
  MINERAL: "Mineral",
  ACRYLIC: "Acrílico",
  HESALITE: "Hesalite",
};

type Watch = {
  caseDiameterMm: number | null;
  caseThicknessMm: number | null;
  lugToLugMm: number | null;
  caseMaterial: string | null;
  crystal: string | null;
  dialColor: string | null;
  dialMaterial: string | null;
  braceletMaterial: string | null;
  lugWidthMm: number | null;
  waterResistance: number | null;
  waterResistanceUnit: string | null;
  retailPriceEur: number | null;
  complicationTags: string[];
};

type Movement = {
  caliber: string;
  manufacturer: string | null;
  type: string;
  jewels: number | null;
  frequencyHz: number | null;
  powerReserveH: number | null;
  cosc: boolean;
  inHouse: boolean;
} | null;

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <tr className="border-b border-[var(--border)] last:border-0">
      <td className="py-2 pr-4 text-xs uppercase tracking-wide text-[var(--muted-foreground)] w-36 align-top">
        {label}
      </td>
      <td className="py-2 text-sm text-[var(--foreground)]">{value}</td>
    </tr>
  );
}

export function SpecsTable({ watch, movement }: { watch: Watch; movement: Movement }) {
  return (
    <div className="space-y-6">
      {/* Caja */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
          Caja
        </h3>
        <table className="w-full">
          <tbody>
            <Row
              label="Diámetro"
              value={watch.caseDiameterMm ? `${watch.caseDiameterMm} mm` : null}
            />
            <Row
              label="Grosor"
              value={watch.caseThicknessMm ? `${watch.caseThicknessMm} mm` : null}
            />
            <Row
              label="Lug to lug"
              value={watch.lugToLugMm ? `${watch.lugToLugMm} mm` : null}
            />
            <Row
              label="Material"
              value={
                watch.caseMaterial ? MATERIAL_LABELS[watch.caseMaterial] ?? watch.caseMaterial : null
              }
            />
            <Row
              label="Cristal"
              value={watch.crystal ? CRYSTAL_LABELS[watch.crystal] ?? watch.crystal : null}
            />
            <Row
              label="Agua"
              value={
                watch.waterResistance
                  ? `${watch.waterResistance} ${watch.waterResistanceUnit === "METERS" ? "m" : watch.waterResistanceUnit?.toLowerCase() ?? ""}`
                  : null
              }
            />
          </tbody>
        </table>
      </div>

      {/* Esfera */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
          Esfera
        </h3>
        <table className="w-full">
          <tbody>
            <Row label="Color" value={watch.dialColor} />
            <Row label="Material" value={watch.dialMaterial} />
          </tbody>
        </table>
      </div>

      {/* Correa */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
          Correa / Brazalete
        </h3>
        <table className="w-full">
          <tbody>
            <Row label="Material" value={watch.braceletMaterial} />
            <Row
              label="Anclaje"
              value={watch.lugWidthMm ? `${watch.lugWidthMm} mm` : null}
            />
          </tbody>
        </table>
      </div>

      {/* Calibre */}
      {movement && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
            Calibre
          </h3>
          <table className="w-full">
            <tbody>
              <Row label="Calibre" value={movement.caliber} />
              <Row label="Fabricante" value={movement.manufacturer} />
              <Row
                label="Tipo"
                value={MOVEMENT_LABELS[movement.type] ?? movement.type}
              />
              <Row label="Rubíes" value={movement.jewels ? String(movement.jewels) : null} />
              <Row
                label="Frecuencia"
                value={
                  movement.frequencyHz
                    ? `${movement.frequencyHz} Hz (${Math.round(movement.frequencyHz * 7200)} A/h)`
                    : null
                }
              />
              <Row
                label="Reserva"
                value={movement.powerReserveH ? `${movement.powerReserveH} h` : null}
              />
              {movement.cosc && <Row label="Certificación" value="COSC" />}
              {movement.inHouse && <Row label="In-house" value="Sí" />}
            </tbody>
          </table>
        </div>
      )}

      {/* Complicaciones */}
      {watch.complicationTags.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
            Complicaciones
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {watch.complicationTags.map((tag) => (
              <span
                key={tag}
                className="border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
