import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';

function IndexPage() {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Welcome to job analyzer!</h1>
      <div className={styles.welcome} />
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
