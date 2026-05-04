import { describe, expect, it } from "vitest";
import { filledCount, parseFarmerCarry, parseMmSs } from "./parse";

describe("parseMmSs", () => {
  it("accepte mm:ss", () => {
    expect(parseMmSs("03:32")).toBe(212);
    expect(parseMmSs("0:45")).toBe(45);
  });

  it("refuse secondes >= 60 ou format invalide", () => {
    expect(parseMmSs("3:70")).toBeNull();
    expect(parseMmSs("1:2:3")).toBeNull();
    expect(parseMmSs("")).toBeNull();
    expect(parseMmSs("   ")).toBeNull();
  });
});

describe("parseFarmerCarry", () => {
  it("accepte m/s avec slash ou texte", () => {
    expect(parseFarmerCarry("40/35")).toEqual({ meters: 40, seconds: 35 });
    expect(parseFarmerCarry(" 40 / 35 ")).toEqual({ meters: 40, seconds: 35 });
    expect(parseFarmerCarry("40m 35 s")).toEqual({ meters: 40, seconds: 35 });
  });

  it("refuse le vide ou formats non reconnus", () => {
    expect(parseFarmerCarry("")).toBeNull();
    expect(parseFarmerCarry("40-35")).toBeNull();
  });
});

describe("filledCount", () => {
  it("compte les champs renseignés", () => {
    expect(filledCount({})).toBe(0);
    expect(filledCount({ row1k: "03:32", pullups: 0 })).toBe(2);
    expect(
      filledCount({
        row1k: "1:0",
        pullups: 5,
        frontSquat5: 100,
        deadlift5: 0,
      }),
    ).toBe(3);
  });
});
