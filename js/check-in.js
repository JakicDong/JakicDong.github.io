$(document).ready(function() {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let checkInDates = [];

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    function handleThemeChange(e) {
        $('body').toggleClass('dark-mode', e.matches);
        // 重新生成所有打卡表
        generateAllCalendars(checkInDates);
    }
    mediaQuery.addListener(handleThemeChange);
    handleThemeChange(mediaQuery);

    // 获取归档日期
    $.get('/archives', function(data) {
        const $archivePage = $(data);
        checkInDates = [];

        $archivePage.find('.archive-header.h4').each(function() {
            const year = $(this).text().trim();
            $(this).nextAll('.archive-list').find('time').each(function() {
                const [month, day] = $(this).text().trim().split('-');
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                checkInDates.push(dateStr);
            });
        });

        initAllMonthSelectors();
        generateAllCalendars(checkInDates);
    }).fail(function() {
        console.error('获取归档页面失败');
    });

    function initAllMonthSelectors() {
        // 初始化主页面打卡表的月份选择器
        initMonthSelector('#check-in-calendar');
        // 初始化侧边栏打卡表的月份选择器
        initMonthSelector('#sidebar-check-in-calendar');
    }

    function initMonthSelector(containerId) {
        const monthSelector = $(`${containerId} .month-selector`);
        const months = [
            '一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ];

        let selectHTML = '<select id="month-dropdown">';
        months.forEach((month, index) => {
            selectHTML += `<option value="${index}" ${index === currentMonth ? 'selected' : ''}>${month} ${currentYear}</option>`;
        });
        selectHTML += '</select>';

        monthSelector.html(selectHTML);

        $(`${containerId} #month-dropdown`).on('change', function() {
            currentMonth = parseInt($(this).val());
            generateAllCalendars(checkInDates);
        });
    }

    function generateAllCalendars(checkInDates) {
        // 生成主页面打卡表
        generateCalendar('#check-in-calendar', checkInDates);
        // 生成侧边栏打卡表
        generateCalendar('#sidebar-check-in-calendar', checkInDates);
    }

    function generateCalendar(containerId, checkInDates) {
        const calendarContainer = $(containerId);
        const calendarHTML = createCalendar(currentYear, currentMonth, checkInDates);
        calendarContainer.html(calendarHTML);

        // 更新月份选择器的年份
        $(`${containerId} #month-dropdown option`).each(function() {
            const optionText = $(this).text().split(' ')[0];
            $(this).text(`${optionText} ${currentYear}`);
        });
    }

    function createCalendar(year, month, checkInDates) {
        const date = new Date(year, month, 1);
        let html = `
            <div class="calendar-header">
                <button id="prev-month">&lt;</button>
                <span>${date.toLocaleString('default', { year: 'numeric', month: 'long' })}</span>
                <button id="next-month">&gt;</button>
            </div>
            <div class="calendar-weekdays">
                <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
            </div>
            <div class="calendar-days">
        `;

        // 填充空白
        for (let i = 0; i < date.getDay(); i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        while (date.getMonth() === month) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            const isCheckedIn = checkInDates.includes(dateStr);
            html += `<div class="calendar-day ${isCheckedIn ? 'checked-in' : ''}">${date.getDate()}</div>`;
            date.setDate(date.getDate() + 1);
        }

        html += '</div>';

        // 添加月份选择器
        html = `<div class="month-selector" id="month-selector"></div>` + html;

        return html;
    }

    // 月份切换按钮事件
    $(document).on('click', '#prev-month', function() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        generateAllCalendars(checkInDates);
    });

    $(document).on('click', '#next-month', function() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        generateAllCalendars(checkInDates);
    });
});
