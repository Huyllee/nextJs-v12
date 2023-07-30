import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { GoVerified } from 'react-icons/go';
import axios from 'axios';

import VideoCard from '../../components/VideoCard';
import NoResults from '../../components/NoResults';
import { IUser, Video } from '../../types';
import { BASE_URL } from '../../utils';

interface IProps {
    data: {
        user: IUser;
        userVideos: Video[];
        userLikedVideos: Video[];
    };
}

const Profile = ({ data }: IProps) => {
    const { user, userVideos, userLikedVideos } = data;

    const [showUserVideo, setShowUserVideo] = useState(true);
    const [videoList, setVideoList] = useState<Video[]>([]);

    const videos = showUserVideo ? 'border-b-2 border-black' : 'text-gray-400';
    const liked = !showUserVideo ? 'border-b-2 border-black' : 'text-gray-400';

    useEffect(() => {
        if (showUserVideo) {
            setVideoList(userVideos);
        } else {
            setVideoList(userLikedVideos);
        }
    }, [showUserVideo, userVideos, userLikedVideos]);

    return (
        <div className="w-full">
            <div className="flex gap-4 md:gap-8 mb-4 bg-white w-full">
                <div className="w-10 h-10 md:w-20 md:h-20">
                    <Image
                        width={80}
                        height={80}
                        className="rounded-full"
                        src={user.image}
                        alt="user-profile"
                        layout="responsive"
                    />
                </div>

                <div className="flex flex-col justify-center">
                    <p className="md:text-2xl tracking-wider flex gap-1 items-center text-md font-bold text-primary lowercase justify-center">
                        {user.userName} {''}
                        <GoVerified className="text-blue-400" />
                    </p>
                    <p className="capitalize md:text-xl text-gray-400 text-xs">{user.userName}</p>
                </div>
            </div>

            <div>
                <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
                    <p
                        className={`text-xl font-semibold cursor-pointer mt-2 ${videos}`}
                        onClick={() => setShowUserVideo(true)}
                    >
                        Videos
                    </p>
                    <p
                        className={`text-xl font-semibold cursor-pointer mt-2 ${liked}`}
                        onClick={() => setShowUserVideo(false)}
                    >
                        Likes
                    </p>
                </div>

                <div className="flex gap-6 flex-wrap md:justify-center">
                    {videoList?.length > 0 ? (
                        videoList.map((post: Video, index: number) => <VideoCard post={post} key={index} />)
                    ) : (
                        <NoResults text={`No ${showUserVideo ? '' : 'Liked'} `} />
                    )}
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps = async ({ params: { id } }: { params: { id: string } }) => {
    const res = await axios.get(`${BASE_URL}/api/profile/${id}`);

    return {
        props: {
            data: res.data,
        },
    };
};

export default Profile;
