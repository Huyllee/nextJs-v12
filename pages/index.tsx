import axios from 'axios';
import { Video } from '../types';
import NoResults from '../components/NoResults';
import VideoCard from '../components/VideoCard';
import { BASE_URL } from '../utils';

interface IProps {
    videos: Video[];
}

const Home = ({ videos }: IProps) => {
    return (
        <div className="flex flex-col h-full gap-10 videos">
            {videos.length ? (
                videos?.map((video: Video) => <VideoCard post={video} key={video._id} />)
            ) : (
                <NoResults text={'No Videos'} />
            )}
        </div>
    );
};

export const getServerSideProps = async ({ query: { topic } }: { query: { topic: string } }) => {
    let res = null;
    if (topic) {
        res = await axios.get(`${BASE_URL}/api/discover/${topic}`);
    } else {
        res = await axios.get(`${BASE_URL}/api/post`);
    }

    return {
        props: {
            videos: res.data,
        },
    };
};

export default Home;
