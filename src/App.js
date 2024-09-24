import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import GanttChart from './components/GanttChart';
import { fetchAllData, fetchOrder } from './service/peocess';
import { fieldCodes, appId } from './config/AppConfig';

const { Option } = Select;

const App = () => {

  const dispatch = useDispatch();
  const 單據 = useSelector((state) => state.單據);
  const [order, setOrder] = useState([]);
  const [orderRecord, setOrderRecord] = useState([]);

  const handleSelectChange = async (value) => {
    const record = JSON.parse(value);
    const 訂購明細 = record[fieldCodes.訂購明細].value;
    const Plan表格 = record[fieldCodes.Plan表格].value;
    const ids = [];
    const orders = [];
    for (const row of 訂購明細){
      orders.push(row.value[fieldCodes.產品代號].value);
    }
    for (const row of Plan表格) {
      ids.push(row.value[fieldCodes.Plan_Order].value);
    }
    setOrder(orders);
    setOrderRecord(await fetchOrder(`記錄號碼 in ("${ids.join('", "')}")`));
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
              <Option value={JSON.stringify(record)}>{record[fieldCodes.訂購單號].value}</Option>
            ))}
          </Select>
        </div>
      );
    }
  }, [單據]);

  useEffect(() => {
    dispatch(fetchAllData(kintone.app.getId(), 'SET_單據_DATA'))
    dispatch(fetchAllData(appId.組合AppId, 'SET_組合_DATA'))
  }, [dispatch]);

  return (
    <div>
      <GanttChart records = {orderRecord} orders = {order}/>
    </div>
  );
};

export default App;
