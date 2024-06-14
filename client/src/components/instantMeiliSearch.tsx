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
  "a4f452e8-73bd-4a42-be45-fd13e4b44de1"
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
