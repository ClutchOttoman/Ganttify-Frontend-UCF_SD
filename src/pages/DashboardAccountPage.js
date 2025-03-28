import React from 'react';

import NavBar from '../components/NavBar';
import DashboardAccount from '../components/DashboardAccount';
import DashboardNavBar from '../components/DashboardNavBar';

const DashboardAccountPage = () =>
{
    return(
      <div>
        <NavBar layout={2}/>
        <DashboardNavBar page={<DashboardAccount/>}/>
      </div>
    );
};

export default DashboardAccountPage;
