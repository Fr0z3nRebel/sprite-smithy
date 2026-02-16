import { Composition } from 'remotion';
import { SpriteDemo } from './SpriteDemo';

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;
const DURATION_SEC = 70;
const DURATION_FRAMES = DURATION_SEC * FPS;

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="SpriteDemo"
        component={SpriteDemo}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
