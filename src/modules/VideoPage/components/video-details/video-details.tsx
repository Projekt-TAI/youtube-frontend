import { Button, ButtonGroup } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './video-details.module.scss';

import { timeAgo } from 'src/lib';

import { useVideoDetailsQuery } from '../../api/videoApiSlice';

import { formatNumbers, mapCategory } from 'src/modules/shared/helpers';

import { LoadingSpinner } from 'src/modules/shared/components';

export type VideoDetailsProps = {
	videoId: number;
}

export const VideoDetails = ({ videoId }: VideoDetailsProps) => {
	const [descriptionExpanded, setDescriptionExpanded] = useState(false);
	const { data, isLoading } = useVideoDetailsQuery(videoId);

	if (isLoading) return <LoadingSpinner />
	if (!data) return null;

	const handleLike = () => {
		//TODO
	}

	const handleDislike = () => {
		//TODO
	}

	const handleSubscribe = () => {
		//TODO
	}

	const handleShare = () => {
		//TODO
	}

	const descriptionSubstring = data.description.substring(0, 255);

  return (
    <div className={styles.container}>
			<h4 className={styles.title}>{data.title}</h4>
			<div className={styles.wrapper}>
				<div className={styles.left}>
					<div>
						<div className={styles.username}><Link to={`/profile/${data.id}`}>{data.userFullName}</Link></div>
						<div className={styles.subscriptions}>{formatNumbers(data.subscriptions, data.subscriptions >= 10000 ? 0 : 1)} subscribers</div>
					</div>

					<Button className={`${data.isSubscribed ? 'btn-light' : 'btn-dark'} btn-lg`} onClick={handleSubscribe}>{data.isSubscribed ? 'Unsubscribe' : 'Subscribe'}</Button>
				</div>

				<div className={styles.right}>
					<ButtonGroup>
						<Button className={`${data.isLiked ? 'btn-dark' : 'btn-light'} btn-lg`} onClick={handleLike}>{formatNumbers(data.likes, data.likes >= 10000 ? 0 : 1)} likes</Button>
						<button role="separator" className="btn btn-secondary mr-0 ml-0 pr-0 pl-0" disabled></button>
						<Button className={`${data.isDisliked ? 'btn-dark' : 'btn-light'} btn-lg`} onClick={handleDislike}>{formatNumbers(data.dislikes, data.dislikes >= 10000 ? 0 : 1)} dislikes</Button>
					</ButtonGroup>

					<Button className="btn-light btn-lg" onClick={handleShare}>Share</Button>
				</div>
			</div>
			<div className={styles.descriptionWrapper}>
				<div className={styles.details}>
					<span>{formatNumbers(data.views, data.views >= 10000 ? 0 : 1)} views</span>
					<span>{timeAgo.format(new Date(data.createdAt))}</span>
					<span className="chip">{mapCategory(data.category)}</span>
				</div>
				<span className={styles.description}>{descriptionExpanded ? data.description : descriptionSubstring}</span>
				<button className={`${styles.descriptionExpandBtn} ${descriptionSubstring.length === data.description.length ? styles.hide : ''} btn`} onClick={() => setDescriptionExpanded(prev => !prev)}>
					{descriptionExpanded ? 'Show less' : 'Show more'}
				</button>
			</div>
		</div>
  )
};

export default VideoDetails;