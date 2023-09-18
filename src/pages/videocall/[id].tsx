import React from 'react';
import dynamic from 'next/dynamic';

const VideoCallPage = dynamic(() => import('@/components/VideoCallPage'), {
    loading: () => <p className="m-4 text-xl">Cargando...</p>,
    ssr: false
});

const DynamicContextProvider = dynamic(() => import('@/context/VideoCallContext').then(mod => mod.ContextProvider), {
    loading: () => <p className="m-4 text-xl">Cargando...</p>,
    ssr: false
});

const VideoCall = () => {
    return (
        <DynamicContextProvider>
            <VideoCallPage />
        </DynamicContextProvider>
    );
}

export default VideoCall;

