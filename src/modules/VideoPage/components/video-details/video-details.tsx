import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import styles from './video-details.module.scss';

import { useVideoDetailsQuery } from '../../api/videoApiSlice';

import { formatNumbers } from 'src/modules/shared/helpers';

import { LoadingSpinner, SubscribeButton } from 'src/modules/shared/components';

import { VideoDescription, VideoLikes } from '..';
import { ShareVideoModal } from '../../modals';

export type VideoDetailsProps = {
	videoId: number;
}

export const VideoDetails = ({ videoId }: VideoDetailsProps) => {
	const [isShareModalOpen, setIsShareModalOpen] = useState(false);
	const { data, isLoading } = useVideoDetailsQuery({ videoId });

	if (isLoading) return <LoadingSpinner />
	if (!data) return null;

	const handleShare = () => {
		setIsShareModalOpen(true);
	}

	const handleCloseShareModal = () => {
		setIsShareModalOpen(false);
	}

  return (
    <>
			<div className={styles.container}>
				<h4 className={styles.title}>{data.title}</h4>
				<div className={styles.wrapper}>
					<div className={styles.left}>
						<div>
							<div className={styles.username}><Link to={`/user/${data.userId}`}>{data.userFullName}</Link></div>
							<div className={styles.subscriptions}>{formatNumbers(data.subscriptions, data.subscriptions >= 10000 ? 0 : 1)} subscribers</div>
						</div>

						<SubscribeButton {...data} videoId={videoId} />
					</div>

					<div className={styles.right}>
						<VideoLikes data={data} videoId={videoId} />

						<Button className="btn-light btn-lg btn-pill" onClick={handleShare}>Share</Button>
					</div>
				</div>
				<VideoDescription data={data} />
			</div>

			<ShareVideoModal onClose={handleCloseShareModal} show={isShareModalOpen} videoId={videoId} />
		</>
  )
};

export default VideoDetails;