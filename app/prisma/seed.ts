import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function watchSlug(brand: string, commercial: string | null, ref: string) {
  const parts = [slugify(brand), commercial ? slugify(commercial) : null, slugify(ref)];
  return parts.filter(Boolean).join("-");
}

const brands = [
  { name: "Rolex", country: "Suiza", foundedYear: 1905, websiteUrl: "https://www.rolex.com" },
  { name: "Omega", country: "Suiza", foundedYear: 1848, websiteUrl: "https://www.omegawatches.com" },
  { name: "Patek Philippe", country: "Suiza", foundedYear: 1839, websiteUrl: "https://www.patek.com" },
  { name: "Audemars Piguet", country: "Suiza", foundedYear: 1875, websiteUrl: "https://www.audemarspiguet.com" },
  { name: "IWC Schaffhausen", country: "Suiza", foundedYear: 1868, websiteUrl: "https://www.iwc.com" },
  { name: "Jaeger-LeCoultre", country: "Suiza", foundedYear: 1833, websiteUrl: "https://www.jaeger-lecoultre.com" },
  { name: "Cartier", country: "Francia", foundedYear: 1847, websiteUrl: "https://www.cartier.com" },
  { name: "Panerai", country: "Italia", foundedYear: 1860, websiteUrl: "https://www.panerai.com" },
  { name: "TAG Heuer", country: "Suiza", foundedYear: 1860, websiteUrl: "https://www.tagheuer.com" },
  { name: "Breitling", country: "Suiza", foundedYear: 1884, websiteUrl: "https://www.breitling.com" },
  { name: "Tudor", country: "Suiza", foundedYear: 1926, websiteUrl: "https://www.tudorwatch.com" },
  { name: "Longines", country: "Suiza", foundedYear: 1832, websiteUrl: "https://www.longines.com" },
  { name: "Grand Seiko", country: "Japón", foundedYear: 1960, websiteUrl: "https://www.grand-seiko.com" },
  { name: "Seiko", country: "Japón", foundedYear: 1881, websiteUrl: "https://www.seiko.com" },
  { name: "Vacheron Constantin", country: "Suiza", foundedYear: 1755, websiteUrl: "https://www.vacheron-constantin.com" },
  { name: "A. Lange & Söhne", country: "Alemania", foundedYear: 1845, websiteUrl: "https://www.alange-soehne.com" },
  { name: "Nomos Glashütte", country: "Alemania", foundedYear: 1990, websiteUrl: "https://www.nomos-glashuette.com" },
  { name: "Zenith", country: "Suiza", foundedYear: 1865, websiteUrl: "https://www.zenith-watches.com" },
  { name: "Hublot", country: "Suiza", foundedYear: 1980, websiteUrl: "https://www.hublot.com" },
  { name: "Chopard", country: "Suiza", foundedYear: 1860, websiteUrl: "https://www.chopard.com" },
];

const movements = [
  { caliber: "3135", manufacturer: "Rolex", type: "AUTOMATIC", jewels: 31, frequencyHz: 4, powerReserveH: 48, cosc: false, inHouse: true },
  { caliber: "3235", manufacturer: "Rolex", type: "AUTOMATIC", jewels: 31, frequencyHz: 4, powerReserveH: 70, cosc: false, inHouse: true },
  { caliber: "3255", manufacturer: "Rolex", type: "AUTOMATIC", jewels: 31, frequencyHz: 4, powerReserveH: 70, cosc: false, inHouse: true },
  { caliber: "8900", manufacturer: "Omega", type: "AUTOMATIC", jewels: 35, frequencyHz: 4, powerReserveH: 60, cosc: true, inHouse: true },
  { caliber: "8800", manufacturer: "Omega", type: "AUTOMATIC", jewels: 35, frequencyHz: 4, powerReserveH: 55, cosc: true, inHouse: true },
  { caliber: "3861", manufacturer: "Omega", type: "MANUAL", jewels: 33, frequencyHz: 4, powerReserveH: 60, cosc: true, inHouse: true },
  { caliber: "324 SC", manufacturer: "Patek Philippe", type: "AUTOMATIC", jewels: 29, frequencyHz: 4, powerReserveH: 45, cosc: false, inHouse: true },
  { caliber: "3120", manufacturer: "Audemars Piguet", type: "AUTOMATIC", jewels: 40, frequencyHz: 3, powerReserveH: 60, cosc: false, inHouse: true },
  { caliber: "52010", manufacturer: "IWC", type: "AUTOMATIC", jewels: 37, frequencyHz: 4, powerReserveH: 120, cosc: false, inHouse: true },
  { caliber: "El Primero 3600", manufacturer: "Zenith", type: "AUTOMATIC", jewels: 31, frequencyHz: 5, powerReserveH: 50, cosc: false, inHouse: true },
  { caliber: "ETA 2824-2", manufacturer: "ETA", type: "AUTOMATIC", jewels: 25, frequencyHz: 4, powerReserveH: 38, cosc: false, inHouse: false },
  { caliber: "9SA5", manufacturer: "Grand Seiko", type: "AUTOMATIC", jewels: 36, frequencyHz: 5, powerReserveH: 80, cosc: false, inHouse: true },
  { caliber: "DUW 3001", manufacturer: "Nomos Glashütte", type: "AUTOMATIC", jewels: 17, frequencyHz: 4, powerReserveH: 42, cosc: false, inHouse: true },
  { caliber: "MT5602", manufacturer: "Tudor", type: "AUTOMATIC", jewels: 26, frequencyHz: 4, powerReserveH: 70, cosc: false, inHouse: true },
  { caliber: "B01", manufacturer: "Breitling", type: "AUTOMATIC", jewels: 47, frequencyHz: 4, powerReserveH: 70, cosc: true, inHouse: true },
  { caliber: "Heuer 02", manufacturer: "TAG Heuer", type: "AUTOMATIC", jewels: 33, frequencyHz: 4, powerReserveH: 80, cosc: false, inHouse: true },
];

