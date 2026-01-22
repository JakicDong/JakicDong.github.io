$(document).ready(function() {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let checkInDates = {};

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    function handleThemeChange(e) {
        $('body').toggleClass('dark-mode', e.matches);
        // 重新生成所有打卡表
        generateAllCalendars(checkInDates);
    }
    mediaQuery.addListener(handleThemeChange);
    handleThemeChange(mediaQuery);

    // 获取归档日期和数量
    $.get('/archives', function(data) {
        const $archivePage = $(data);
        checkInDates = {};

        $archivePage.find('.archive-header.h4').each(function() {
            const year = $(this).text().trim();
            $(this).nextAll('.archive-list').find('time').each(function() {
                const [month, day] = $(this).text().trim().split('-');
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                checkInDates[dateStr] = (checkInDates[dateStr] || 0) + 1;
            });
        });

        initAllMonthSelectors();
        generateAllCalendars(checkInDates);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        // 静默处理错误
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
        if (calendarContainer.length === 0) {
            // 容器不存在时静默返回（某些页面可能没有该容器）
            return;
        }
        const calendarHTML = createCalendar(currentYear, currentMonth, checkInDates);
        calendarContainer.html(calendarHTML);
    
        // 修正选择器错误
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
            const archiveCount = checkInDates[dateStr] || 0;
            let className = 'calendar-day';
            if (archiveCount === 1) {
                className += ' single-archive';
            } else if (archiveCount > 1) {
                className += ' multiple-archives';
            }
            // 移除点击事件
            html += `<div class="${className}">${date.getDate()}</div>`;
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

// 初始化年份选择器
function initYearSelector() {
    const yearDropdown = document.getElementById('year-dropdown');
    if (!yearDropdown) {
        return;
    }
    
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) {
            option.selected = true;
        }
        yearDropdown.appendChild(option);
    }
    
    yearDropdown.addEventListener('change', () => {
        const selectedYear = parseInt(yearDropdown.value);
        fetchArchiveDataAndGenerateCalendar(selectedYear);
    });
    
    fetchArchiveDataAndGenerateCalendar(currentYear);
}

// 切换年份
function changeYear(offset) {
    const yearDropdown = document.getElementById('year-dropdown');
    const currentYear = parseInt(yearDropdown.value);
    const newYear = currentYear + offset;

    // 检查新的年份是否在下拉列表范围内
    const options = yearDropdown.options;
    for (let i = 0; i < options.length; i++) {
        if (parseInt(options[i].value) === newYear) {
            yearDropdown.selectedIndex = i;
            // 重新获取归档数据并生成整年打卡表格
            fetchArchiveDataAndGenerateCalendar(newYear);
            break;
        }
    }
}

// 重新获取归档数据并生成整年打卡表格
function fetchArchiveDataAndGenerateCalendar(year) {
    const archiveCountElement = document.getElementById('archive-count');
    if (!archiveCountElement) {
        return;
    }
    archiveCountElement.textContent = '加载中...';

    $.get('/archives', function(data) {
        const $archivePage = $(data);
        checkInDates = {};
        let totalArchiveCount = 0;

        // 从文章链接中提取日期
        $archivePage.find('.archive-list a.post').each(function() {
            const postLink = $(this).attr('href');
            const dateMatch = postLink.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
            if (dateMatch) {
                const archiveYear = dateMatch[1];
                const month = dateMatch[2];
                const day = dateMatch[3];

                const dateStr = `${archiveYear}-${month}-${day}`;
                checkInDates[dateStr] = (checkInDates[dateStr] || 0) + 1;
                totalArchiveCount += 1;
            }
        });

        generateAnnualCalendar(checkInDates);
        archiveCountElement.textContent = totalArchiveCount;
    }).fail(function(jqXHR, textStatus, errorThrown) {
        archiveCountElement.textContent = '获取数据失败';
    });
}

// 生成整年打卡表格
function generateAnnualCalendar(checkInDates) {
    const yearDropdown = document.getElementById('year-dropdown');
    const year = parseInt(yearDropdown.value);
    const annualCalendar = document.getElementById('annual-check-in-calendar');
    annualCalendar.innerHTML = '';

    for (let month = 0; month < 12; month++) {
        const monthElement = document.createElement('div');
        monthElement.className = 'annual-month';

        const monthHeader = document.createElement('div');
        monthHeader.className = 'annual-month-header';
        monthHeader.textContent = new Date(year, month).toLocaleString('default', { month: 'long' });
        monthElement.appendChild(monthHeader);

        const monthWeekdays = document.createElement('div');
        monthWeekdays.className = 'annual-month-weekdays';
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        weekdays.forEach(weekday => {
            const weekdayDiv = document.createElement('div');
            weekdayDiv.textContent = weekday;
            monthWeekdays.appendChild(weekdayDiv);
        });
        monthElement.appendChild(monthWeekdays);

        const monthDays = document.createElement('div');
        monthDays.className = 'annual-month-days';
        const date = new Date(year, month, 1);
        // 填充空白日期
        for (let i = 0; i < date.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'annual-month-day empty';
            monthDays.appendChild(emptyDay);
        }
        while (date.getMonth() === month) {
            const dayElement = document.createElement('div');
            dayElement.className = 'annual-month-day';
            dayElement.textContent = date.getDate();
            const yearStr = date.getFullYear();
            const monthStr = String(date.getMonth() + 1).padStart(2, '0');
            const dayStr = String(date.getDate()).padStart(2, '0');
            const dateStr = `${yearStr}-${monthStr}-${dayStr}`;
            const archiveCount = checkInDates[dateStr] || 0;

            if (archiveCount === 1) {
                dayElement.classList.add('single-archive');
            } else if (archiveCount > 1) {
                dayElement.classList.add('multiple-archives');
            }

            monthDays.appendChild(dayElement);
            date.setDate(date.getDate() + 1);
        }
        monthElement.appendChild(monthDays);

        annualCalendar.appendChild(monthElement);
    }
}



// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 只初始化存在的元素
    if (document.getElementById('year-dropdown')) {
        initYearSelector();
    }
});

const yearDropdown = document.getElementById('year-dropdown');
if (yearDropdown) {
    yearDropdown.addEventListener('change', function() {
        const selectedYear = parseInt(this.value);
        fetchArchiveDataAndGenerateCalendar(selectedYear);
    });
}