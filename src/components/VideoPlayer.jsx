import React from 'react';

const VideoPlayer = ({ videoUrl }) => {
	return (
		<div className='w-full h-64 overflow-hidden rounded-b-[32px] rounded-tl-[32px]'>
			<video controls className='w-full h-full'>
				<source src={videoUrl} type="video/mp4" width={300} />
				Your browser does not support the video tag.
			</video>
		</div>
	);
};

export default VideoPlayer;
