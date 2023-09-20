import Image from 'next/image'
import { FunctionComponent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

interface ProfilePictureProps {
    username: string;
}

const ProfilePicture: FunctionComponent<ProfilePictureProps> = ({ username }) => {

    const { data: session } = useSession()

    const fetchProfilePicture = async () => {
        const response = await fetch(`/api/${ session?.user?.email === username ? "user" : "pacientes" }/avatar/?username=${encodeURIComponent(username as string)}`)
        const data = response.json()
        return data
    }

    const { data, isLoading, isError } = useQuery([username, 'profilePicture'], fetchProfilePicture)

    if (isLoading) {
        return (
            <div className="flex flex-col items-center">
                <div className="w-32 h-32 object-cover rounded-full border mb-4"></div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center">
                <div className="w-32 h-32 object-cover rounded-full border mb-4">
                    <p>Error</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center">
            <Image
                src={(data.image as string) || '/noprofile.png'}
                width={128}
                height={128}
                alt={`${username}'s Avatar`}
                className="w-32 h-32 object-cover rounded-full border-2 border-gray-300 mb-5"
            />
        </div>
    )
}

export default ProfilePicture