/* eslint-disable no-unused-vars */
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const { user } = useUser();

  const [search, setSearch] = useSearchParams();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target == e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <nav className="flex items-center justify-between p-4 ">
        <Link>
          <img src="https://gedw8ocoh9cdt5ei.public.blob.vercel-storage.com/logo-GoEPnIM0KqqPcIomMKmjyjtBHYLEJY.png" className="h-20 " />
        </Link>

        <div className="flex gap-8">
          <SignedOut>
            <Button
              variant="outline"
              onClick={() => {
                setShowSignIn(true);
              }}
            >
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="mr-2" />
                  Post a job
                </Button>
              </Link>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My jobs"
                  labelIcon={<BriefcaseBusiness size={20} />}
                  href="/my-jobs"
                />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Saved jobs"
                  labelIcon={<Heart size={20} />}
                  href="/saved-jobs"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;
