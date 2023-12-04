import styles from './videos-container.module.scss';

import IsVisibleContainer from '../is-visible-container/is-visible-container';
import LoadingSpinner from '../loading-spinner/loading-spinner';
import VideoCard from "../video-card/video-card";

import { Video } from "../../models";
import { PaginatedResponse } from 'src/models';

export type VideosContainerProps = {
	inView?: () => void;
	isFetching?: boolean;
	isLoading?: boolean;
	isError?: boolean;
	isListView?: boolean;
	refetch?: () => unknown;
	data: PaginatedResponse<Video> | undefined;
}

export function VideosContainer({ 
	inView = () => {}, 
	refetch = () => {}, 
	isFetching = false, 
	isLoading = false, 
	isError = false, 
	isListView = false, 
	data }: VideosContainerProps
) {
  return (
		<>
			<div>
				{isLoading && <LoadingSpinner />}
				{!isLoading && isError && !data && <button type="button" className="btn btn-danger" onClick={() => refetch()}>Retry</button>}
				{data &&
					<>
						<div className={`${styles.container} ${isListView ? styles.list : styles.gallery}`}>
							{
								data.data.map((video, index) => (
									<VideoCard key={video.id ?? index} video={video} />
								))
							}
						</div>
						{isFetching && <LoadingSpinner />}
						{isError && <button type="button" className="btn btn-danger" onClick={() => refetch()}>Retry</button>}
					</>
				}
			</div>
			{!isFetching && <IsVisibleContainer inView={inView} />}
		</>
	)
}

export default VideosContainer;
