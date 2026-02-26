import "reflect-metadata";
import { Container } from "typedi";
import { NewsAggregator } from "./NewsAggregator";
import { APISource } from "./APISource";
import { RSSFeedSource } from "./RSSFeedSource";

const aggregator = Container.get(NewsAggregator);
aggregator.getLatestArticles(); // Uses RSSFeedSource by default


Container.set(RSSFeedSource, new APISource());

const aggregator2 = Container.get(NewsAggregator);
aggregator2.getLatestArticles(); // Now uses APISource
