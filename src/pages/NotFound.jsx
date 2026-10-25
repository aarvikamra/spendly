import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found-code">404</p>
      <h1>This page doesn&rsquo;t exist</h1>
      <p>The link may be broken, or the page may have moved.</p>
      <Link className="primary-btn" to="/">Go to dashboard</Link>
    </div>
  );
}
