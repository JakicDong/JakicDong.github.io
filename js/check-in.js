$(document).ready(function() {
    // 获取归档日期
    $.get('/archives', function(data) {
        const $archivePage = $(data);
        const checkInDates = [];

        // 提取归档日期，需根据实际 HTML 结构调整选择器
        $archivePage.find('.archive-date').each(function() {
            const dateStr = $(this).text().trim();
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                checkInDates.push(date.toISOString().split('T')[0]);
            }
        });

        // 生成日历
        generateCalendar(checkInDates);
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
            const dateStr = date.toISOString().split('T')[0];
            const isCheckedIn = checkInDates.includes(dateStr);
            html += `<div class="calendar-day ${isCheckedIn ? 'checked-in' : ''}">${date.getDate()}</div>`;
            date.setDate(date.getDate() + 1);
        }

        html += '</div>';
        return html;
    }
});
