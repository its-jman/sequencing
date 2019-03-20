import React, { ReactElement } from "react";

enum Side {
  NONE = "NONE",
  BOTH = "BOTH",
  X = "X",
  Y = "Y"
}

type IProps = {
  children: ReactElement<{}>;
  side: Side;
};

export const Resizable = React.memo<IProps>(({ children, side }) => {
  return <div>{children}</div>;
});