const watchData = [
  // ROLEX
  { brand: "Rolex", commercial: "Submariner", ref: "126610LN", movement: "3235", year: 2020, diameter: 41, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 300, tags: ["Buzo"] },
  { brand: "Rolex", commercial: "Submariner", ref: "126610LV", movement: "3235", year: 2020, diameter: 41, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 300, tags: ["Buzo"] },
  { brand: "Rolex", commercial: "Submariner Date", ref: "116613LB", movement: "3135", year: 2009, diameter: 40, material: "YELLOW_GOLD", crystal: "SAPPHIRE", dial: "Azul", water: 300, tags: ["Buzo"] },
  { brand: "Rolex", commercial: "Datejust 41", ref: "126300", movement: "3235", year: 2016, diameter: 41, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Plateado", water: 100, tags: [] },
  { brand: "Rolex", commercial: "Datejust 36", ref: "126200", movement: "3235", year: 2020, diameter: 36, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Blanco", water: 100, tags: [] },
  { brand: "Rolex", commercial: "Day-Date 40", ref: "228238", movement: "3255", year: 2015, diameter: 40, material: "YELLOW_GOLD", crystal: "SAPPHIRE", dial: "Champán", water: 100, tags: [] },
  { brand: "Rolex", commercial: "GMT-Master II", ref: "126710BLRO", movement: "3235", year: 2018, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 100, tags: ["GMT"] },
  { brand: "Rolex", commercial: "GMT-Master II", ref: "126710BLNR", movement: "3235", year: 2013, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 100, tags: ["GMT"] },
  { brand: "Rolex", commercial: "Explorer I", ref: "224270", movement: "3235", year: 2021, diameter: 36, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 100, tags: [] },
  { brand: "Rolex", commercial: "Explorer II", ref: "226570", movement: "3235", year: 2021, diameter: 42, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Blanco", water: 100, tags: ["GMT"] },
  { brand: "Rolex", commercial: "Sea-Dweller", ref: "126600", movement: "3235", year: 2017, diameter: 43, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 1220, tags: ["Buzo"] },
  { brand: "Rolex", commercial: "Daytona", ref: "116500LN", movement: "3235", year: 2016, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 100, tags: ["Cronógrafo"] },
  { brand: "Rolex", commercial: "Milgauss", ref: "116400GV", movement: "3235", year: 2007, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 100, tags: ["Antimagnetismo"] },
  { brand: "Rolex", commercial: "Air-King", ref: "126900", movement: "3235", year: 2022, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 100, tags: [] },
  // OMEGA
  { brand: "Omega", commercial: "Seamaster Diver 300M", ref: "210.30.42.20.01.001", movement: "8800", year: 2018, diameter: 42, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 300, tags: ["Buzo"] },
  { brand: "Omega", commercial: "Speedmaster Moonwatch", ref: "310.30.42.50.01.001", movement: "3861", year: 2021, diameter: 42, material: "STAINLESS_STEEL", crystal: "HESALITE", dial: "Negro", water: 30, tags: ["Cronógrafo", "Espacio"] },
  { brand: "Omega", commercial: "Seamaster Planet Ocean", ref: "215.30.44.21.01.001", movement: "8900", year: 2015, diameter: 43, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 600, tags: ["Buzo"] },
  { brand: "Omega", commercial: "De Ville Tresor", ref: "428.53.40.21.04.001", movement: "8900", year: 2017, diameter: 40, material: "YELLOW_GOLD", crystal: "SAPPHIRE", dial: "Plateado", water: 30, tags: [] },
  // PATEK PHILIPPE
  { brand: "Patek Philippe", commercial: "Nautilus", ref: "5711/1A-010", movement: "324 SC", year: 2006, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 120, tags: [] },
  { brand: "Patek Philippe", commercial: "Aquanaut", ref: "5167A-001", movement: "324 SC", year: 2007, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 120, tags: [] },
  { brand: "Patek Philippe", commercial: "Calatrava", ref: "5127G-001", movement: "324 SC", year: 2003, diameter: 38, material: "WHITE_GOLD", crystal: "SAPPHIRE", dial: "Blanco", water: 30, tags: [] },
  { brand: "Patek Philippe", commercial: "Grand Complications", ref: "5270G-018", movement: "324 SC", year: 2016, diameter: 41, material: "WHITE_GOLD", crystal: "SAPPHIRE", dial: "Blanco", water: 30, tags: ["Perpetuo", "Cronógrafo"] },
  // AUDEMARS PIGUET
  { brand: "Audemars Piguet", commercial: "Royal Oak", ref: "15500ST.OO.1220ST.01", movement: "3120", year: 2022, diameter: 41, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 50, tags: [] },
  { brand: "Audemars Piguet", commercial: "Royal Oak", ref: "15202ST.OO.1240ST.01", movement: "3120", year: 2021, diameter: 39, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 50, tags: [] },
  { brand: "Audemars Piguet", commercial: "Royal Oak Offshore", ref: "26400SO.OO.A002CA.01", movement: "3120", year: 2012, diameter: 44, material: "TITANIUM", crystal: "SAPPHIRE", dial: "Negro", water: 100, tags: ["Cronógrafo"] },
  // IWC
  { brand: "IWC Schaffhausen", commercial: "Portugieser Automatic", ref: "IW500705", movement: "52010", year: 2015, diameter: 42, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Blanco", water: 30, tags: [] },
  { brand: "IWC Schaffhausen", commercial: "Pilot's Watch Mark XX", ref: "IW328201", movement: "52010", year: 2022, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 100, tags: ["Pilot"] },
  { brand: "IWC Schaffhausen", commercial: "Big Pilot's Watch", ref: "IW501001", movement: "52010", year: 2019, diameter: 46, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 60, tags: ["Pilot"] },
  // JAEGER-LECOULTRE
  { brand: "Jaeger-LeCoultre", commercial: "Reverso Classic", ref: "Q3858522", movement: "ETA 2824-2", year: 2019, diameter: 45, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Blanco", water: 30, tags: ["Art Deco"] },
  { brand: "Jaeger-LeCoultre", commercial: "Master Ultra Thin Moon", ref: "Q1368470", movement: "ETA 2824-2", year: 2016, diameter: 39, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 50, tags: ["Fase de luna"] },
  // CARTIER
  { brand: "Cartier", commercial: "Santos de Cartier", ref: "WSSA0009", movement: "ETA 2824-2", year: 2019, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Plateado", water: 100, tags: [] },
  { brand: "Cartier", commercial: "Tank Louis Cartier", ref: "WGTA0023", movement: "ETA 2824-2", year: 2017, diameter: 34, material: "YELLOW_GOLD", crystal: "SAPPHIRE", dial: "Blanco", water: 30, tags: ["Art Deco"] },
  { brand: "Cartier", commercial: "Ballon Bleu", ref: "WSBB0030", movement: "ETA 2824-2", year: 2022, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 30, tags: [] },
  // PANERAI
  { brand: "Panerai", commercial: "Luminor Marina", ref: "PAM00351", movement: "ETA 2824-2", year: 2012, diameter: 44, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 300, tags: ["Buzo"] },
  { brand: "Panerai", commercial: "Luminor Due", ref: "PAM00927", movement: "ETA 2824-2", year: 2019, diameter: 42, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 30, tags: [] },
  { brand: "Panerai", commercial: "Radiomir", ref: "PAM00292", movement: "ETA 2824-2", year: 2014, diameter: 45, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 100, tags: [] },
  // TAG HEUER
  { brand: "TAG Heuer", commercial: "Carrera", ref: "CBN201A.FC6492", movement: "Heuer 02", year: 2019, diameter: 44, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 100, tags: ["Cronógrafo"] },
  { brand: "TAG Heuer", commercial: "Monaco", ref: "CAW211P.FC6356", movement: "Heuer 02", year: 2018, diameter: 39, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 100, tags: ["Cronógrafo"] },
  { brand: "TAG Heuer", commercial: "Aquaracer", ref: "WBP201A.FT6197", movement: "ETA 2824-2", year: 2021, diameter: 43, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 300, tags: ["Buzo"] },
  // BREITLING
  { brand: "Breitling", commercial: "Navitimer", ref: "AB0139211G1P1", movement: "B01", year: 2021, diameter: 41, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 30, tags: ["Cronógrafo", "Aviador"] },
  { brand: "Breitling", commercial: "Superocean Heritage", ref: "AB2030121B1A1", movement: "ETA 2824-2", year: 2019, diameter: 42, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 200, tags: ["Buzo"] },
  { brand: "Breitling", commercial: "Chronomat", ref: "AB0138211C1A1", movement: "B01", year: 2020, diameter: 44, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 200, tags: ["Cronógrafo"] },
  // TUDOR
  { brand: "Tudor", commercial: "Black Bay", ref: "M79230N-0007", movement: "MT5602", year: 2016, diameter: 41, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 200, tags: ["Buzo"] },
  { brand: "Tudor", commercial: "Black Bay Fifty-Eight", ref: "M79030N-0001", movement: "MT5602", year: 2018, diameter: 39, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 200, tags: ["Buzo"] },
  { brand: "Tudor", commercial: "Black Bay GMT", ref: "M79830RB-0001", movement: "MT5602", year: 2018, diameter: 41, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 200, tags: ["GMT", "Buzo"] },
  { brand: "Tudor", commercial: "Pelagos", ref: "M25610TNL-0001", movement: "MT5602", year: 2015, diameter: 42, material: "TITANIUM", crystal: "SAPPHIRE", dial: "Azul", water: 500, tags: ["Buzo"] },
  // LONGINES
  { brand: "Longines", commercial: "Master Collection", ref: "L2.910.4.78.6", movement: "ETA 2824-2", year: 2018, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 30, tags: [] },
  { brand: "Longines", commercial: "HydroConquest", ref: "L3.782.4.96.6", movement: "ETA 2824-2", year: 2020, diameter: 41, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 300, tags: ["Buzo"] },
  { brand: "Longines", commercial: "Spirit", ref: "L3.820.4.93.6", movement: "ETA 2824-2", year: 2020, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 100, tags: [] },
  // GRAND SEIKO
  { brand: "Grand Seiko", commercial: "SBGH267", ref: "SBGH267", movement: "9SA5", year: 2020, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 100, tags: [] },
  { brand: "Grand Seiko", commercial: "SLGH005", ref: "SLGH005", movement: "9SA5", year: 2020, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Blanco", water: 100, tags: [] },
  // SEIKO
  { brand: "Seiko", commercial: "Prospex Marinemaster", ref: "SLA019J1", movement: "ETA 2824-2", year: 2017, diameter: 44, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 300, tags: ["Buzo"] },
  { brand: "Seiko", commercial: "Presage Cocktail Time", ref: "SRPE53J1", movement: "ETA 2824-2", year: 2019, diameter: 40, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 50, tags: [] },
  { brand: "Seiko", commercial: "5 Sports", ref: "SRPD71K1", movement: "ETA 2824-2", year: 2019, diameter: 42, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 100, tags: [] },
  // VACHERON CONSTANTIN
  { brand: "Vacheron Constantin", commercial: "Overseas", ref: "4500V/110A-B483", movement: "ETA 2824-2", year: 2016, diameter: 41, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 150, tags: [] },
  { brand: "Vacheron Constantin", commercial: "Patrimony", ref: "87172/000G-9301", movement: "ETA 2824-2", year: 2020, diameter: 40, material: "WHITE_GOLD", crystal: "SAPPHIRE", dial: "Blanco", water: 30, tags: [] },
  // A. LANGE & SÖHNE
  { brand: "A. Lange & Söhne", commercial: "Lange 1", ref: "101.039", movement: "ETA 2824-2", year: 2015, diameter: 38, material: "PLATINUM", crystal: "SAPPHIRE", dial: "Blanco", water: 30, tags: [] },
  { brand: "A. Lange & Söhne", commercial: "Saxonia Thin", ref: "211.026", movement: "ETA 2824-2", year: 2014, diameter: 40, material: "WHITE_GOLD", crystal: "SAPPHIRE", dial: "Blanco", water: 30, tags: [] },
  // NOMOS
  { brand: "Nomos Glashütte", commercial: "Tangente", ref: "101", movement: "DUW 3001", year: 2015, diameter: 35, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Blanco", water: 30, tags: [] },
  { brand: "Nomos Glashütte", commercial: "Club Sport Neomatik", ref: "740", movement: "DUW 3001", year: 2016, diameter: 42, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 300, tags: ["Buzo"] },
  { brand: "Nomos Glashütte", commercial: "Metro Neomatik 41", ref: "1101", movement: "DUW 3001", year: 2017, diameter: 41, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Azul", water: 100, tags: [] },
  // ZENITH
  { brand: "Zenith", commercial: "Chronomaster Sport", ref: "03.3100.3600/69.M3100", movement: "El Primero 3600", year: 2021, diameter: 41, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 100, tags: ["Cronógrafo"] },
  { brand: "Zenith", commercial: "Defy Classic", ref: "03.9000.670/77.M9000", movement: "El Primero 3600", year: 2017, diameter: 41, material: "STAINLESS_STEEL", crystal: "SAPPHIRE", dial: "Negro", water: 100, tags: [] },
  // HUBLOT
  { brand: "Hublot", commercial: "Big Bang Integral", ref: "451.NX.1170.NX", movement: "ETA 2824-2", year: 2021, diameter: 42, material: "CERAMIC", crystal: "SAPPHIRE", dial: "Negro", water: 100, tags: ["Cronógrafo"] },
  { brand: "Hublot", commercial: "Classic Fusion", ref: "542.NX.1170.NX", movement: "ETA 2824-2", year: 2019, diameter: 42, material: "CERAMIC", crystal: "SAPPHIRE", dial: "Negro", water: 50, tags: ["Esqueleto"] },
  // CHOPARD
  { brand: "Chopard", commercial: "L.U.C XPS", ref: "168619-3001", movement: "ETA 2824-2", year: 2016, diameter: 40, material: "ROSE_GOLD", crystal: "SAPPHIRE", dial: "Plateado", water: 30, tags: [] },
];

async function main() {
  console.log("🌱 Sembrando base de datos...");

  const brandMap: Record<string, string> = {};
  for (const b of brands) {
    const slug = slugify(b.name);
    const brand = await prisma.brand.upsert({
      where: { slug },
      update: {},
      create: { ...b, slug },
    });
    brandMap[b.name] = brand.id;
    process.stdout.write(`  ✓ Marca: ${b.name}\n`);
  }

  const movementMap: Record<string, string> = {};
  for (const m of movements) {
    const slug = slugify(`${m.manufacturer ?? "generic"}-${m.caliber}`);
    const movement = await prisma.movement.upsert({
      where: { slug },
      update: {},
      create: { ...m, slug },
    });
    movementMap[m.caliber] = movement.id;
    process.stdout.write(`  ✓ Calibre: ${m.caliber}\n`);
  }

  let count = 0;
  for (const w of watchData) {
    const brandId = brandMap[w.brand];
    if (!brandId) { console.warn(`  ⚠ Marca no encontrada: ${w.brand}`); continue; }
    const slug = watchSlug(w.brand, w.commercial ?? null, w.ref);
    await prisma.watch.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        reference: w.ref,
        commercialName: w.commercial ?? null,
        brandId,
        movementId: w.movement ? (movementMap[w.movement] ?? null) : null,
        yearIntroduced: w.year ?? null,
        caseDiameterMm: w.diameter ?? null,
        caseMaterial: w.material ?? null,
        crystal: w.crystal ?? null,
        dialColor: w.dial ?? null,
        waterResistance: w.water ?? null,
        waterResistanceUnit: w.water ? "METERS" : null,
        complicationTags: JSON.stringify(w.tags ?? []),
      },
    });
    count++;
  }

  console.log(`\n✅ Seed completo: ${brands.length} marcas, ${movements.length} calibres, ${count} relojes.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
