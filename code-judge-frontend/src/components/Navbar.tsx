const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Online Code Judge
        </a>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item border m-1 rounded">
              <a className="nav-link active" aria-current="page" href="/ide">
                IDE
              </a>
            </li>
            <li className="nav-item border m-1 rounded">
              <a
                className="nav-link active"
                aria-current="page"
                href="/problems"
              >
                Problems
              </a>
            </li>
            <li className="nav-item border m-1 rounded">
              <a
                className="nav-link active"
                aria-current="page"
                href="/create-problems"
              >
                Manage problems
              </a>
            </li>
            <li className="nav-item border m-1 rounded">
              <a className="nav-link active" aria-current="page" href="/about">
                About
              </a>
            </li>
          </ul>

          <a className="btn btn-light border m-1" href="/login">Log in</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
