import { construction } from './mug';
import {
  _forEach,
  _get,
  _has,
  _includes,
  _indexOf,
  _push,
  _set,
  _splice,
  _WeakMap,
} from './shortcuts';

export type RawState<TMugLike> = TMugLike extends { [construction]: infer TConstruction }
  ? TConstruction
  : TMugLike;

class RawStateStore {
  private _rawStatesByMug = new _WeakMap<any, any>();
  private _changeListenerSetsByMug = new _WeakMap<any, ((state: any) => void)[]>();

  public _setRawState(mug: any, rawState: any): void {
    this._rawStatesByMug[_set](mug, rawState);

    const changeListeners = this._changeListenerSetsByMug[_get](mug);
    if (!changeListeners) {
      return;
    }
    changeListeners[_forEach]((listener) => listener(rawState));
  }

  public _getRawState(mug: any): any {
    if (!this._rawStatesByMug[_has](mug)) {
      this._rawStatesByMug[_set](mug, mug[construction]);
    }
    return this._rawStatesByMug[_get](mug);
  }

  public _addChangeListener(mug: any, listener: (state: any) => void): void {
    if (!this._changeListenerSetsByMug[_has](mug)) {
      this._changeListenerSetsByMug[_set](mug, []);
    }
    const changeListeners = this._changeListenerSetsByMug[_get](mug)!;
    if (changeListeners[_includes](listener)) {
      return;
    }
    changeListeners[_push](listener);
  }

  public _removeChangeListener(mug: any, listener: (state: any) => void): void {
    const changeListeners = this._changeListenerSetsByMug[_get](mug);
    if (!changeListeners) {
      return;
    }
    const i = changeListeners[_indexOf](listener);
    if (i < 0) {
      return;
    }
    changeListeners[_splice](i, 1);
  }
}

export const rawStateStore = new RawStateStore();
