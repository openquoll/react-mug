import { construction, MugOf } from '../mug';
import { r } from './r';
import { w } from './w';

describe('typing', () => {
  test('...', () => {
    interface MousePositionState {
      x: number;
      y: number;
    }

    const mousePositionMug1: MugOf<MousePositionState> = {
      [construction]: {
        x: 0,
        y: 0,
      },
    };

    class MousePositionMug2 implements MugOf<MousePositionState> {
      [construction] = {
        x: 0,
        y: 0,
      };
    }

    const mousePositionMug2 = new MousePositionMug2();

    const c1 = mousePositionMug1[construction];
    const c2 = mousePositionMug2[construction];

    interface MouseStyleState {
      shape: string;
      size: number;
    }

    const mouseStyleMug1: MugOf<MouseStyleState> = {
      [construction]: {
        shape: 'default',
        size: 1,
      },
    };

    class MouseStyleMug2 implements MugOf<MouseStyleState> {
      [construction] = {
        shape: 'default',
        size: 1,
      };
    }

    const mouseStyleMug2 = new MouseStyleMug2();

    interface MouseState {
      deviceId: string;
      position: MousePositionState;
      style: MouseStyleState;
    }

    const mouseMug1: MugOf<MouseState> = {
      [construction]: {
        deviceId: '',
        position: mousePositionMug1,
        style: mouseStyleMug1,
      },
    };

    class MouseMug2 implements MugOf<MouseState> {
      [construction] = {
        deviceId: '',
        position: mousePositionMug2,
        style: mouseStyleMug2,
      };
    }

    const mouseMug2 = new MouseMug2();

    const getDeviceId = r((mouseState: MouseState) => mouseState.deviceId);

    const deviceId = getDeviceId(mouseMug1);

    const setDeviceId = w((mouseState: MouseState, deviceId: string) => ({
      ...mouseState,
      deviceId,
    }));

    const newDeviceId = '001';
    setDeviceId(mouseMug1, newDeviceId);
  });
});
