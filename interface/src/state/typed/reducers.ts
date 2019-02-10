import { IAction, IActionCreator } from "src/state/typed/actions";

interface IReducerFn<TState, TAction> {
  (state: TState, action: TAction): TState;
}

interface IReducer<TState> {
  registerCase<TPayload>(
    ac: IActionCreator<TPayload>,
    fn: IReducerFn<TState, IAction<TPayload>>
  ): IReducer<TState>;

  call(state: TState | undefined, action: IAction<unknown>): TState;
}

export class Reducer<TState> implements IReducer<TState> {
  initialState: TState;
  actionMap: { [type: string]: IReducerFn<TState, IAction<unknown>> };

  constructor(initialState: TState) {
    this.initialState = initialState;
    this.actionMap = {};
  }

  registerCase<TPayload>(
    ac: IActionCreator<TPayload>,
    fn: IReducerFn<TState, IAction<TPayload>>
  ): IReducer<TState> {
    if (ac.type in this.actionMap) {
      throw new Error("Duplicate key in reducer.");
    } else {
      // @ts-ignore TODO: Fix...?
      this.actionMap[ac.type] = fn;
    }
    return this;
  }

  call(state: TState = this.initialState, action: IAction<unknown>): TState {
    return state;
  }
}
