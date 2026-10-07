export type UnitType = "duplex" | "s3" | "s45";

export interface Unit {
  ref: string;
  type: UnitType;
  surface: number;
  bedrooms: string;
  pool: boolean;
  planSrc: string;
  planThumb: string;
  planBlur: string;
  planPdf: string;
  width: number;
  height: number;
}

export const UNIT_TYPES: ReadonlyArray<{
  type: UnitType;
  label: string;
  shortLabel: string;
}> = [
  { type: "duplex", label: "Duplex", shortLabel: "Duplex" },
  { type: "s3", label: "Appartements S+3", shortLabel: "S+3" },
  { type: "s45", label: "Appartements S+4.5", shortLabel: "S+4.5" },
];

export const UNITS: ReadonlyArray<Unit> = [
  {
    ref: "D01",
    type: "duplex",
    surface: 146,
    bedrooms: "3 + 1",
    pool: true,
    planSrc: "/docs/plans/DUP-01.webp",
    planThumb: "/docs/plans/DUP-01-thumb.webp",
    planBlur: "data:image/jpeg;base64,/9j/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAWACADASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAUBAgQD/8QAGxAAAwADAQEAAAAAAAAAAAAAAAECAxEiIRP/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/ANuJ9oZzk5QrxrtDGfIQQ1f7EPMErZzudvSQhhxPdoZzG5QAENSo0WmEvQAQ/9k=",
    planPdf: "/docs/Plans-AVA-Duplex.pdf",
    width: 1271,
    height: 892,
  },
  {
    ref: "D02",
    type: "duplex",
    surface: 152,
    bedrooms: "3 + 1",
    pool: true,
    planSrc: "/docs/plans/DUP-02.webp",
    planThumb: "/docs/plans/DUP-02-thumb.webp",
    planBlur: "data:image/jpeg;base64,/9j/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAXACADASIAAhEBAxEB/8QAGQABAQADAQAAAAAAAAAAAAAAAAUBAgME/8QAGxAAAgMBAQEAAAAAAAAAAAAAAAECAxEiMTL/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/APZU8mitXPYok1rpFGr5wIa6uzBGes5yMw9EJtL7SKihymgAho4abRhjAEP/2Q==",
    planPdf: "/docs/Plans-AVA-Duplex.pdf",
    width: 1600,
    height: 1131,
  },
  {
    ref: "D03",
    type: "duplex",
    surface: 158,
    bedrooms: "4",
    pool: true,
    planSrc: "/docs/plans/DUP-03.webp",
    planThumb: "/docs/plans/DUP-03-thumb.webp",
    planBlur: "data:image/jpeg;base64,/9j/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAXACADASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAUBAgQD/8QAHxAAAgMAAQUBAAAAAAAAAAAAAAECAxEhEyIxM0FC/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIRAxEAPwDbT7ENYzyKFNfE0b6nvkIa7ysaIVmvkrJlP2hBfVjkkMoU9qegAQ1PRb+kxpx7oAIf/9k=",
    planPdf: "/docs/Plans-AVA-Duplex.pdf",
    width: 1600,
    height: 1131,
  },
  {
    ref: "S3-01",
    type: "s3",
    surface: 98,
    bedrooms: "3",
    pool: false,
    planSrc: "/docs/plans/S3-01.webp",
    planThumb: "/docs/plans/S3-01-thumb.webp",
    planBlur: "data:image/jpeg;base64,/9j/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAXACADASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAIFAQT/xAAeEAADAAICAwEAAAAAAAAAAAAAAQIDERIiEyEyYf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEQMRAD8A7cT7opzk6ol4vtFFepQQ0/m/AnLyehZW0ZEvmIT8T3kRUmE5QAENMo0bMpAAh//Z",
    planPdf: "/docs/Plans-AVA-S3.pdf",
    width: 1600,
    height: 1131,
  },
  {
    ref: "S3-02",
    type: "s3",
    surface: 102,
    bedrooms: "3",
    pool: true,
    planSrc: "/docs/plans/S3-02.webp",
    planThumb: "/docs/plans/S3-02-thumb.webp",
    planBlur: "data:image/jpeg;base64,/9j/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAXACADASIAAhEBAxEB/8QAGQAAAwADAAAAAAAAAAAAAAAAAAEFAgME/8QAHBAAAwEBAQADAAAAAAAAAAAAAAECEQMiITFR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIRAxEAPwDs5PLRTnt5RM5LbRQ5z+hDW1dNGr1mFfA5+xCZxftFWZ2UABDTcaNRgAIf/9k=",
    planPdf: "/docs/Plans-AVA-S3.pdf",
    width: 1600,
    height: 1131,
  },
  {
    ref: "S3-03",
    type: "s3",
    surface: 110,
    bedrooms: "3",
    pool: true,
    planSrc: "/docs/plans/S3-03.webp",
    planThumb: "/docs/plans/S3-03-thumb.webp",
    planBlur: "data:image/jpeg;base64,/9j/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAXACADASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAEFAwIE/8QAHBAAAgMAAwEAAAAAAAAAAAAAAAECAxExMjNR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIRAxEAPwD20+iKsZ5FIk1d0UK5fQhrZ2YNT0zb0ceRCZTjmkU41JxQAENdKtIahjABD//Z",
    planPdf: "/docs/Plans-AVA-S3.pdf",
    width: 1600,
    height: 1131,
  },
  {
    ref: "S45-01",
    type: "s45",
    surface: 118,
    bedrooms: "4",
    pool: true,
    planSrc: "/docs/plans/S45-01.webp",
    planThumb: "/docs/plans/S45-01-thumb.webp",
    planBlur: "data:image/jpeg;base64,/9j/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAXACADASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAUBAgME/8QAGhEAACIDAQEAAAAAAAAAAAAAAAECAxEhESESMBLx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAaEQEBAAIDBAAAAAAAAAAAAAAAAQIDESEEEjJB/9oADAMBAAIRAxEAPwD0qfCpaUzJ6W7Crp9D0VfCi0lpUPOaBZ9hBfgn2q9hAAdFK1GB9DQQLzJVB3OlIiv0/WrUa8KbTn6O2t7D9dVBfU0D9B2vroQDQALv7e2VZq+62q9j7e3p4/9k=",
    planPdf: "/docs/Plans-AVA-S45.pdf",
    width: 1600,
    height: 1131,
  },
  {
    ref: "S45-02",
    type: "s45",
    surface: 124,
    bedrooms: "4",
    pool: true,
    planSrc: "/docs/plans/S45-02.webp",
    planThumb: "/docs/plans/S45-02-thumb.webp",
    planBlur: "data:image/jpeg;base64,/9j/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAXACADASIAAhEBAxEB/8QAGQABAQEAAwAAAAAAAAAAAAAAAAUBAgME/8QAHBAAAgIDAQEAAAAAAAAAAAAAAAECAxEhIhMz/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIRAxEAPwD21PtFSFnKJdP0RSjjCCGufoPTZ1y0atsQm0vtFSMNJgBDSUMmxrwAIf/Z",
    planPdf: "/docs/Plans-AVA-S45.pdf",
    width: 1600,
    height: 1131,
  },
  {
    ref: "S45-03",
    type: "s45",
    surface: 132,
    bedrooms: "4 + 1",
    pool: true,
    planSrc: "/docs/plans/S45-03.webp",
    planThumb: "/docs/plans/S45-03-thumb.webp",
    planBlur: "data:image/jpeg;base64,/9j/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAXACADASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAUBAgT/xAAdEAACAgIDAQAAAAAAAAAAAAAAAQIDETMhIjFB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIRAxEAPwD207EVVPEUiVTsRTj8CGtdmArMnEh4hCdS+6KcINpMAIa118mOtsAQ/9k=",
    planPdf: "/docs/Plans-AVA-S45.pdf",
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