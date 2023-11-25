import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

const font = fetch(new URL('https://fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Bold.otf')).then(
  (res) => res.arrayBuffer()
);

const og = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');
  const title = searchParams.get('title');
  const image = searchParams.get('image');
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            border: 'solid 8px #0044FF',
            borderRadius: '24px',
            boxSizing: 'border-box',
            background: 'linear-gradient(to bottom right, #ffffff, #d3eef9)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 1,
            }}
          >
            {image && (
              <img
                style={{
                  borderRadius: '100%',
                  padding: '8px',
                  marginRight: '16px',
                  position: 'absolute',
                }}
                width={120}
                src={image}
                alt=""
              />
            )}
            <h1
              style={{
                display: 'flex',
                flex: 1,
                fontSize: 80,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: '32px',
              }}
            >
              {title}
            </h1>
          </div>
          <div
            style={{
              width: '100%',
              justifyContent: 'flex-end',
              fontSize: 48,
              padding: '0 32px 32px 0',
              color: '#CC3344',
            }}
          >
            {name}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'NotoSansJP',
          data: await font,
        },
      ],
    }
  );
};
export const GET = og;
export const runtime = 'edge';
