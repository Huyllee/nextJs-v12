import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { BsPlay, BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';
import { GoVerified } from 'react-icons/go';
import { Video } from '../types';
import { NextPage } from 'next';

interface IProps {
    post: Video;
}

const VideoCard: NextPage<IProps> = ({ post }) => {
    const [isHover, setIsHover] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef?.current) {
            videoRef.current.muted = isVideoMuted;
        }
    }, [isVideoMuted]);

    const onVideoPress = () => {
        if (playing) {
            videoRef.current.pause();
            setPlaying(false);
        } else {
            videoRef.current.play();
            setPlaying(true);
        }
    };

    return (
        <div className="flex flex-col pb-6 border-b-2 border-gray-200">
            <div>
                <div className="flex gap-3 p-2 font-semibold rounded cursor-pointer">
                    <div className="w-10 h-10 md:w-14 md:h-14">
                        <Link href={`/profile/${post.postedBy._id}`}>
                            <>
                                {post.postedBy.image && (
                                    <Image
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                        src={post.postedBy.image}
                                        alt="profile photo"
                                        layout="responsive"
                                    />
                                )}
                            </>
                        </Link>
                    </div>
                    <div>
                        <Link href={`/profile/${post.postedBy._id}`}>
                            <div className="flex items-center gap-2">
                                <p className="flex items-center gap-2 font-bold md:text-md text-primary">
                                    {post.postedBy.userName} {``}
                                    <GoVerified className="text-blue-400 text-md" />
                                </p>
                                <p className="hidden text-xs font-medium text-gray-500 capitalize md:block">
                                    {post.postedBy.userName}
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="relative flex gap-4 lg:ml-20">
                <div
                    className="rounded-3xl"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    <Link href={`/detail/${post._id}`}>
                        <video
                            className="cursor-pointer bg-gray-100 rounded-2xl lg:w-[700px] h-[300px] md:h-[400px] lg:h-[530px] w-[200px] "
                            loop
                            ref={videoRef}
                            src={post.video.asset.url}
                        ></video>
                    </Link>

                    {isHover && (
                        <div className="absolute flex gap-10 cursor-pointer bottom-6 left-8 md:left-14 lg:left-0 lg:justify-between w-[100px] md:w-[50px] p-3">
                            {playing ? (
                                <button onClick={onVideoPress}>
                                    <BsFillPauseFill className="text-2xl text-black lg:text-4xl" />
                                </button>
                            ) : (
                                <button onClick={onVideoPress}>
                                    <BsFillPlayFill className="text-2xl text-black lg:text-4xl" />
                                </button>
                            )}

                            {isVideoMuted ? (
                                <button onClick={() => setIsVideoMuted(false)}>
                                    <HiVolumeOff className="text-2xl text-black lg:text-4xl" />
                                </button>
                            ) : (
                                <button onClick={() => setIsVideoMuted(true)}>
                                    <HiVolumeUp className="text-2xl text-black lg:text-4xl" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
