import { useCallback, useEffect, useState } from 'react';

import styles from './all-video-page.module.scss';

import { useAllVideosQuery } from '../../api';

import { LoadingSpinner, VideosContainer } from "src/modules/shared/components";

export function AllVideosPage() {
	const [pageNumber, setPageNumber] = useState(1);
  const { isLoading, isFetching, isError, data, refetch, originalArgs } = useAllVideosQuery({ pageNumber, pageSize: 20 });

	const loadMore = useCallback(() => {
		if (isFetching) return;

		setPageNumber(prev => prev + 1);
	}, [isFetching]);

	useEffect(() => {
		if (!originalArgs) return;
		
		setPageNumber(originalArgs.pageNumber);
	}, [originalArgs])

  return (
    <div className={styles.container}>
      <h3>All video files:</h3>
      {isLoading && <LoadingSpinner />}
      {!isLoading && isError && !data && <button type="button" className="btn btn-danger" onClick={() => refetch()}>Retry</button>}
      {data &&
        <>
					<VideosContainer videos={data} inView={() => loadMore()} isFetching={isFetching} />
					{isFetching && <LoadingSpinner />}
					{isError && <button type="button" className="btn btn-danger" onClick={() => refetch()}>Retry</button>}
				</>
      }
    </div>
  )
}

export default AllVideosPage;
