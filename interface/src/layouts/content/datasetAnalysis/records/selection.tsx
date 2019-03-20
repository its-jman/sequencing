import React, { ReactElement } from "react";

import { IMatch, IRecord } from "src/state/models";
import { getRandomColor } from "src/utils";

import styles from "./_records.module.scss";

type IMatchProps = {
  children: ReactElement<{}>;
  matches: IMatch[];
  offset: number;
};

const Match = React.memo<IMatchProps>(({ children, matches, offset }) => {
  return <span style={{ backgroundColor: getRandomColor() }}>{children}</span>;
});

/*
  Matches are sorted by startIndex.
  Ignore matches with equal start and end indicies.
  If two sequences overlap...?
      A:
          Start span (goes up to the overlapping part)
          Middle span (goes up to the end of overlap)
          End span (goes from end of overlap to end of substr)

      B:
          Span that overlaps everything
          Same as A?

      C:
          React element that overlaps everything
            JS handles hover and selection, deals with bgc...
            takes match[] and offset. calcs the start/end of each match and styles them accordingly
            has inner spans that handle hover

01234567


  Match code:
      sorted by start index, then by end index.
      for i in arr:
          if next.start < maxEnd
              maxEnd = Math.max(this.end, next.end);
              matchSet.push(this, next)
 */
export const Selection = React.memo<{ record: IRecord }>(({ record }) => {
  // const analysisStore = useContext(AnalysisContext);
  return (
    <div className={styles.selectionContent}>
      <div className={styles.sequence}>{record.sequence}</div>
    </div>
  );
});
