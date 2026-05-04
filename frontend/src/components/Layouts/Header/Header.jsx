import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Searchbar from './Searchbar';
import logo from '../../../assets/images/logo.png';
import PrimaryDropDownMenu from './PrimaryDropDownMenu';
import SecondaryDropDownMenu from './SecondaryDropDownMenu';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = () => {

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const { cartItems } = useSelector(state => state.cart);

  const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);
  const [toggleSecondaryDropDown, setToggleSecondaryDropDown] = useState(false);

  return (

    <header className="bg-primary-blue fixed top-0 py-2.5 w-full z-10">

      {/* <!-- navbar container --> */}
      <div className="w-full sm:w-9/12 px-2 sm:px-4 m-auto flex justify-between items-center relative">

        {/* <!-- logo & search container --> */}
        <div className="flex items-center flex-1 min-w-0">
          <Link className="h-6 sm:h-7 mr-2 sm:mr-4 flex-shrink-0" to="/">
            <img draggable="false" className="h-full w-full object-contain" src={logo} alt="Flipkart Logo" />
          </Link>

          <div className="flex-1 min-w-0">
            <Searchbar />
          </div>
        </div>
        {/* <!-- logo & search container --> */}

        {/* <!-- right navs --> */}
        <div className="flex items-center justify-between ml-2 sm:ml-0 gap-1 sm:gap-7 relative flex-shrink-0">

          {isAuthenticated === false ?
            <Link to="/login" className="px-2 sm:px-9 py-1 sm:py-0.5 text-xs sm:text-sm text-primary-blue bg-white border font-medium rounded-sm cursor-pointer whitespace-nowrap">Login</Link>
            :
            (
              <span className="userDropDown flex items-center text-white font-medium gap-1 cursor-pointer text-xs sm:text-sm" onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}>
                <span className="truncate max-w-16 sm:max-w-none">{user.name && user.name.split(" ", 1)}</span>
                <span>{togglePrimaryDropDown ? <ExpandLessIcon sx={{ fontSize: "16px" }} /> : <ExpandMoreIcon sx={{ fontSize: "16px" }} />}</span>
              </span>
            )
          }

          {togglePrimaryDropDown && <PrimaryDropDownMenu setTogglePrimaryDropDown={setTogglePrimaryDropDown} user={user} />}

          <span className="moreDropDown hidden lg:flex items-center text-white font-medium gap-1 cursor-pointer" onClick={() => setToggleSecondaryDropDown(!toggleSecondaryDropDown)}>More
            <span>{toggleSecondaryDropDown ? <ExpandLessIcon sx={{ fontSize: "16px" }} /> : <ExpandMoreIcon sx={{ fontSize: "16px" }} />}</span>
          </span>

          {toggleSecondaryDropDown && <SecondaryDropDownMenu />}

          {isAuthenticated && user && user.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1 sm:gap-1.5 bg-white text-primary-blue px-2 sm:px-3 py-1 rounded-sm font-semibold text-xs sm:text-sm whitespace-nowrap hover:bg-blue-50 transition-colors"
            >
              <DashboardIcon sx={{ fontSize: { xs: "14px", sm: "16px" } }} />
              <span>Admin</span>
            </Link>
          )}

          <Link to="/cart" className="flex items-center text-white font-medium gap-1 sm:gap-2 relative text-xs sm:text-sm">
            <span><ShoppingCartIcon sx={{ fontSize: { xs: "18px", sm: "24px" } }} /></span>
            {cartItems.length > 0 &&
              <div className="w-4 h-4 sm:w-5 sm:h-5 p-1 sm:p-2 bg-red-500 text-xs rounded-full absolute -top-1 sm:-top-2 left-2 sm:left-3 flex justify-center items-center border text-white">
                {cartItems.length}
              </div>
            }
            <span className="hidden sm:inline">Cart</span>
          </Link>
        </div>
        {/* <!-- right navs --> */}

      </div>
      {/* <!-- navbar container --> */}
    </header>
  )
};

export default Header;
