import { usePathname } from 'next/navigation';
import Script from 'next/script';
import React, { FC, useEffect } from 'react';

interface Props {}

/**
 * GoogleAnalytics
 *
 * @param {Props} { }
 */
export const GoogleAnalytics: FC<Props> = ({}) => {
  const id = process.env.NEXT_PUBLIC_measurementId;
  const path = usePathname();
  useEffect(() => {
    if (id) {
      (window as { gtag?: (name: string, id: string, config: object) => void }).gtag?.(
        'config',
        id,
        {
          page_path: path,
        }
      );
    }
  }, [path, id]);
  return (
    <>
      {id && (
        <>
          <Script
            defer
            src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
            strategy="afterInteractive"
          />
          <Script id="ga" defer strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${id}');
          `}
          </Script>
        </>
      )}
    </>
  );
};
