type Props = {
    fetchDepartureResults: (textQuery: string) => void;
    fetchDestinationResults: (textQuery: string) => void;
    setIsDestinationFocus: (value: boolean) => void;
    setIsDepartureFocus: (value: boolean) => void;
};

export function SearchForm({
   fetchDepartureResults,
   fetchDestinationResults,
   setIsDestinationFocus,
   setIsDepartureFocus,
}: Props) {
    return (
        <form className="flex flex-col gap-4" onSubmit={() => {}}>
            <input
                type="text"
                placeholder="Départ"
                onChange={(e) => fetchDepartureResults(e.target.value)}
                className="px-5 py-2 rounded-md border w-full"
                onFocus={() => setIsDepartureFocus(true)}
                onBlur={() => setIsDepartureFocus(false)}
            />
            <input
                type="text"
                placeholder="Destination"
                onChange={(e) => fetchDestinationResults(e.target.value)}
                className="px-5 py-2 rounded-md border w-full"
                onFocus={() => setIsDestinationFocus(true)}
                onBlur={() => setIsDestinationFocus(false)}
            />
            <div className="flex gap-4 w-full">
                <input
                    type="datetime-local"
                    placeholder="Destination"
                    className="px-5 py-2 rounded-md border w-full text-sm"
                />
                <input
                    type="datetime-local"
                    placeholder="Destination"
                    className="px-5 py-2 rounded-md border w-full text-sm"
                />
            </div>
            <button
                type="submit"
                className="py-4 bg-green-500 rounded text-white font-bold mt-8"
            >
                Trouver l'itinéraire
            </button>
        </form>
    );
}