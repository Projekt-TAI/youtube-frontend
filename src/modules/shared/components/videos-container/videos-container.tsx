import styles from './videos-container.module.scss';

import VideoCard from "../video-card/video-card";

import { Video } from "../../models";
import { useState } from 'react';
import IsVisibleContainer from '../is-visible-container/is-visible-container';

export type VideosContainerProps = {
  videos: Video[];
	inView?: () => void;
	isFetching: boolean;
}

export function VideosContainer({ videos, inView, isFetching }: VideosContainerProps) {
	const [isListView, setIsListView] = useState(false);
	
  return (
		<>
			<button className='btn btn-secondary' onClick={() => setIsListView(prev => !prev)}>Toggle</button>
			<div className={`${styles.container} ${isListView ? styles.list : styles.gallery}`}>
				{
					videos.map((video, index) => (
						<VideoCard key={video.id ?? index} video={video} />
					))
				}
			</div>
			{!isFetching && <IsVisibleContainer inView={inView} />}
		</>
	)
}

export default VideosContainer;
