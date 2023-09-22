import Link from "next/link";
import NavBarButton from "./NavBarButton";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "next-auth/react";
import ProfilePicture from "./ProfilePicture";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between gap-2 p-2 bg-base-100">
      <div className="flex items-center">
        <NavBarButton />
      </div>

      <div className="w-fit justify-center flex items-center">
        <Link
          href="/"
          className="normal-case text-center text-base md:text-xl"
        >
          Panel Doxadoctor
        </Link>
      </div>

      <div className="flex gap-1 md:gap-2 items-center justify-end w-fit md:w-1/3:">
        {session ? (
          <>
            <p className="text-3xl">{session?.user?.name}</p>
            <ProfilePicture
              username={session?.user?.email as string}
              w={70}
              h={70}
            />
          </>
        ) : (
          <p className="text-3xl">Inciar Sesion</p>
        )}

        <button
          className=""
          onClick={() => signOut()}
        >
          <div className="">
            <FontAwesomeIcon icon={faPowerOff} />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
