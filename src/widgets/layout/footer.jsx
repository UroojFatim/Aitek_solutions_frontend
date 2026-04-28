import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";

export function Footer({ brandName, brandLink, routes }) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-end">
        <Typography variant="small" className="font-normal text-inherit">
        &copy; {year} Aitek Solutions - Powered by{" "}
          <a
            href="https://epic-sphere.com/"
            target="_blank"
            className="transition-colors hover:text-primary font-bold"
          >
            ES
          </a>
        </Typography>
        
      </div>
    </footer>
  );
}


Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
