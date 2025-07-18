$(document).ready(function() {
    // 获取归档日期
    $.get('/archives', function(data) {
        const $archivePage = $(data);
        const checkInDates = [];

        // 查找所有年份元素
        $archivePage.find('.archive-header.h4').each(function() {
            const currentYear = $(this).text().trim();
            console.log('当前年份:', currentYear);

            // 查找当前年份下的所有 archive-list 元素
            $(this).nextAll('.archive-list').each(function() {
                $(this).find('time').each(function() {
                    const monthDayStr = $(this).text().trim();
                    const [month, day] = monthDayStr.split('-').map(Number);
                    // 创建本地时间的 Date 对象
                    const date = new Date(currentYear, month - 1, day);
                    // 格式化成本地日期字符串
                    const formattedDate = `${currentYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    console.log('原始提取的日期字符串:', formattedDate);
                    if (!isNaN(date.getTime())) {
                        checkInDates.push(formattedDate);
                        console.log('转换后的日期:', formattedDate);
                    } else {
                        console.error('无效的日期:', formattedDate);
                    }
                });
            });
        });

        console.log('最终的打卡日期数组:', checkInDates);
        // 生成日历
        generateCalendar(checkInDates);
    }).fail(function() {
        console.error('获取归档页面失败');
    });

    function generateCalendar(checkInDates) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const calendarContainer = $('#check-in-calendar');
        const calendarHTML = createCalendar(year, month, checkInDates);
        calendarContainer.html(calendarHTML);
    }

    function createCalendar(year, month, checkInDates) {
        const date = new Date(year, month, 1);
        let html = `<div class="calendar-header">${date.toLocaleString('default', { year: 'numeric', month: 'long' })}</div>`;
        html += '<div class="calendar-weekdays">';
        html += '<div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>';
        html += '</div>';
        html += '<div class="calendar-days">';

        // 填充空白
        for (let i = 0; i < date.getDay(); i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        while (date.getMonth() === month) {
            // 格式化成本地日期字符串
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            const isCheckedIn = checkInDates.includes(dateStr);
            console.log('当前日历日期:', dateStr, '是否打卡:', isCheckedIn);
            html += `<div class="calendar-day ${isCheckedIn ? 'checked-in' : ''}">${date.getDate()}</div>`;
            date.setDate(date.getDate() + 1);
        }

        html += '</div>';
        return html;
    }
});
