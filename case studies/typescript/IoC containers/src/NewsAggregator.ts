import { Service, Inject } from "typedi";
import { NewsSource } from "./NewsSource";
import { RSSFeedSource } from "./RSSFeedSource";

@Service()
export class NewsAggregator {
  constructor(
    @Inject(() => RSSFeedSource) private source: NewsSource
  ) {}

  async getLatestArticles() {
    const articles = await this.source.fetchArticles();
    articles.forEach(article => console.log(article));
  }
}
