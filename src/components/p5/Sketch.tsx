import dynamic from 'next/dynamic';
import React from 'react';

export const Sketch:
  | React.ComponentClass<{}>
  | React.FunctionComponent<{}> = dynamic(
    import('src/components/p5/Canvas').then((mod) => mod.Canvas),
    { ssr: false },
  );
