/*
  { [filter: IFilter]: new SequencesStore(); }
      fetchSequences(filter)
          if (filter not in this.filters && this.filters.length > 5)
              this.filters.pop(this.filtersAccess[0])

  if (page in this.pages) {
    this.pages.push(this.pages.pop(page));
  } else {
    this.pages.popI(0);
    this.pages.push(this.fetchPage());
  }

  let page = this.pages.get(i);
  if (page === null) {
    page = this.pages.push(this.fetchPage());
  }
 */
// type OrderedValue<V> = { order: number; val: V };
// export class LimitedObservableMap<K, V> {
//   private _map: Map<K, V> = new Map();
//
//   constructor(private maxSize: number) {
//     if (maxSize < 1) throw new Error("Invalid maxSize");
//   }
//
//   removeOldest() {
//     for (const [k, v] of this._map) {
//       this._map.delete(k);
//       break;
//     }
//   }
//
//   get(key: K): V | null {
//     const val = this._map.get(key);
//     if (val === undefined) return null;
//     else {
//       this._map.delete(key);
//       this._map.set(key, val);
//       return val;
//     }
//   }
//
//   push(key: K, val: V): V | null {
//     if (!this._map.has(key)) {
//       this._map.set(key, val);
//
//       if (this._map.size > this.maxSize) {
//         this.removeOldest();
//       }
//     } else {
//       console.warn("Trying to add key to limitedStack that already exists");
//     }
//
//     return this.get(key);
//   }
// }

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

  private _removeOldest() {
    for (const [k, v] of this.map) {
      this.map.delete(k);
      break;
    }
  }

  get(key: TKey): TVal | undefined {
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

  set(key: TKey, val: TVal): this {
    this.map.set(key, val);
    if (this.map.size > this.maxSize) {
      this._removeOldest();
    }
    return this;
  }
}
