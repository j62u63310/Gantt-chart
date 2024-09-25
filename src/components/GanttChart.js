import React, { useEffect, useRef } from 'react';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

import gantt from 'dhtmlx-gantt';
import { useSelector } from 'react-redux';
import { fieldCodes, 本地化 } from '../config/AppConfig';
import "../styles/GanttChart.css"

const GanttChart = ({records, orders}) => {
  const ganttContainer = useRef(null);
  const 產品組合資料 = useSelector((state) => state.組合);

  const transform = (records, layer = 1, parentKey = '', parentQuantity = 1) => {
    const flatList = [];

    const processRecords = (records, layer, parentKey, parentQuantity, parentItem) => {
        records.forEach((record, index) => {
            record[fieldCodes.組合品明細表格].value.forEach((row, rowIndex) => {
                const key = layer == 1 ? `${layer}-${rowIndex + 1}` : `${parentKey}-${rowIndex + 1}`;
                const currentQuantity = parentQuantity * row.value[fieldCodes.明細組合數].value; // 計算組合數
                const item = {
                    產品代號: row.value[fieldCodes.子產品代號].value,
                    明細組合數: currentQuantity,
                    母產品: parentItem,
                };
                flatList.push(item);

                const childRecords = 產品組合資料.filter(childRecord =>
                    childRecord[fieldCodes.親產品代號].value === row.value[fieldCodes.子產品代號].value
                );

                if (childRecords.length > 0) {
                    processRecords(childRecords, layer + 1, `${key}`, currentQuantity, row.value[fieldCodes.子產品代號].value);
                }
            });
        });
    };
    processRecords(records, layer, parentKey, parentQuantity, records[0][fieldCodes.親產品代號].value);
    return flatList;
  };

  useEffect(() => {
    //////////////////////////////////////////////////////
    //                     設定                         //
    /////////////////////////////////////////////////////
    // 設定日期格式
    gantt.config.xml_date = '%Y-%m-%d';
    gantt.config.date_format = '%Y-%m-%d';
    gantt.config.date_grid = '%Y年%m月%d日';

    // 設定時間軸單位和格式
    gantt.config.scale_unit = "day";
    gantt.config.date_scale = "%m月%j日";
    gantt.config.subscales = [
      { unit: "month", step: 1, date: "%Y年 %n月" }
    ];

    // 自定義時間軸日期格式
    gantt.templates.scale_date = function(date) {
      return gantt.date.date_to_str("%m月%j日")(date);
    };

    // 自定義任務編輯器中的日期範圍顯示
    gantt.templates.lightbox_header = function(start, end, task) {
      var formatFunc = gantt.date.date_to_str("%Y年%m月%d日");
      return task.text + ", " + formatFunc(start) + " - " + formatFunc(end);
    };

    // 唯讀
    gantt.config.readonly = true;

    //展開全部
    gantt.config.open_tree_initially = true;

    // 設定繁體中文配置
    gantt.locale = 本地化;

    // 顯示任務名稱
    gantt.templates.task_text = function(start, end, task){
      return task.name;
    };

    // 根據訂單種類分類顏色
    gantt.templates.task_class = function(start, end, task){
      switch (task.order_type) {
        case '採購':
          return 'gantt_type_procurement';
        case '外製':
          return 'gantt_type_outsourcing';
        case '製造':
          return 'gantt_type_manufacturing';
        default:
          return '';
      }
    };

    gantt.templates.tooltip_text = function(start, end, task) {
      console.log(task);
      return `<b>產品代號:</b> ${task.text}<br/>
              <b>產品名稱:</b> ${task.name}<br/>
              <b>訂購數量:</b> ${task.quantity}<br/>
              <b>訂單種類:</b> ${task.order_type}<br/>`;
    };

    gantt.config.tooltip_timeout = 0;

    gantt.plugins({ tooltip: true });

    // 初始化甘特圖
    gantt.init(ganttContainer.current);

    //////////////////////////////////////////////////////
    //                     彙整資料                     //
    /////////////////////////////////////////////////////

    const recordData = [];
    const recordLinks = [];
    
    for (const order of orders) {
      const BOM表 = transform(
        產品組合資料.filter(
          (record) => record[fieldCodes.親產品代號].value === order
        )
      );
      BOM表.unshift({
        產品代號: order,
        明細組合數: 1,
        母產品: order,
      });
    
      const parent = {};
    
      // 创建產品代號到数据的映射
      const productCodeToData = {};
    
      for (const record of records) {
        for (const row of record[fieldCodes.採購明細].value) {
          const 產品代號 = row.value[fieldCodes.產品代號].value;
          // 将数据存入映射
          productCodeToData[產品代號] = { record, row };
        }
      }
    
      // 按照BOM表的順序處理
      for (const bomItem of BOM表) {
        const 產品代號 = bomItem[fieldCodes.產品代號];
        const 母產品 = bomItem['母產品']; // 根据实际字段名调整
    
        if (productCodeToData[產品代號]) {
          const { record, row } = productCodeToData[產品代號];
          const 產品名稱 = row.value[fieldCodes.產品名稱].value;
          const 數量 = row.value[fieldCodes.數量].value;
          const REQ_Date = row.value[fieldCodes.REQ_Date].value;
    
          if (!parent[產品代號]) parent[產品代號] = recordData.length + 1;
    
          recordData.push({
            id: recordData.length + 1,
            text: `${產品代號} ${產品名稱}`,
            name: 產品名稱,
            quantity: 數量,
            start_date: REQ_Date,
            duration: 1,
            parent: order === 產品代號 ? "" : parent[母產品],
            order_type: record[fieldCodes.Order選單].value,
            progress: 1,
          });
    
          recordLinks.push({
            id: recordLinks.length + 1,
            source: recordData.length,
            target: order === 產品代號 ? "" : parent[母產品],
            type: '0',
          });
        }
      }
    }
    

    // 定義任務數據
    const tasks = {
      data: recordData,
      links: recordLinks,
    };

    gantt.config.columns = [
      { name: 'text', label: '產品代號', width: 1000, tree: true }, // 使用自動寬度
      { name: 'quantity', label: '訂單數量', width: 100, align: 'center'},
      { name: 'order_type', label: '訂單種類', width: 150, align: 'center' },
    ];

    // 加載任務數據
    gantt.parse(tasks);

    return () => {
      // 清理甘特圖實例
      gantt.clearAll();
    };
  }, [records, 產品組合資料]);

  return <div ref={ganttContainer} style={{ width: '100%', height: '500px' }} />;
};

export default GanttChart;
