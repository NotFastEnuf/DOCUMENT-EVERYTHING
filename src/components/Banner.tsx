import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

interface BannerProps {
  onMenuClick?: () => void;
}

const Banner = ({ onMenuClick }: BannerProps) => {
  return (
    <div className="w-full bg-primary text-primary-foreground px-4 py-2 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-primary-foreground hover:text-primary-foreground/80"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="font-semibold text-lg">Document Everything</div>
      </div>
      <div className="flex gap-4">
        <Link
          to="https://www.paypal.me/NotFastEnuf"
          className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
        >
          Donate
        </Link>
        <Link
          to="https://notfastenuf.github.io/"
          className="hidden sm:inline text-primary-foreground hover:text-primary-foreground/80 transition-colors"
        >
          Visit Makerspace Hub
        </Link>
      </div>
    </div>
  );
};

export default Banner;
