import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { GoVerified } from 'react-icons/go';
import { MdOutlineCancel } from 'react-icons/md';
import { BsFillPlayFill } from 'react-icons/bs';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import axios from 'axios';
import { BASE_URL } from '../../utils';
import { Video } from '../../types';
import useAuthStore from '../../store/authStore';
import LikeButton from '../../components/LikeButton';
import Comments from '../../components/Comments';

interface IProps {
    postDetails: Video;
}

const Detail = ({ postDetails }: IProps) => {
    const [post, setPost] = useState(postDetails);
    const [playing, setPlaying] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [comment, setComment] = useState('');
    const [isPostingComment, setIsPostingComment] = useState(false);

    const { userProfile }: any = useAuthStore();

    const router = useRouter();

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (post && videoRef?.current) {
            videoRef.current.muted = isVideoMuted;
        }
    }, [isVideoMuted, post]);

    if (!post) return null;

    const onVideoClick = () => {
        if (playing) {
            videoRef.current.pause();
            setPlaying(false);
        } else {
            videoRef.current.play();
            setPlaying(true);
        }
    };

    const handleLike = async (like: boolean) => {
        if (userProfile) {
            const { data } = await axios.put(`${BASE_URL}/api/like`, {
                userId: userProfile._id,
                postId: post._id,
                like,
            });
            setPost({ ...post, likes: data.likes });
        }
    };

    const addComment = async (e) => {
        e.preventDefault();

        if (userProfile && comment) {
            setIsPostingComment(true);

            const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
                userId: userProfile._id,
                comment,
            });

            setPost({
                ...post,
                comments: data.comments,
            });
            setComment('');
            setIsPostingComment(false);
        }
    };

    return (
        <div className="absolute top-0 left-0 flex flex-wrap w-full bg-white lg:flex-nowrap">
            <div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black">
                <div className="absolute z-50 gap-6 top-6 left-6 lg:left-6">
                    <p className="cursor-pointer" onClick={() => router.back()}>
                        <MdOutlineCancel className="text-white text-[35px]" />
                    </p>
                </div>
                <div className="relative">
                    <div className="lg:h-[100vh] h-[60vh]">
                        <video
                            src={post.video.asset.url}
                            className="h-full cursor-pointer"
                            ref={videoRef}
                            loop
                            onClick={onVideoClick}
                        ></video>
                    </div>

                    <div className="absolute top-[45%] left-[45%] cursor-pointer">
                        {!playing && (
                            <button onClick={onVideoClick}>
                                <BsFillPlayFill className="text-6xl text-white lg:text-8xl" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="absolute cursor-pointer bottom-5 lg:bottom-10 right-5 lg:right-10">
                    {isVideoMuted ? (
                        <button onClick={() => setIsVideoMuted(false)}>
                            <HiVolumeOff className="text-2xl text-white lg:text-4xl" />
                        </button>
                    ) : (
                        <button onClick={() => setIsVideoMuted(true)}>
                            <HiVolumeUp className="text-2xl text-white lg:text-4xl" />
                        </button>
                    )}
                </div>
            </div>

            <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
                <div className="mt-10 lg:mt-20">
                    <div className="flex gap-3 p-2 font-semibold rounded cursor-pointer">
                        <div className="w-20 h-20 md:w-16 md:h-16">
                            <Link href="/">
                                <>
                                    {post.postedBy.image && (
                                        <Image
                                            width={62}
                                            height={62}
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
                            <Link href="/">
                                <div className="flex flex-col gap-2 mt-3">
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

                    <p className="px-5 text-lg text-gray-600">{post.caption}</p>

                    <div className="px-10 mt-10">
                        {userProfile && (
                            <LikeButton
                                likes={post.likes}
                                handleLike={() => handleLike(true)}
                                handleDislike={() => handleLike(false)}
                            />
                        )}
                    </div>

                    <Comments
                        comment={comment}
                        setComment={setComment}
                        addComment={addComment}
                        comments={post.comments}
                        isPostingComment={isPostingComment}
                    />
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps = async ({ params: { id } }: { params: { id: string } }) => {
    const { data } = await axios.get(`${BASE_URL}/api/post/${id}`);

    return {
        props: {
            postDetails: data,
        },
    };
};

export default Detail;
