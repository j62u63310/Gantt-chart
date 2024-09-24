import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import GanttChart from './components/GanttChart';
import { fetchAllData, fetchOrder } from './service/peocess';
import { filedCodes } from './config/AppConfig';

const { Option } = Select;

const App = () => {

  const dispatch = useDispatch();
  const 單據 = useSelector((state) => state.單據);
  const [order, setOrder] = useState([]);

  const handleSelectChange = async (value) => {
    const record = JSON.parse(value);
    const Plan表格 = record[filedCodes.Plan表格].value;
    const ids = [];
    for (const row of Plan表格) {
      ids.push(row.value[filedCodes.Plan_Order].value);
    }
    setOrder(await fetchOrder(`記錄號碼 in ("${ids.join('", "')}")`));
  };

  useEffect(() => {
    const headerMenuSpace = kintone.app.getHeaderMenuSpaceElement();
    if (headerMenuSpace) {
      const root = ReactDOM.createRoot(headerMenuSpace);
      root.render(
        <div className="select-container">
          <Select
            defaultValue=""
            style={{ width: 200 }}
            onChange={handleSelectChange}
          >
            {單據.map((record, index) => (
              <Option value={JSON.stringify(record)}>{record[filedCodes.訂購單號].value}</Option>
            ))}
          </Select>
        </div>
      );
    }
  }, [單據]);

  useEffect(() => {
    dispatch(fetchAllData(kintone.app.getId()))
  }, [dispatch]);

  return (
    <div>
      <GanttChart records = {order}/>
    </div>
  );
};

export default App;
