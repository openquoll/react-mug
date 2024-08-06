import { construction } from './mug';

class RawStateStore {
  private _rawStatesByMug = new Map<any, any>();
  private _changeListenerSetsByMug = new Map<any, ((state: any) => void)[]>();

  public setRawState(mug: any, rawState: any): void {
    this._rawStatesByMug.set(mug, rawState);

    const changeListeners = this._changeListenerSetsByMug.get(mug);
    if (!changeListeners) {
      return;
    }
    changeListeners.forEach((listener) => {
      listener(rawState);
    });
  }

  public getRawState(mug: any): any {
    if (!this._rawStatesByMug.has(mug)) {
      this._rawStatesByMug.set(mug, mug[construction]);
    }
    return this._rawStatesByMug.get(mug);
  }

  public addChangeListener(mug: any, listener: (state: any) => void): void {
    if (!this._changeListenerSetsByMug.has(mug)) {
      this._changeListenerSetsByMug.set(mug, []);
    }
    const changeListeners = this._changeListenerSetsByMug.get(mug)!;
    if (changeListeners.includes(listener)) {
      return;
    }
    changeListeners.push(listener);
  }

  public removeChangeListener(mug: any, listener: (state: any) => void): void {
    const changeListeners = this._changeListenerSetsByMug.get(mug);
    if (!changeListeners) {
      return;
    }
    const i = changeListeners.indexOf(listener);
    if (i < 0) {
      return;
    }
    changeListeners.splice(i, 1);
  }
}

export const rawStateStore = new RawStateStore();
