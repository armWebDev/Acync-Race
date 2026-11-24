import { NavLink } from 'react-router';
import { ROUTES } from '../constants';

const NAV_ITEMS = [
  { to: ROUTES.garage, label: 'Garage' },
  { to: ROUTES.winners, label: 'Winners' },
] as const;

const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'header__link header__link--active' : 'header__link';

export default function Header() {
  return (
    <header className="header">
      <span className="header__logo">Async Race</span>
      <nav className="header__nav" aria-label="Main">
        {NAV_ITEMS.map(({ to, label }) => (
          <NavLink key={to} to={to} className={getNavLinkClass}>
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
