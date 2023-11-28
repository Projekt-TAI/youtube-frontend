import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";

import styles from './default-layout.module.scss';

import { Header } from "src/layout/components";
import { LoadingSpinner } from "src/modules/shared/components";

export function DefaultLayout() {
  return (
    <>
      <Header />
      <main>
        <div className={styles.pageWrapper}>
          <ErrorBoundary fallback={<div>There was an error while loading the page</div>}>
            <Suspense fallback={<LoadingSpinner />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </>
  );
}

export default DefaultLayout;
