// outsource dependencies
import clsx from 'clsx';
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// local dependencies
import Homepage from '../components/homepage';

// styles
import styles from './index.module.css';

function HomepageHeader () {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Tutorial
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home () {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Tutorial for ${siteConfig.title}`}
      description="A tool to simplify work with react, redux and redux-saga">
      <HomepageHeader />
      <main>
        <Homepage />
      </main>
    </Layout>
  );
}
