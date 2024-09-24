import React, { useEffect, useRef } from 'react';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import gantt from 'dhtmlx-gantt';
import { filedCodes, 本地化 } from '../config/AppConfig';

const GanttChart = (records) => {
  const ganttContainer = useRef(null);
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

    // 初始化甘特圖
    gantt.init(ganttContainer.current);

    //////////////////////////////////////////////////////
    //                     彙整資料                     //
    /////////////////////////////////////////////////////

    const data = [];
    if(records.length > 0){
        for(const record of records){
            for(const row of record[filedCodes.採購明細].value){
                data.push({
                    id: data.length,
                    text: row.value[filedCodes.產品代號].value,
                    start_date: record[filedCodes.REQ_Date],
                    duration: 1,
                    //end_date: '2023-08-30',
                    order_type: record[filedCodes.Order選單].value,
                    progress: 1,
                })
            }
        }
    }

    console.log(records);
    console.log(data);



    // 定義任務數據
    const tasks = {
      data: [
        {
            id: 1,
            text: 'P0000',
            start_date: '2023-08-25',
            end_date: '2023-08-30',
            order_type: "採購",
            progress: 0.45,
        },
        {
            id: 2,
            text: 'P0001',
            start_date: '2023-08-28',
            end_date: '2023-08-30',
            order_type: "採購",
            progress: 0.25,
        },
        {
            id: 3,
            text: 'M0002',
            start_date: '2023-08-29',
            end_date: '2023-08-30',
            order_type: "製造",
            progress: 0.5,
        },
        {
            id: 4,
            text: 'M0002:10',
            start_date: '2023-08-25',
            end_date: '2023-08-30',
            order_type: "製造",
            progress: 0.45,
            parent: 3
        },
        {
            id: 5,
            text: 'M0002:20',
            start_date: '2023-08-28',
            end_date: '2023-08-30',
            order_type: "製造",
            progress: 0.25,
            parent: 3
        },
        {
            id: 6,
            text: 'M0002:30',
            start_date: '2023-08-29',
            end_date: '2023-08-30',
            order_type: "製造",
            progress: 0.5,
            parent: 3
        },
        {
            id: 7,
            text: 'M0001',
            start_date: '2023-08-29',
            end_date: '2023-08-30',
            order_type: "製造",
            progress: 0.5,
        },
        {
            id: 8,
            text: 'M0000',
            start_date: '2023-08-29',
            end_date: '2023-08-30',
            order_type: "製造",
            progress: 0.5,
        },
        {
            id: 9,
            text: 'S1-AX100',
            start_date: '2023-08-29',
            end_date: '2023-08-30',
            order_type: "銷售",
            progress: 0.5,
        },
      ],
      links: [
        { id: 1, source: 1, target: 2, type: '0' },
        { id: 2, source: 2, target: 3, type: '0' },
      ],
    };

    gantt.config.columns = [
        { name: 'text', label: '任務名', width: '200', tree: true },
        { name: 'order_type', label: '訂單種類', align: 'center' },
    ];

    // 加載任務數據
    gantt.parse(tasks);

    return () => {
      // 清理甘特圖實例
      gantt.clearAll();
    };
  }, [records]);

  return <div ref={ganttContainer} style={{ width: '100%', height: '500px' }} />;
};

export default GanttChart;
