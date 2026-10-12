export type UnitType = "duplex" | "s3" | "s45";
export type Floor = "rdc" | "etage-1" | "etage-2" | "etage-3";
export type FloorFilter = Floor | "all";
export type UnitTypeFilter = UnitType | "all";

export interface Unit {
  ref: string;
  type: UnitType;
  floors: ReadonlyArray<Floor>;
  surface: number;
  bedrooms: string;
  pool: boolean;
  planImage: string;
  planThumb: string;
  planBlur: string;
  planPdf?: string;
  interactivePlan?: string;
  width: number;
  height: number;
}

export const FLOORS: ReadonlyArray<{
  floor: Floor;
  label: string;
  tabLabel: string;
  urlValue: string;
}> = [
  { floor: "rdc", label: "RDC", tabLabel: "Rdc", urlValue: "rdc" },
  { floor: "etage-1", label: "1er étage", tabLabel: "1er étage", urlValue: "1" },
  { floor: "etage-2", label: "2e étage", tabLabel: "2e étage", urlValue: "2" },
  { floor: "etage-3", label: "3e étage", tabLabel: "3e étage", urlValue: "3" },
];

export const UNIT_TYPES: ReadonlyArray<{
  type: UnitTypeFilter;
  label: string;
  shortLabel: string;
}> = [
  { type: "all", label: "Tous les types", shortLabel: "Tous" },
  { type: "duplex", label: "Duplex", shortLabel: "Duplex" },
  { type: "s3", label: "Appartements S+3", shortLabel: "S+3" },
  { type: "s45", label: "Appartements S+4.5", shortLabel: "S+4.5" },
];

