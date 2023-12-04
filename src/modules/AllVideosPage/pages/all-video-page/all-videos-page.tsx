import { useCallback, useEffect, useState } from 'react';

import styles from './all-video-page.module.scss';

import { useAllVideosQuery } from '../../api';

import { LoadingSpinner, VideosContainer } from "src/modules/shared/components";
import { PaginatedQueryParams } from 'src/models';

export function AllVideosPage() {
	const [query, setQuery] = useState<PaginatedQueryParams>({ pageNumber: 0, pageSize: 60 });
  const { isLoading, isFetching, isError, data, refetch, originalArgs } = useAllVideosQuery(query);

	const loadMore = useCallback(() => {
		if (isFetching) return;
		if (data && data.data.length >= data.count) return;

		setQuery(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
	}, [isFetching, data]);

	useEffect(() => {
		if (!originalArgs) return;
		
		setQuery(originalArgs);
	}, [originalArgs])

  return (
    <div className={styles.container}>
      <h3>All video files:</h3>
      {isLoading && <LoadingSpinner />}
      {!isLoading && isError && !data && <button type="button" className="btn btn-danger" onClick={() => refetch()}>Retry</button>}
      {data &&
        <>
					<VideosContainer videos={data.data} inView={() => loadMore()} isFetching={isFetching} />
					{isFetching && <LoadingSpinner />}
					{isError && <button type="button" className="btn btn-danger" onClick={() => refetch()}>Retry</button>}
				</>
      }
    </div>
  )
}

export default AllVideosPage;
