import React from 'react';

import NavBar from '../components/NavBar';
import DashboardToDo from '../components/DashboardToDo';
import DashboardNavBar from '../components/DashboardNavBar';

const DashboardPage = () =>
{
    return(
      <div>
        <NavBar layout={2}/>
        <DashboardNavBar page={<DashboardToDo/>}/>
      </div>
    );
};

export default DashboardPage;
