 

import './Maintenance.css';
import { Link } from 'react-router-dom';

const Maintenance = () => {
  return (
    <>
      <div className="maintenance-wrapper">
        <div className="maintenance-container">
          <div className="maintenance-text">
            <span><i className='bx bxs-traffic-barrier'></i></span>
            <br />
            Sorry, This page are under maintenance
          </div>
          <div className="maintenance-text-sentences">
            <p>Please stay tune for more upcoming features of this system</p>
            <p>
              <Link to="/orders">Return to Home</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Maintenance;
