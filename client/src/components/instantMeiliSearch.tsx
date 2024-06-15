import {
  InstantSearch,
  Hits,
  //   SortBy,
  SearchBox,
  Pagination,
  Highlight,
  //   ClearRefinements,
  //   RefinementList,
  //   Configure,
  Snippet,
} from "react-instantsearch-dom";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

const { searchClient } = instantMeiliSearch(
  "localhost:7700",
  "W9R4tm-Ko9k7Y4BAQN_xg6bVxRTEGo755xnpOQ3q9JM"
);

interface StopEntry {
  id: string;
  stop_id: string;
  stop_name: string;
  route_id: string;
  route_short_name: string;
}

const Hit = ({ hit }: { hit: StopEntry }) => (
  <div key={hit.id}>
    <div>
      <Highlight attribute="stop_name" hit={hit} />
    </div>
    <div>
      <Snippet attribute="route_short_name" hit={hit} />
    </div>
  </div>
);

const InstantMeiliSearch = () => (
  <InstantSearch indexName="stops" searchClient={searchClient}>
    <div className="result-from-search">
      <SearchBox />
      <Hits hitComponent={Hit} />
      <Pagination showLast={true} />
    </div>
  </InstantSearch>
);

export default InstantMeiliSearch;
