import { Link, useLocation } from 'react-router-dom';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';

export default function Navbar() {
  const { isSignedIn } = useUser();
  const { pathname } = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container">
        <Link className="navbar-brand fw-bold letter-spacing-1" to="/">
          Style Finder
        </Link>

        <div className="ms-auto d-flex align-items-center gap-2">
          {isSignedIn ? (
            <>
              <Link
                to="/history"
                className={`btn btn-sm ${pathname === '/history' ? 'btn-light' : 'btn-outline-light'}`}
              >
                My Searches
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="btn btn-outline-light btn-sm">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn btn-light btn-sm">Sign Up</button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
