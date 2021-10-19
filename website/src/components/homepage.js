// outsource dependencies
import React from 'react';
import clsx from 'clsx';

// styles
import styles from './homepage.module.css';

const list = [
  {
    title: 'Easy to Use',
    Svg: require('../../static/img/snap.svg').default,
    description: (
      <>
        redux-saga-controller was designed to be easily installed and
        used to develop fast.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('../../static/img/target.svg').default,
    description: (
      <>
        Lets you focus on develop, and keep your code and file structure simple.
      </>
    ),
  },
  {
    title: 'Time saver',
    Svg: require('../../static/img/fast-time.svg').default,
    description: (
      <>
        Lets you develop fast and don't spend time on creating reducers, actions, action creators
      </>
    ),
  },
];

function Feature ({ Svg, title, description }) {
  return <div className={clsx('col col--4')}>
    <div className="text--center">
      <Svg className={styles.featureSvg} alt={title} />
    </div>
    <div className="text--center padding-horiz--md">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>;
}

export default function Homepage () {
  return <section className={styles.features}>
    <div className="container">
      <div className="row">
        { list.map((props, index) => <Feature key={index} {...props} />)}
      </div>
    </div>
  </section>;
}