export const UNITS: ReadonlyArray<Unit> = [
  {
    ref: "D01",
    type: "duplex",
    floors: ["rdc"],
    surface: 146,
    bedrooms: "3 + 1",
    pool: true,
    planImage: "/docs/plans/dup-01-rdc-2000.webp",
    planThumb: "/docs/plans/dup-01-rdc-800.webp",
    planBlur: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAwCdASoUAA4APyV8tVIuJ6UisAgBwCSJZwDLLB57GgJR06xcrzAAAPxg07QyUSUk5IxiHnmWhQssrb9uNIdpQn2GogAA",
    interactivePlan: "/docs/plans-interactifs/rdc/d01/duplex01.html",
    width: 1271,
    height: 892,
  },
  {
    ref: "D02",
    type: "duplex",
    floors: ["rdc"],
    surface: 152,
    bedrooms: "3 + 1",
    pool: true,
    planImage: "/docs/plans/dup-02-rdc-2000.webp",
    planThumb: "/docs/plans/dup-02-rdc-800.webp",
    planBlur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAABQAwCdASoUAA4APyV6tFGuJ6UisAgBwCSJaQAAUzITs2YSAAD8YNOXoPatK/OCXiOldO9tenfvnzNhmOYF/+v131JAqmMaHE1egFAA",
    interactivePlan: "/docs/plans-interactifs/rdc/d02/duplex02.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "D03",
    type: "duplex",
    floors: ["rdc"],
    surface: 158,
    bedrooms: "4",
    pool: true,
    planImage: "/docs/plans/dup-03-rdc-2000.webp",
    planThumb: "/docs/plans/dup-03-rdc-800.webp",
    planBlur: "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAABwAwCdASoUAA4APyV8tFIuJ6UisAgBwCSJaQAAVE6/fOSHksAA/GDTl63OdXvXoKQUMD8W57vTFnKl+j7Q52TfWuU2GolEKAA=",
    interactivePlan: "/docs/plans-interactifs/rdc/d03/duplex03.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "D04",
    type: "duplex",
    floors: ["rdc"],
    surface: 164,
    bedrooms: "3 + 1",
    pool: true,
    planImage: "/docs/plans/dup-04-rdc-2000.webp",
    planThumb: "/docs/plans/dup-04-rdc-800.webp",
    planBlur: "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAABQAwCdASoUAA4APyV6tFGuJ6UisAgBwCSJZwAAUh6l/3S+AAD8YNO0MmGtAojuBk7IRQLZEQRpagO/BmpLXIDCDmVxMF5sKAA=",
    interactivePlan: "/docs/plans-interactifs/rdc/d04/duplex04.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "D05",
    type: "duplex",
    floors: ["rdc"],
    surface: 170,
    bedrooms: "3 + 1",
    pool: true,
    planImage: "/docs/plans/dup-05-rdc-2000.webp",
    planThumb: "/docs/plans/dup-05-rdc-800.webp",
    planBlur: "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAABwAwCdASoUAA4APyV6tFGuJ6UisAgBwCSJaQAAUch3URedLVAA/GDTtDJhrQa1KzChvnJfi0AYLYTcVgoIcAAA",
    interactivePlan: "/docs/plans-interactifs/rdc/d05/duplex05.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "D06",
    type: "duplex",
    floors: ["rdc"],
    surface: 176,
    bedrooms: "4",
    pool: true,
    planImage: "/docs/plans/dup-06-rdc-2000.webp",
    planThumb: "/docs/plans/dup-06-rdc-800.webp",
    planBlur: "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAABWAwCdASoUAA4APyV6tFGuJ6UisAgBwCSJaQAAUf6UmKpudQAA/GDTlwPSCEDYWB1MZoS9M9Gi3a2bJS7BPwCKf85D9yBwAAA",
    interactivePlan: "/docs/plans-interactifs/rdc/d06/duplex06.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "D07",
    type: "duplex",
    floors: ["rdc"],
    surface: 182,
    bedrooms: "4",
    pool: true,
    planImage: "/docs/plans/dup-07-rdc-2000.webp",
    planThumb: "/docs/plans/dup-07-rdc-800.webp",
    planBlur: "data:image/webp;base64,UklGRlQAAABXURJQVlQ4IEgAAABQAwCdASoUAA4APyV6tFGuJ6UisAgBwCSJaQAAUcLrp69gAPxg05eg8dg2Dvv2wZ8d3sx8p7kFivAuP+xh9seP5QUAAA==",
    interactivePlan: "/docs/plans-interactifs/rdc/d07/duplex07.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "D08",
    type: "duplex",
    floors: ["rdc"],
    surface: 188,
    bedrooms: "4",
    pool: true,
    planImage: "/docs/plans/dup-08-rdc-2000.webp",
    planThumb: "/docs/plans/dup-08-rdc-800.webp",
    planBlur: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACQAwCdASoUAA4APyV6tFGuJ6UisAgBwCSJZwAAUvdLSsq4lRAAAPxg05cLX9WVu8IMSqlJm8sO6YVzuCD/9fCWYuBBFA=",
    interactivePlan: "/docs/plans-interactifs/rdc/d08/duplex08.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "A1-01",
    type: "s45",
    floors: ["etage-1"],
    surface: 98,
    bedrooms: "4",
    pool: true,
    planImage: "/docs/plans/s3-01-2000.webp",
    planThumb: "/docs/plans/s3-01-800.webp",
    planBlur: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAABQAwCdASoUAA4APyV8tFGuJ6UisAgBwCSJZwAAUa7NDeMqAAD8YNOXrWmF6ZYjNBvzonJ2BSUwzLREgnWMyuqw+sDoFFAA",
    interactivePlan: "/docs/plans-interactifs/etage-1/s3-01/appart1_1.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "A1-02",
    type: "s45",
    floors: ["etage-1"],
    surface: 102,
    bedrooms: "4",
    pool: true,
    planImage: "/docs/plans/s3-02-2000.webp",
    planThumb: "/docs/plans/s3-02-800.webp",
    planBlur: "data:image/webp;base64,UklGRlAAAABXRUJQVlQ4IEQAAABQAwCdASoUAA4APyV6tFGuJ6UisAgBwCSJaQAAUoMqgm77QAD8YNOXvDIFgy8GiQOhI2rKkktkuz/qSKcXD+r/7ZjgAA==",
    interactivePlan: "/docs/plans-interactifs/etage-1/s3-02/appart1_2.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "A1-03",
    type: "s45",
    floors: ["etage-1"],
    surface: 110,
    bedrooms: "4",
    pool: true,
    planImage: "/docs/plans/s3-03-2000.webp",
    planThumb: "/docs/plans/s3-03-800.webp",
    planBlur: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAABwAwCdASoUAA4APyV8tFIuJ6UisAgBwCSJaQAAUcMXjyx24AAA/GDTtDJhyxFlywRMn5he0OrUH8O7eNKdeZ3PRzmFAAAA",
    interactivePlan: "/docs/plans-interactifs/etage-1/s3-03/appart1_3.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "A2-01",
    type: "s45",
    floors: ["etage-2"],
    surface: 118,
    bedrooms: "4",
    pool: false,
    planImage: "/docs/plans/s45-01-2000.webp",
    planThumb: "/docs/plans/s45-01-800.webp",
    planBlur: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoUAA4APyV6tFGuJ6UisAgBwCSJaQAAVIy812TDu9kXAAD8YNO0LQPKAgKiBkDrQiYjaa80B+afxwstFEp2gRQA",
    interactivePlan: "/docs/plans-interactifs/etage-2/s45-01/appart2_1.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "A2-02",
    type: "s45",
    floors: ["etage-2"],
    surface: 124,
    bedrooms: "4",
    pool: false,
    planImage: "/docs/plans/s45-02-2000.webp",
    planThumb: "/docs/plans/s45-02-800.webp",
    planBlur: "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoUAA4APyV6tFIuJ6UisAgBwCSJaQAAUvf/D/o1BW+ogAD8YNOXoPuvPCeagBO95gQlaIC4cFsE0xts1Ej7yCeTRwAAAA==",
    interactivePlan: "/docs/plans-interactifs/etage-2/s45-02/appart2_2.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "A2-03",
    type: "s45",
    floors: ["etage-2"],
    surface: 132,
    bedrooms: "4 + 1",
    pool: false,
    planImage: "/docs/plans/s45-03-2000.webp",
    planThumb: "/docs/plans/s45-03-800.webp",
    planBlur: "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAwCdASoUAA4APyV8tFIuJ6UisAgBwCSJaQAAUpFqPH5BjKaqLMAA/GDTtDJ2gfSQz7RiiLsHGRwybSakg7WBj/5N5gigAAA",
    interactivePlan: "/docs/plans-interactifs/etage-2/s45-03/appart2_3.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "A1-04",
    type: "s45",
    floors: ["etage-1"],
    surface: 103,
    bedrooms: "4",
    pool: true,
    planImage: "/docs/plans/s3-04-2000.webp",
    planThumb: "/docs/plans/s3-04-800.webp",
    planBlur: "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAABwAwCdASoUAA4APyV8tVIuJ6UisAgBwCSJaQAAUod7LVndpAAA/GDTl57lXi1iAw/DQam0YJwpCoC2L3clnFz1sfHAAA==",
    interactivePlan: "/docs/plans-interactifs/etage-1/appart1_4/appart1_4.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "A2-04",
    type: "s45",
    floors: ["etage-2"],
    surface: 128,
    bedrooms: "4",
    pool: false,
    planImage: "/docs/plans/s45-04-2000.webp",
    planThumb: "/docs/plans/s45-04-800.webp",
    planBlur: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAwCdASoUAA4APyV6tVIuJ6UisAgBwCSJaQAMLMDX/obJrnQDA/AA/GpeSGFajXDzjZTtdxR4v5QddlyiQFafLkMmzx3zFypHiOAA",
    interactivePlan: "/docs/plans-interactifs/etage-2/appart2_4/appart2_4.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "A3-01",
    type: "s45",
    floors: ["etage-3"],
    surface: 105,
    bedrooms: "4",
    pool: true,
    planImage: "/docs/plans/appart3_1-2000.webp",
    planThumb: "/docs/plans/appart3_1-800.webp",
    planBlur: "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAwBACdASoUAA4APu1iqU2ppaOiMAgBMB2JZwC+SCPwlPlwxkHqb/dQ00AA/dN7lbzsWIuc03/g9JEYusk0pfamIpayqfENbe4tDEAP1YE0Gw3VoW25FCiW+gjxwAAA",
    interactivePlan: "/docs/plans-interactifs/etage-3/appart3_1/appart3_1.html",
    width: 1271,
    height: 892,
  },
  {
    ref: "A3-02",
    type: "s3",
    floors: ["etage-3"],
    surface: 108,
    bedrooms: "3",
    pool: true,
    planImage: "/docs/plans/appart3_2-2000.webp",
    planThumb: "/docs/plans/appart3_2-800.webp",
    planBlur: "data:image/webp;base64,UklGRmYAAABXRUJQVlQ4IFoAAACwAwCdASoUAA4APu1iqU2ppaOiMAgBMB2JaQAAUpDe9gxNSTDyQAD903uV1WAOGtc42wtG2uQI8tUfdv+11UI7kmFEJYVjcv08s8GuStpmALFkspVyEYWkIAA=",
    interactivePlan: "/docs/plans-interactifs/etage-3/appart3_2/appart3_2.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "A3-03",
    type: "s3",
    floors: ["etage-3"],
    surface: 102,
    bedrooms: "3",
    pool: true,
    planImage: "/docs/plans/appart3_3-2000.webp",
    planThumb: "/docs/plans/appart3_3-800.webp",
    planBlur: "data:image/webp;base64,UklGRmwAAABXRUJQVlQ4IGAAAACQAwCdASoUAA4APu1iqU2ppaOiMAgBMB2JaQAAUzRfuA1yRmgAAP3Te5XVTNX3mAEP0D8NyZnx5mfQnx/z9wO4aAzIV9jqclEb8w8RdP/8MlaeV08dXO9xSrmb9snqAAA=",
    interactivePlan: "/docs/plans-interactifs/etage-3/appart3_3/appart3_3.html",
    width: 1600,
    height: 1131,
  },
  {
    ref: "A3-04",
    type: "s3",
    floors: ["etage-3"],
    surface: 110,
    bedrooms: "3",
    pool: true,
    planImage: "/docs/plans/appart3_4-2000.webp",
    planThumb: "/docs/plans/appart3_4-800.webp",
    planBlur: "data:image/webp;base64,UklGRmYAAABXRUJQVlQ4IFoAAADQAwCdASoUAA4APu1iqU2ppaQiMAgBMB2JZwDE2CHwoDTMvFVLzoAA/dN7lb5eVnCCwUZuSjS0yg5vG6gjPEQhVqbHU5J6QCfGCj8217GOrFXv5IgSugN8oAA=",
    interactivePlan: "/docs/plans-interactifs/etage-3/appart3_4/appart3_4.html",
    width: 1600,
    height: 1131,
  },
];

