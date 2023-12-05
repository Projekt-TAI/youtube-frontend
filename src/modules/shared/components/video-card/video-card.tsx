import { Link } from "react-router-dom";

import styles from './video-card.module.scss';

import { Video } from "../../models";
import { timeAgo } from "src/lib";
import { formatViews } from "../../helpers";

export type VideoCardProps = {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link to={`/watch/${video.id}`} className={styles.link}>
      <div className={styles.container}>
        <img className={styles.container__thumb} src={video.thumbnailSrc ?? 'https://picsum.photos/200/112'} loading="lazy" alt="thumbnail" />
        <div className={styles.container__info}>
					<div className={styles.container__title}>
						<p className={styles.text}>{video.title}</p>
					</div>
					<div className={styles.container__stats}>
						{/* TODO views */}
						<span className={styles.text}>{formatViews(video.views ?? 1000)} views</span>
						<span className={styles.seperator}></span>
						{/* TODO created at timestamp */}
						<span className={styles.text}>{timeAgo.format(video.createdAt ? new Date(video.createdAt) : (Date.now() - 21 * 60 * 60 * 1000))}</span>
					</div>
					<div className={styles.container__additional}>
						<p className={styles.text}>{video.description}</p>
						{/* TODO category */}
					</div>
					</div>
      </div>
    </Link>
  );
}

export default VideoCard;
