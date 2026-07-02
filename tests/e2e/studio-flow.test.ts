import { describe, expect, it } from "vitest";

import { RecommendationEngine, VariationEngine } from "@/services/image-experience";

describe("studio generation flow configuration", () => {
  it("exposes professional variation actions for the result page", () => {
    const actions = new VariationEngine().getActions().map((action) => action.label);

    expect(actions).toContain("Generate Again");
    expect(actions).toContain("Improve Face");
    expect(actions).toContain("Different Jersey");
  });

  it("recommends follow-up generation scenarios", () => {
    const recommendations = new RecommendationEngine().suggest({ crowdLevel: "Half Crowd" }).map((item) => item.label);

    expect(recommendations).toContain("World Cup Version");
    expect(recommendations).toContain("Night Match");
    expect(recommendations).toContain("Victory Celebration");
  });
});
