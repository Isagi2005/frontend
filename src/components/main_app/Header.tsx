import { Disclosure } from "@headlessui/react";
import ProfileUser from "./ProfileUser";

const Header = () => {
  return (
    <Disclosure as="nav" className="bg-gray-800 h-12">
      <div className="mr-12 pt-2">
        <ProfileUser />
      </div>
    </Disclosure>
  );
};
export default Header;
