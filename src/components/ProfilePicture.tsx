import { FunctionComponent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

interface ProfilePictureProps {
  userId?: string;
  w?: number;
  h?: number;
  type: "user" | "pacientes";
}

const ProfilePicture: FunctionComponent<ProfilePictureProps> = ({
  userId,
  w = 128,
  h = 128,
  type,
}) => {
  const { data: session } = useSession();

  const fetchProfilePicture = async () => {
    const response = await fetch(
      `/api/${type}/avatar/?${
        type === "user"
          ? `username=${encodeURIComponent(session?.user?.email as string)}`
          : `userId=${userId}`
      }`
    );
    const data = response.json();
    return data;
  };

  const { data, isLoading, isError } = useQuery(
    [userId || session?.user?.email, "profilePicture"],
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
        <CldImage
          src={(data.image as string) || "/noprofile.png"}
          width={w}
          height={h}
          alt={`${userId}'s Avatar`}
          className={`h-[${h}px] object-cover rounded-full border-2 border-gray-300`}
          style={{ height: `${h}px` }}
        />
      </Link>
    </div>
  );
};

export default ProfilePicture;
