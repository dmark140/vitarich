import Link from "next/link";

interface BreadcrumbProps {
  CurrentPageName: string;
  FirstPreviewsPageName?: string;
  FirstPreviewsPageLink?: string;
  SecondPreviewPageName?: string;
  SecondPreviewPageLink?: string;
}

const Breadcrumb = ({
  CurrentPageName,
  FirstPreviewsPageName,
  FirstPreviewsPageLink,
  SecondPreviewPageName,
  SecondPreviewPageLink,
}: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-col">
      
      {/* Page Title - Always Visible */}
      <h1 className="text-2xl font-semibold pb-1">
        {CurrentPageName}
      </h1>

      {/* Breadcrumb Links - Hidden on md and smaller */}
      <ol className="hidden md:flex items-center gap-2 text-sm whitespace-nowrap">
        
        {SecondPreviewPageName && (
          <>
            <li>
              <Link
                href={SecondPreviewPageLink || "#"}
                className="transition-colors hover:underline"
              >
                {SecondPreviewPageName}
              </Link>
            </li>
            <span>/</span>
          </>
        )}

        {FirstPreviewsPageName && (
          <>
            <li>
              <Link
                href={FirstPreviewsPageLink || "#"}
                className="transition-colors hover:underline"
              >
                {FirstPreviewsPageName}
              </Link>
            </li>
            <span>/</span>
          </>
        )}

        <li className="font-semibold" aria-current="page">
          {CurrentPageName}
        </li>

      </ol>
    </nav>
  );
};

export default Breadcrumb;