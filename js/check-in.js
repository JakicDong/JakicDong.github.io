$(document).ready(function() {
    // 假设归档页面路径为 /archives，可按需调整
    $.get('/archives', function(data) {
        const $archivePage = $(data);
        const dates = [];

        // 提取归档日期，需根据实际 HTML 结构调整选择器
        $archivePage.find('.archive-year-wrap .archive-date').each(function() {
            const date = $(this).text().trim();
            dates.push(date);
        });

        // 填充打卡墙
        const $checkInDates = $('#check-in-dates');
        dates.forEach(function(date) {
            const $dateDiv = $('<div class="check-in-date"></div>').text(date);
            $checkInDates.append($dateDiv);
        });
    });
});
