import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  // Bypassing SSL check for corporate/intercepting proxies (SELF_SIGNED_CERT_IN_CHAIN)
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
  const docId = '1TW8MP5dvmOGSYGoidNWCGKIfkrpN2bDPVdSx6F11hWU';
  const url = `https://docs.google.com/document/u/0/d/${docId}/export?format=pdf`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      return new Response('Failed to generate resume. Please try again later.', {
        status: 502,
      });
    }

    const pdfBuffer = await response.arrayBuffer();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resume.pdf"',
        // Optional: Cache for a short time to improve performance
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return new Response('Error generating resume. Please contact the administrator.', {
      status: 500,
    });
  }
};
