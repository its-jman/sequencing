export interface IAction<TPayload> {
  type: string;
  payload: TPayload;
}

export interface IActionCreator<TPayload> {
  type: string;

  create: (payload: TPayload) => IAction<TPayload>;
}

export class ActionCreator<TPayload> implements IActionCreator<TPayload> {
  type: string;

  constructor(type: string) {
    this.type = type;
  }

  create(payload: TPayload): IAction<TPayload> {
    return {
      type: this.type,
      payload: payload
    };
  }
}
