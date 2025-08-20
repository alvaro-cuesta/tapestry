import cx from 'classnames';
import styles from './CircularButton.module.css';

export type CircularButtonProps = {
  type?: 'button' | 'submit' | 'reset' | undefined;
  className?: string | undefined;
  onClick: () => void;
  children: React.ReactNode;
};

export const CircularButton = (props: CircularButtonProps) => {
  const { type = 'button' } = props;

  return (
    <button
      type={type}
      className={cx(styles['button'], props.className)}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
