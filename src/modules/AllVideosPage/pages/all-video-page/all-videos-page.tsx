import { useCallback, useEffect, useState } from 'react';

import styles from './all-video-page.module.scss';

import { useAllVideosQuery } from '../../api';

import { VideosContainer } from "src/modules/shared/components";
import { PaginatedQueryParams } from 'src/models';

export function AllVideosPage() {
	const [query, setQuery] = useState<PaginatedQueryParams>({ pageNumber: 0, pageSize: 3 });
	const [isListView, setIsListView] = useState(false);
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
			<div className={styles.container__header}>
      	<h3>All video files:</h3>
				<button className='btn btn-secondary' onClick={() => setIsListView(prev => !prev)}>Toggle</button>
			</div>
      <VideosContainer inView={() => loadMore()} isFetching={isFetching} isLoading={isLoading} isError={isError} refetch={refetch} data={data} isListView={isListView} />
    </div>
  )
}

export default AllVideosPage;