export function getUnitsByType(type: UnitType): ReadonlyArray<Unit> {
  return UNITS.filter((unit) => unit.type === type);
}

export function getUnitsByTypes(types: ReadonlyArray<UnitType>): ReadonlyArray<Unit> {
  if (types.length === 0) return UNITS;
  return UNITS.filter((unit) => types.includes(unit.type));
}

export function unitsForFloor(
  floor: Floor,
  units: ReadonlyArray<Unit> = UNITS,
): ReadonlyArray<Unit> {
  return units.filter((unit) => unit.floors.includes(floor));
}

export function countByFloor(floor: Floor): number {
  return unitsForFloor(floor).length;
}

export function unitsForFloorFilter(
  floor: FloorFilter,
  units: ReadonlyArray<Unit> = UNITS,
): ReadonlyArray<Unit> {
  return floor === "all" ? units : unitsForFloor(floor, units);
}

export function surfaceRange(
  units: ReadonlyArray<Unit>,
): { min: number; max: number } | null {
  if (units.length === 0) return null;
  const surfaces = units.map((unit) => unit.surface);
  return { min: Math.min(...surfaces), max: Math.max(...surfaces) };
}

export function countPools(units: ReadonlyArray<Unit>): number {
  return units.filter((unit) => unit.pool).length;
}

export function floorFromUrlValue(value: string | undefined): FloorFilter {
  return FLOORS.find((entry) => entry.urlValue === value)?.floor ?? "all";
}

export function getUnit(ref: string): Unit | undefined {
  return UNITS.find((unit) => unit.ref === ref);
}

export function countByType(type: UnitType): number {
  return getUnitsByType(type).length;
}

export function totalUnits(): number {
  return UNITS.length;
}

export function unitsWithPool(): number {
  return UNITS.filter((unit) => unit.pool).length;
}

export function minSurface(): number {
  return Math.min(...UNITS.map((unit) => unit.surface));
}

export function maxSurface(): number {
  return Math.max(...UNITS.map((unit) => unit.surface));
}
