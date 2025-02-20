import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="w-full bg-primary text-primary-foreground px-4 py-2 flex justify-between items-center">
      <div className="font-semibold text-lg">Document Everything</div>
      <div className="flex gap-4">
        <Link
          to="https://www.paypal.me/NotFastEnuf"
          className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
        >
          Donate
        </Link>
        <Link
          to="https://notfastenuf.github.io/"
          className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
        >
          Visit Makerspace Hub
        </Link>
      </div>
    </div>
  );
};

export default Banner;
