import { useState } from "preact/hooks";

interface SearchFormProps {
  initialSearchTerm: string;
}

export default function SearchForm({ initialSearchTerm }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("search", searchTerm);
    newUrl.searchParams.set("page", "1");
    window.location.href = newUrl.toString();
  };

  return (
    <form onSubmit={handleSubmit} class="flex-shrink-0">
      <div class="join">
        <input
          type="text"
          placeholder="Ara..."
          class="input input-bordered join-item w-full max-w-xs"
          value={searchTerm}
          onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
        />
        <button
          type="submit"
          class="btn btn-primary join-item border-solid border-primary"
        >
          Ara
        </button>
      </div>
    </form>
  );
}
