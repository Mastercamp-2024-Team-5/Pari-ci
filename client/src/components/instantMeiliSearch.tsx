import {
  InstantSearch,
  Hits,
  SortBy,
  SearchBox,
  Pagination,
  Highlight,
  ClearRefinements,
  RefinementList,
  Configure,
  Snippet,
} from "react-instantsearch-dom";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

const { searchClient } = instantMeiliSearch(
  "http://0.0.0.0:7700/",
  "YePOxqZUXPhM7eeDfElDNndPFNc2bN98j03YZsQsvtc"
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

const InstantMeiliSearchApp = () => (
  <InstantSearch indexName="stops" searchClient={searchClient}>
    <div className="filter">
      <ClearRefinements />
      <SortBy
        defaultRefinement="stops"
        items={[{ value: "routes", label: "Sort by routes" }]}
      />
      <h2>Refinement List</h2>
      <RefinementList attribute="route_short_name" />
      <Configure hitsPerPage={8} />
    </div>
    <div className="result-from-search">
      <SearchBox />
      <Hits hitComponent={Hit} />
      <Pagination showLast={true} />
    </div>
  </InstantSearch>
);

export default InstantMeiliSearchApp;
