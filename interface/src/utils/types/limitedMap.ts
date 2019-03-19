// export class LimitedObservableMap<TKey, TVal> extends Map<TKey, TVal> {
//   constructor(private maxSize: number) {
//     super();
//     if (maxSize < 1) throw new Error("Invalid maxSize");
//   }
//
//   private _removeOldest() {
//     for (const [k, v] of this) {
//       this.delete(k);
//       break;
//     }
//   }
//
//   get(key: TKey): TVal | undefined {
//     const val = super.get(key);
//     if (val !== undefined) {
//       // Delete is necessary to re-position the order of the element
//       super.delete(key);
//       super.set(key, val);
//     }
//     return val;
//   }
//
//   set(key: TKey, val: TVal): this {
//     super.set(key, val);
//     if (this.size > this.maxSize) {
//       this._removeOldest();
//     }
//     return this;
//   }
// }

import { action, observable, runInAction } from "mobx";

export class LimitedObservableMap<TKey, TVal> {
  @observable map: Map<TKey, TVal> = new Map();
  private top: TKey | null = null;

  constructor(private maxSize: number) {
    if (maxSize < 1) throw new Error("Invalid maxSize");
  }

  @action("limitedMap._removeOldest") private _removeOldest() {
    for (const [k, v] of this.map) {
      this.map.delete(k);
      break;
    }
  }

  @action("limitedMap.get") get(key: TKey): TVal | undefined {
    const val = this.map.get(key);
    if (val !== undefined) {
      if (this.top !== key) {
        // Delete is necessary to re-position the order of the element
        this.top = key;
        this.map.delete(key);
        this.map.set(key, val);
      }
    }
    return val;
  }

  @action("limitedMap.set") set(key: TKey, val: TVal): this {
    this.map.set(key, val);
    if (this.map.size > this.maxSize) {
      this._removeOldest();
    }
    return this;
  }
}
