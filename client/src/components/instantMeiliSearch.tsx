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
  "GlRqSoAk_G37mKtt2JMiEd_qcNdC36uQLK9Y6ib26fc"
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
    {/* <div>ID: {hit.id}</div>
    <div>Stop ID: {hit.stop_id}</div>
    <div>Stop Name: {hit.stop_name}</div>
    <div>Route ID: {hit.route_id}</div>
    <div>Route Short Name: {hit.route_short_name}</div> */}
  </div>
);

const InstantMeiliSearchApp = () => (
  <InstantSearch indexName="stops" searchClient={searchClient}>
    {/* <div className="filter">
      <ClearRefinements />
      <SortBy
        defaultRefinement="stops"
        items={[
          { value: "routes:asc", label: "Routes asc." },
          { value: "routes:desc", label: "Routes desc." },
        ]}
      />
      <h2>Route Filter</h2>
      <Configure hitsPerPage={8} />
    </div> */}
    <div className="result-from-search">
      <SearchBox />
      <Hits hitComponent={Hit} />
      <Pagination showLast={true} />
    </div>
  </InstantSearch>
);

export default InstantMeiliSearchApp;
