// script.js
function get_elements(){
	colors=['#9BE9A8','#3FC463','#31A14E','#216E39']
	// 获取 DOM 元素
	p= document.getElementsByClassName('site-body')[0];//前面什么都没加const var的为全局变量
	together=document.createElement('div');
	together.classList.add('together');
	p.appendChild(together);
	console.log(together);

	inline=document.createElement('div');
	inline.id='header';
	together.appendChild(inline);
	
	title=document.getElementsByClassName('c_title')[0];
	if (title===undefined){//==会进行类型转换 ===不会
	  title=document.createElement('span');
	  title.textContent='Contribution';
	  title.classList.add('c_title');
	  together.appendChild(title);
	}
	label=document.getElementsByClassName('c_label')[0];
	if(label===undefined){
	  label=document.createElement('label');
	  label.textContent='Select Year:';
	  label.classList.add('c_label')
	  together.appendChild(label);
	}
	yearSelect=document.getElementsByClassName('year-select')[0];
	if(yearSelect===undefined){
	  yearSelect = document.createElement('select');
	  yearSelect.classList.add('year-select');
	  together.appendChild(yearSelect);
	}
	cpright=document.getElementsByClassName('cpright')[0];
	if (cpright===undefined){//==会进行类型转换 ===不会
	  cpright=document.createElement('span');
	  cpright.textContent='by Yoyo';
	  cpright.classList.add('cpright');
	  together.appendChild(cpright);
	}
	inline.appendChild(title);
	inline.appendChild(label);
	inline.appendChild(yearSelect);
	inline.appendChild(cpright);

	month_float=document.getElementsByClassName('month_float')[0];
	if(month_float===undefined){
		month_float = document.createElement('div');
		month_float.classList.add('month_float');
		together.appendChild(month_float);//添加一个新的类名
	}

	calendarElement=document.getElementsByClassName('calendar')[0];
	if(calendarElement===undefined){
	  calendarElement = document.createElement('div');
	  calendarElement.classList.add('calendar');
	  together.appendChild(calendarElement);
	}

	lessmore=document.getElementsByClassName('lessmore')[0];
	if(lessmore===undefined){
	  lessmore = document.createElement('p');
	  lessmore.classList.add('lessmore');
	  together.appendChild(lessmore);
	  lessmore.innerHTML="less<div id='desc_blocks'></div>more";
	  desc_blocks=document.getElementById('desc_blocks');
	  for(let i=0;i<4;i++){
		let item=document.createElement('div');
		item.classList.add('desc_blocks_item');
		item.style.backgroundColor=colors[i];
		desc_blocks.appendChild(item);
	  }
	}

	fireworks=document.getElementsByClassName('fireworks')[0];
	if(fireworks===undefined){
	  fireworks = document.createElement('div');
	  fireworks.classList.add('fireworks');
	  together.appendChild(fireworks);
	}
	
  }
  
  // 渲染年份选择器
  function renderYearSelect(currentYear) {
	for (let i = currentYear - 5; i <= currentYear; i++) {
	  const option = document.createElement('option');
	  option.value = i;
	  option.text = i;
	  yearSelect.appendChild(option);
	}
	yearSelect.value = currentYear; // 默认选中当前年份
  }
  
  // 获取某个年份每个月的天数
  function getDaysInMonth(month, year) {
	const date = new Date(year, month + 1, 0);/*当月最后一天 */
	//console.log(date.getDate());/*返回最后一天的日号 */
	return date.getDate();
  }
  function padStart2_0(num){
	return String(num).padStart(2,'0');
  }
    // 生成随机颜色
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

  // 渲染打卡墙
  function renderCalendar(year=currentYear) {
	
	  const daytip = document.createElement('div');
	  daytip.classList.add('tooltip');
	  together.appendChild(daytip);
	  calendarElement.innerHTML = ''; // 清空之前的内容
	  month_text=['Jan','↓','Dec']
	  for (let month = 0; month < 12; month++) {
		const monthContainer = document.createElement('div');
		monthContainer.classList.add('month-container');//添加一个新的类名
		 if(month_float.children.length<3){
			// 添加月份头部
			const monthHeader = document.createElement('div');
			monthHeader.classList.add('month-header');
			monthHeader.textContent = month_text[month];
			month_float.appendChild(monthHeader);
		 }
		  
		  // 渲染每个月的打卡格子
		  const daysInMonth = getDaysInMonth(month, year);
		  for (let day = 1; day <= daysInMonth; day++) {
			  const dayElement = document.createElement('div');
			  dayElement.classList.add('grid-item');
			  //dayElement.textContent = day;
			  dayElement.setAttribute('block_date',`${year}-${padStart2_0(month+1)}-${padStart2_0(day)}`);
			  monthContainer.appendChild(dayElement);
  
			  // 检查是否已打卡
			  let thisday=`${year}-${padStart2_0(month+1)}-${padStart2_0(day)}`;
			  if (thisday in checkedDays) {
				  dayElement.classList.add('checked');
				  switch (checkedDays[thisday]){
					case 1:
						dayElement.style.backgroundColor=colors[0];
						break;
					case 2:
						dayElement.style.backgroundColor=colors[1];
						break;
					case 3:
						dayElement.style.backgroundColor=colors[2];
						break;
					default:
						dayElement.style.backgroundColor=colors[3];
				  }
			  } else {
				  dayElement.classList.add('unchecked');
			  }
  
			  // 点击格子打卡
			  dayElement.addEventListener('click', (event) => {
				const rect = event.target.getBoundingClientRect();
				
				let numParticles = 10; // 粒子的数量
				container=document.getElementsByClassName('fireworks')[0];
				for (let i = 0; i < numParticles; i++) {
					let firework = document.createElement('div');
					firework.classList.add('firework');
			
					// 随机设置颜色
					let color = getRandomColor();
					firework.style.backgroundColor = color;
					firework.style.position = 'absolute';
					const centerX=`${rect.left + scrollX}`;
					const centerY=`${rect.top+ scrollY-210}`; //rect.top+ scrollY才是元素的绝对位置 相对于整个网页的坐标
					console.log(rect.top,centerY)
					// 设置烟花的初始位置为点击位置
					container.style.left = centerX+'px';
					container.style.top =centerY+'px';
					firework.style.left = `0px`;
					firework.style.top =  `0vh`;
					firework.style.width = '0.3vw';
					firework.style.height = '0.3vw';
					let factor=0.5
					if(innerWidth<700){
						firework.style.width = '1vw';
						firework.style.height = '1vw';
						factor=1
					}
					
					firework.style.zIndex='10';
					firework.style.display='block';
					console.log(Math.PI/180)
					const angle=(Math.PI/180)*(i+1)*(360/10);
					// 计算目标点的坐标
					const x = Math.cos(angle) * factor;
					const y = Math.sin(angle) * factor;
					console.log(angle,x,y,centerX,centerY);
					 // 使用 transform 来计算并设置粒子的位置
					firework.style.transform = `translate(${x}vw, ${y}vw)`;
					// 设置烟花的飞行方向
					// firework.style.animationName = 'explode';
					// firework.style.animationTimingFunction = 'ease-out';
					//console.log(firework)
					
					container.appendChild(firework);
					console.log(firework.style.transform);
					// 或者使用这种方法触发样式更新
					container.style.display = 'none';
					container.offsetHeight;  // 强制浏览器重绘
					container.style.display = 'block';
					//清理：动画结束后移除烟花元素
					// firework.addEventListener('animationend', function() {
					// 	firework.remove();
					// });
				}
			  });
		  }
		  
		  calendarElement.appendChild(monthContainer);
	}
	//console.log(month_float);
	func_tooltip();
  }
  
  // 获取本地存储的打卡日期
  // function getCheckedDays() {
  //   const checkedDays = JSON.parse(localStorage.getItem('checkedDays')) || [];
  //   func_tooltip();
  //   return checkedDays;
  // }
  
  // // 更新本地存储中的打卡日期
  // function updateCheckedDays(checkedDays) {
  //   console.log(hexo.locals.get("posts"));
  //   localStorage.setItem('checkedDays', JSON.stringify(checkedDays));
  // }
  
  // 取消切换打卡状态
  //烟花
  //function toggleCheckIn(year, month, day) {
    // const checkedDays = getCheckedDays();
    // const dayString = `${year}-${month}-${day}`;
  
    // // 如果已打卡，则移除
    // if (checkedDays.includes(dayString)) {
    //   const index = checkedDays.indexOf(dayString);
    //   checkedDays.splice(index, 1);
    // } else {
    //   // 否则，添加打卡
    //   checkedDays.push(dayString);
    // }
  
    // updateCheckedDays(checkedDays);
    // renderCalendar(year);  // 重新渲染
	
  //}
  
  function func_tooltip(){
	  // 获取所有的日期块
	const dateBlocks = document.querySelectorAll('.grid-item');
	dateBlocks.forEach(block =>{
		block.addEventListener('mouseenter', (e) => {
		// 获取data-date属性的值
		const date = e.target.getAttribute('block_date');
		daytip=document.getElementsByClassName('tooltip')[0];
		daytip.textContent=date;
		// 获取日期块的位置，定位 tooltip
		const rect = e.target.getBoundingClientRect();
		//console.log(date,daytip,rect);
		daytip.style.position='absolute';
		//console.log(block,scrollX);
		daytip.style.left=`${rect.left + scrollX-30}px`;
		daytip.style.top=`${rect.top+scrollY -260}px`;
		daytip.style.display='block';
		
		})
		// 当鼠标离开时隐藏 tooltip
	  block.addEventListener('mouseleave', () => {
		daytip.style.display = 'none';
	  });
	});
  }

  function all(){
	//这里插入checkedDays变量
	checkedDays = {"2025-06-10":4,"2025-07-11":2,"2025-08-05":2,"2025-08-04":2,"2025-07-24":4,"2025-06-06":2,"2025-06-08":2,"2025-06-09":3,"2025-06-05":4,"2025-07-08":3,"2025-08-07":2,"2025-07-21":3,"2025-07-31":2,"2025-07-13":3,"2025-06-11":2,"2025-06-12":1,"2025-06-13":1,"2025-06-15":1,"2025-06-16":1,"2025-06-17":1,"2025-06-18":1,"2025-06-19":1,"2025-06-20":2,"2025-06-22":1,"2025-06-23":4,"2025-06-24":2,"2025-06-25":1,"2025-06-26":1,"2025-06-21":1,"2025-06-27":1,"2025-06-28":1,"2025-06-29":1,"2025-06-04":1,"2025-07-10":1,"2025-07-09":1,"2025-07-14":1,"2025-07-15":1,"2025-07-17":1,"2025-07-16":1,"2025-07-18":1,"2025-06-30":1,"2025-07-19":1,"2025-07-20":1,"2025-07-22":1,"2025-07-23":1,"2025-07-25":1,"2025-07-28":1,"2025-07-27":1,"2025-07-29":2,"2025-07-30":1,"2025-07-03":1,"2025-07-04":1,"2025-07-02":1,"2025-07-06":1,"2025-07-07":1,"2025-08-10":1,"2025-08-11":1,"2025-08-12":1,"2025-08-19":1,"2025-08-26":1,"2025-08-01":1,"2025-08-03":2,"2025-08-29":2,"2025-08-06":1,"2025-08-31":1,"2025-08-08":1,"2025-09-01":1,"2025-09-02":1,"2025-09-05":1,"2025-09-07":2,"2025-06-01":1,"2025-05-31":2,"2025-09-08":1,"2025-06-03":1};
	currentYear=new Date().getFullYear();
	//默认今年
	get_elements();
	// 初始化年份选择器和打卡墙
	renderYearSelect(currentYear);
	// 监听年份选择变化
	yearSelect.addEventListener('change', (event) => {
	  const selectedYear = event.target.value;
	  console.log(event)
	  renderCalendar(selectedYear);  // 根据选择的年份渲染打卡墙
	});
	renderCalendar();
  }
  
  document.addEventListener('DOMContentLoaded', function() {
	// DOM 渲染完成后执行的代码
	console.log('DOM已完全加载，可以执行 JS 文件');
	let link=document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = './style.css';  // CSS 文件的路径
	// 将 <link> 标签添加到 <head> 中
	document.head.appendChild(link);
	all();
  });

