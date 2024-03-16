import { Search, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input, Control } from "./ui/input";

interface FilterProps {
  useFilter: string;
  setUseFilter: (value: string) => void;
  handleFilter: () => void;
}

export function Filters(props: FilterProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Input variant="filter">
          <Search className="size-3" />
          <Control
            placeholder="Search Tags..."
            onChange={(event) => props.setUseFilter(event?.target?.value)}
            value={props.useFilter}
          />
        </Input>
        <Button onClick={props.handleFilter}>
          <Filter className="size-3" />
          Filter
        </Button>
      </div>
    </div>
  );
}
