import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useProfile } from "@/hooks/useProfile";

const Header = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();

  return (
    <div className="h-16 w-full bg-white py-4 px-8 flex justify-between items-center">
      <div>
        <SidebarTrigger />
      </div>
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger className="cursor-pointer">
          <Avatar className="h-10 w-10 bg-gray-500">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>{profile?.name[0]}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-center">
            {profile?.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to="/settings">الصفحة الشخصية</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant="ghost" size={"sm"} onClick={() => signOut()}>
              تسجيل خروج
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
