import styles from './next-test-lib.module.scss';

/* eslint-disable-next-line */
export interface NextTestLibProps {}

export function NextTestLib(props: NextTestLibProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to NextTestLib!</h1>
    </div>
  );
}

export default NextTestLib;
