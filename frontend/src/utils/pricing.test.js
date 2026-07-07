import { describe, expect, it } from "vitest";
import { formatDate } from "./formatters";
import {
  getStatus,
  getVariation,
  isCriticalStock,
  isLowStock,
} from "./pricing";

describe("pricing utils", () => {
  it("calcula la variacion porcentual", () => {
    expect(getVariation(100, 110)).toBe(10);
    expect(getVariation(100, 90)).toBe(-10);
  });

  it("usa el semaforo solo por precio", () => {
    expect(
      getStatus({ previousPrice: 100, currentPrice: 112, stock: 50 }).label
    ).toBe("Critico");
    expect(
      getStatus({ previousPrice: 100, currentPrice: 105, stock: 1 }).label
    ).toBe("Atencion");
    expect(
      getStatus({ previousPrice: 100, currentPrice: 100, stock: 1 }).label
    ).toBe("Estable");
  });

  it("mantiene el stock como señal separada", () => {
    expect(isLowStock(8)).toBe(true);
    expect(isLowStock(9)).toBe(false);
    expect(isCriticalStock(5)).toBe(true);
    expect(isCriticalStock(6)).toBe(false);
  });

  it("formatea fechas YYYY-MM-DD sin correrse de dia", () => {
    expect(formatDate("2026-07-07")).toBe("07/07/2026");
  });
});
