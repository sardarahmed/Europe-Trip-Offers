import Script from 'next/script';

export function GoogleAnalytics() {
    // Hardcoded Measurement ID - this is safe as GA IDs are meant to be public
    const measurementId = 'G-GELW3ZJXES';

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `,
                }}
            />
        </>
    );
}
