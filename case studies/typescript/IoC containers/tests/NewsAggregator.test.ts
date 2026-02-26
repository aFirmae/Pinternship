import "reflect-metadata";
import { Container } from "typedi";
import { NewsAggregator } from "../src/NewsAggregator";
import { RSSFeedSource } from "../src/RSSFeedSource";
import { NewsSource } from "../src/NewsSource";

describe("NewsAggregator", () => {
  beforeEach(() => {
    Container.reset();
  });

  it("should fetch articles using the injected mock source", async () => {
    const mockArticles = ["Mock Article 1", "Mock Article 2"];
    const mockSource: NewsSource = {
      fetchArticles: jest.fn().mockResolvedValue(mockArticles),
    };

    Container.set(RSSFeedSource, mockSource);

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    const aggregator = Container.get(NewsAggregator);
    await aggregator.getLatestArticles();

    expect(mockSource.fetchArticles).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith("Mock Article 1");
    expect(consoleSpy).toHaveBeenCalledWith("Mock Article 2");

    consoleSpy.mockRestore();
  });
});
