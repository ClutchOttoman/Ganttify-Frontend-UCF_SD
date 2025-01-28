import React from 'react';
import NavBar from '../components/NavBar';
import DashboardNavBar from '../components/DashboardNavBar';
import DashboardChartsSearch from '../components/DashboardChartsSearch'
import '../components/DashboardCharts.css';

const DashboardChartsPage = () =>
{
    return(
      <div>
        <NavBar layout={2}/>
        <DashboardNavBar/>
        <div class = "container mainContainer mx-0 px-0 mt-5 pt-5">
                <DashboardChartsSearch/>
        </div>
      </div>
    );
};

export default DashboardChartsPage;
