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
  "icnjJkMDrHS84RIjTUieWH8dnsuQ8uYOmOuV4EKoffk"
);

interface StopEntry {
  id: string;
  stop_id: string;
  stop_name: string;
  route_id: string;
  route_short_names: string;
}

const Hit = ({ hit }: { hit: StopEntry }) => (
  <div key={hit.id}>
    <div>
      <Highlight attribute="stop_name" hit={hit} />
    </div>
    <div>
      <Snippet attribute="route_short_names" hit={hit} />
    </div>
  </div>
);

const InstantMeiliSearch = () => (
  <>
    <InstantSearch indexName="stops" searchClient={searchClient}>
      <div className="result-from-search">
        <div className="flex">
          <SearchBox />
          <Hits hitComponent={Hit} />
          <Pagination showLast={true} />
        </div>
      </div>
    </InstantSearch>
  </>
);

export default InstantMeiliSearch;
