import { SearchIcon } from "lucide-react"
import { Button } from "../ui/button";

const SearchManga = () => {
  return (
    <Button className="active:scale-95 transition-all">
      <SearchIcon size={16} />
    </Button>
  )
}

export default SearchManga;