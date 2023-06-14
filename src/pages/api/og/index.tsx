import { NextRequest, ImageResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

const og = (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');
  const title = searchParams.get('title');
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'white',
            height: '100%',
            border: 'solid 16px green',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
        >
          <h1
            style={{
              flex: 1,
              fontSize: 80,
              width: '100%',
              alignItems: 'center',
              padding: '0 64px',
              justifyContent: 'center',
            }}
          >
            {title}
          </h1>
          <div
            style={{
              width: '100%',
              justifyContent: 'flex-end',
              fontSize: 48,
              padding: '0 32px 32px 0',
              color: 'burlywood',
            }}
          >
            {name}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
};
export default og;
