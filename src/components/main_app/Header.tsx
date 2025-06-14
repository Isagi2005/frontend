import { Disclosure } from "@headlessui/react";
import ProfileUser from "./ProfileUser";

const Header = () => {
  return (
    <Disclosure as="nav" className="bg-gray-800 shadow-sm ">
      <>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Votre logo ou titre ici */}
            <div className="flex-shrink-0"></div>

            {/* Conteneur pour les éléments de droite */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <ProfileUser />
              </div>
            </div>

            {/* Version mobile */}
            <div className="-mr-2 flex md:hidden">
              <ProfileUser />
            </div>
          </div>
        </div>
      </>
    </Disclosure>
  );
};

export default Header;
