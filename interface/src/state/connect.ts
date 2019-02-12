import { ComponentType } from "react";
import { connect as connectRaw, GetProps, Matching } from "react-redux";

import { IStateProps, IDispatchProps, IAppState, IAppProps } from "src/state/models";

// TODO: Fix TComponentProps to actually work.
export const connect = <TComponentProps = {}>(component: ComponentType<IAppProps>) => {
  return connectRaw<IStateProps, IDispatchProps, TComponentProps, IAppState>(
    (state) => ({ state }),
    (dispatch) => ({ dispatch })
  )(component);
};

// TODO: Fix TComponentProps to actually work.
export const connectDispatch = <TComponentProps = {}>(component: ComponentType<IDispatchProps>) => {
  return connectRaw<{}, IDispatchProps, TComponentProps, IAppState>(
    () => ({}),
    (dispatch) => ({ dispatch })
  )(component);
};
