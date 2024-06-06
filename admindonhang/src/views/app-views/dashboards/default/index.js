import React, { useState, useEffect } from "react";
import { Row, Col } from 'antd';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import ChartWidget from 'components/shared-components/ChartWidget';
import {
  VisitorChartData,
  AnnualStatisticData,
} from './DefaultDashboardData';
// import ApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';

// const MembersChart = props => (
//   <ApexChart {...props} />
// )

export const DefaultDashboard = () => {
  const [visitorChartData, setVisitorChartData] = useState([]);
  const [annualStatisticDataResult, setAnnualStatisticDataResult] = useState([]);
  const { direction } = useSelector(state => state.theme)
  useEffect(() => {
    AnnualStatisticData.then(data => {
      setAnnualStatisticDataResult(data);
      
    });
    const fetchData = async () => {
      try {
        const data = await VisitorChartData();
        setVisitorChartData(data);
        
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Row gutter={16}>
            {
              annualStatisticDataResult.map((elm, i) => (
                <Col xs={24} sm={24} md={24} lg={24} xl={6} key={i}>
                  <StatisticWidget
                    title={elm.title}
                    value={elm.value}
                    status={elm.status}
                    subtitle={elm.subtitle}
                  />
                </Col>
              ))
            }
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <ChartWidget
                title="Thống kê doanh thu"
                series={visitorChartData.series}
                xAxis={visitorChartData.categories}
                height={'500px'}
                direction={direction}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}


export default DefaultDashboard;
