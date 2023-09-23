import Image from "next/image";
import { FunctionComponent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ProfilePictureProps {
  username: string;
  w?: number;
  h?: number;
}

const ProfilePicture: FunctionComponent<ProfilePictureProps> = ({
  username,
  w = 128,
  h = 128,
}) => {
  const { data: session } = useSession();

  const fetchProfilePicture = async () => {
    const response = await fetch(
      `/api/${
        session?.user?.email === username ? "user" : "pacientes"
      }/avatar/?username=${encodeURIComponent(username as string)}`
    );
    const data = response.json();
    return data;
  };

  const { data, isLoading, isError } = useQuery(
    [username, "profilePicture"],
    fetchProfilePicture
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center">
        <div className="object-cover rounded-full border mb-4"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center">
        <div className="object-cover rounded-full border mb-4">
          <p>Error</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center`}>
      <Link href="/perfil">
        <Image
          src={(data.image as string) || "/noprofile.png"}
          width={w}
          height={h}
          alt={`${username}'s Avatar`}
          className={`h-[${h}px] object-cover rounded-full border-2 border-gray-300`}
          style={{ height: `${h}px` }}
        />
      </Link>
    </div>
  );
};

export default ProfilePicture;
