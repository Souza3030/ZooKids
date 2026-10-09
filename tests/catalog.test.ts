import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "../src/catalog";

describe("imagens do catálogo", () => {
  it("possui uma imagem disponível para cada produto", () => {
    expect(products).toHaveLength(12);
    expect(new Set(products.map((product) => product.image)).size).toBe(12);
    for (const product of products) {
      expect(product.image, product.name).toBeTruthy();
      expect(
        existsSync(join(process.cwd(), "public", product.image!.slice(1))),
        product.name,
      ).toBe(true);
    }
    expect(existsSync(join(process.cwd(), "public", "zookids-logo.png"))).toBe(
      true,
    );
  });
});
