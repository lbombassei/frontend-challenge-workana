import { ChevronDown, User } from "lucide-react";

import { Badge } from "./ui/badge";
import { CompanyLogo } from "./ui/vercel";

export function Header() {
  return (
    <div className="max-w-[1200px] mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <CompanyLogo />

          <Badge>BETA</Badge>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-sm font-medium">User</span>
          <span className="text-xs text-zinc-400">user@email.com</span>
        </div>
        <User className="size-8 rounded-full" />
        <ChevronDown className="size-4 text-zinc-600" />
      </div>
    </div>
  );
}
