import { PanelProps } from '@savantly/sprout-api';
import { stylesFactory, useTheme } from '@savantly/sprout-ui';
import { css, cx } from 'emotion';
import React from 'react';

interface Props extends PanelProps {}

export const SimplePanel: React.FC<Props> = ({ options, width, height }) => {
  const theme = useTheme();
  const styles = getStyles();
  const example = 'Hello World';

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <svg
        className={styles.svg}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`-${width / 2} -${height / 2} ${width} ${height}`}
      >
        <g>
          <circle style={{ fill: `${theme.isLight ? theme.palette.greenBase : theme.palette.blue95}` }} r={100} />
        </g>
      </svg>

      <div className={styles.textBox}>
        {options.showMessage && <div>{example}</div>}
        <div>Text option value: {options.text}</div>
      </div>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
});
