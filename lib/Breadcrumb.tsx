import Link from 'next/link';

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
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2  font-medium">
      {/* Icon - Hidden on mobile to keep current page clean, or keep visible if preferred */}
      {/* <span className="text-xl hidden sm:block">
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </span>

      <div className="hidden sm:flex items-center space-x-2 ">
        {FirstPreviewsPageName && FirstPreviewsPageLink && (
          <>
            <span>/</span>
            <Link href={FirstPreviewsPageLink} className="transition-colors">
              {FirstPreviewsPageName}
            </Link>
          </>
        )}

        {SecondPreviewPageName && SecondPreviewPageLink && (
          <>
            <span>/</span>
            <Link href={SecondPreviewPageLink} className=" transition-colors">
              {SecondPreviewPageName}
            </Link>
          </>
        )}
        
        {/* The trailing slash before the current page name, also hidden on mobile   
        <span>/</span>
      </div>

      {/* Current Page - Always visible 
      <span className=" font-semibold mx-10  sm:mx-0">
        {CurrentPageName}
      </span> */}


      <div className='text-sm'>
        <div className='text-2xl pb-2'>{CurrentPageName}</div>
        {SecondPreviewPageName && (
          <>
            <Link href={SecondPreviewPageLink || "#"} className=" transition-colors">
              {SecondPreviewPageName}
            </Link>
          </>
        )}
        {FirstPreviewsPageName && (
          <>
            <span>{SecondPreviewPageName && "/"}</span>
            <Link href={FirstPreviewsPageLink || "#"} className=" transition-colors">
              {FirstPreviewsPageName}
            </Link>
          </>
        )}

        <span className=" font-semibold mx-10  sm:mx-0 text-foreground/60">
          / {CurrentPageName}
        </span>
      </div>
    </nav>
  );
};

export default Breadcrumb;