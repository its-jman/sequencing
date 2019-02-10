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

// const mapDispatchToActions = (dispatch) => {
//   const out: ActionsType = {};
// };
// Object.entries(actions).map(([actionName, action]) => dispatch(action));

export const connect = (component: ComponentType<IAppProps>) => {
  return connectRaw<IStateProps, IDispatchProps, IAppProps, IAppState>(
    (state) => ({ state }),
    // (dispatch) => ({
    //   actions: bindActionCreators(actions, dispatch)
    // }) // TODO: Make this work correctly...
    (dispatch) => ({
      actions: {
        fetchDatasets: dispatch(actions.fetchDatasets),
        clearDatasets: dispatch(actions.clearDatasets),
        setTitle: dispatch(actions.setTitle)
      }
    })
  )(component);
};
