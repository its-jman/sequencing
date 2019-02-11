import { ComponentType } from "react";
import { connect as connectRaw } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { IAppState } from "src/state/index";
import * as actions from "src/state/actions";
import { ActionCreator } from "src/state/typed";

type ActionsType = typeof actions;

interface IStateProps {
  state: IAppState;
}

type IDispatchProps = {
  actions: { [actionName in keyof ActionsType]: typeof actions[actionName] };
};

export type IAppProps = IStateProps & IDispatchProps;

export const connect = <TComponentProps = {}>(component: ComponentType<IAppProps>) => {
  return connectRaw<IStateProps, IDispatchProps, TComponentProps, IAppState>(
    (state) => ({ state }),
    // (dispatch) => ({
    //   actions: bindActionCreators(actions, dispatch)
    // }) // TODO: Make this dynamic...
    (dispatch) => ({
      actions: {
        fetchDatasets: dispatch(actions.fetchDatasets),
        clearDatasets: dispatch(actions.clearDatasets),
        setTitle: dispatch(actions.setTitle)
      }
    })
  )(component);
};
