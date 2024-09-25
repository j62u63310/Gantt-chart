export const 本地化 = {
    date: {
        month_full: [
          '一月', '二月', '三月', '四月', '五月', '六月',
          '七月', '八月', '九月', '十月', '十一月', '十二月'
        ],
        month_short: [
          '1月', '2月', '3月', '4月', '5月', '6月',
          '7月', '8月', '9月', '10月', '11月', '12月'
        ],
        day_full: [
          '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'
        ],
        day_short: [
          '週日', '週一', '週二', '週三', '週四', '週五', '週六'
        ],
        date_format: "%Y年%m月%d日",
        date_format_full: "%Y年%m月%d日 %H:%i"
      },
      labels: {
        // 完整的標籤配置
        new_task: '新任務',
        icon_save: '保存',
        icon_cancel: '取消',
        icon_details: '詳情',
        icon_edit: '編輯',
        icon_delete: '刪除',
        confirm_closing: '', // 取消修改?
        confirm_deleting: '是否刪除任務？',
        section_description: '描述',
        section_time: '時間範圍',
        section_type: '類型',

        /* grid columns */
        column_text: '任務名',
        column_start_date: '開始時間',
        column_duration: '持續時間',
        column_add: '',

        /* link confirmation */
        link: '連結',
        confirm_link_deleting: '將被刪除',
        link_start: '（開始）',
        link_end: '（結束）',

        type_task: '任務',
        type_project: '項目',
        type_milestone: '里程碑',

        minutes: '分鐘',
        hours: '小時',
        days: '天',
        weeks: '週',
        months: '月',
        years: '年',

        /* message popup */
        message_ok: '確定',
        message_cancel: '取消',
    },
}

export const fieldCodes = {
    訂購單號: '訂購單號',
    訂購明細: '訂購明細',
    產品代號: '產品代號',
    Plan表格: 'Plan表格',
    Plan_Order: 'Plan_Order',

    REQ_Date: 'REQ_Date',
    Order選單: 'Order選單',
    採購明細: '採購明細',
    產品代號: '產品代號',
    產品名稱: '產品名稱',
    數量: '數量',

    組合品明細表格: '組合品明細表格',
    親產品代號: '親產品代號',
    子產品代號: '子產品代號',
    明細組合數: '明細組合數',
}

export const appId = {
    planOrderAppId: 110,
    組合AppId: 88,
};