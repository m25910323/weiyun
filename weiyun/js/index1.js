window.onload=function(){
	//1.根据datas中的数据生成初始界面,初始界面的层级为0;
	var selectAll=document.getElementById('selectAll');									//获取全选按钮
	var menu=document.getElementById('menu');											//获取文件容器
	var list=document.getElementById('list');											//获取文件容器上方按钮栏
	var newFile=list.getElementsByTagName('li')[5];										//获取新建文件夹按钮
	var del=list.getElementsByTagName('li')[4];											//获取删除按钮
	var rename=list.getElementsByTagName('li')[3];										//获取重命名按钮
	var bread=document.getElementById('bread');											//获取面包屑导航
	var menu1=document.getElementById('menu1');											//获取第一种右键菜单
	var menu2=document.getElementById('menu2');											//获取第二种右键菜单
	var mask=document.getElementsByClassName('mask')[0];								//获取拖拽时跟随鼠标移动的div
	var element=[];
	currentPid=0;																		//初始化，页面加载时currentpid为0；
	
	getChildren(0);																		//函数定义在313行
	showBreadcrumb();
	
	
	function createFile(arr){															//创建文件夹并设置事件
		var div=document.createElement('div');											//整个文件夹
		div.setAttribute('class','file');												//初始class为file，
		div.onoff=false;																//自定义开关，初始默认为false，用来判断是否选中
		div.fileId = arr.id;															//自定义属性，值为dates中的id值
		var span=document.createElement('span');										//模拟文件夹左上的checkbox；
		span.setAttribute('class','checkbox');											//设置默认class
		var div1=document.createElement('div');											//放置文件夹图片的div
		div1.setAttribute('class','image image-folder');
		var div2=document.createElement('div');											//放置文件夹名的div
		div2.setAttribute('class','name');
		div2.innerHTML=arr.name;														//文件夹名为dates中的name值
//		var input=document.createElement('input');										//用来替换low逼的重命名弹窗，先不管
//		input.setAttribute('type','txt');
//		element=[];
				
		div.appendChild(span);
		div.appendChild(div1);
		div.appendChild(div2);
//		div.appendChild(input);
		menu.appendChild(div);
		element.push(div);																//element存放新建好的文件夹
		div.onmouseover=function(){														//鼠标移入文件夹框的时候判断是否已经选中
			if(!this.onoff){															//如果没有选中则设置为移入时的样式
				this.className="file file-hover";
			}else{																		//如果选中则保持选中的样式
				this.className="file file-checked";
			}
		}
		div.onmouseout=function(){														//同理鼠标移出文件夹时，如果文件夹没有选中，则还原为默认样式，如果选中则保持选中时的样式
			if(this.onoff){
				this.className="file file-checked";
			}else{
				this.className="file";
			}
		}
		span.onclick=function(e){														//模拟的checkbox的点击事件
			var arr1=[];																//私有arr1，存放已经选中的div
			if(!div.onoff){
				div.className="file file-checked";										//如果div没有被选中，则设置为选中状态
				div.onoff=true;															//设置开关为true，表示已选中
			}else{																		//否则设置div为鼠标移入时的状态，关闭开关，表示此事div未选中
				div.className="file file-hover";
				div.onoff=false;
			}
			for(i=0;i<element.length;i++){												//遍历新建好的文件夹，如果文件夹是选中的，就将这个文件夹存放到arr1中
				if(element[i].onoff){
					arr1.push(element[i]);
				}
			}
			if(arr1.length==element.length){											//判断，如果选中的文件夹的个数和可视区的文件夹个数相同，则表明已全选
				selectAll.className='active';
			}else{
				selectAll.className='';
			}
			rename.onclick=function(){													//点击重命名，如果当前div是选中的，那么弹出输入框，输入的值就是新的文件夹名，同时将dates中的name修改
				if(div.onoff){
					var name = prompt('请输入文件夹的名称');
					div2.innerHTML=arr.name=name;
				}
			}
			e.cancelBubble=true;
		}
		span.onmousedown=function(e){													//为什么取消冒泡？我忘了，反正事件这么多，取消一下没坏处
			e.cancelBubble=true;
		}
		div.onclick=function(e){														//左键点击文件夹事件
			menu.innerHTML="";
			currentPid = this.fileId;
			getChildren(this.fileId);
			showBreadcrumb();
			document.onmousemove=null;
			e.cancelBubble=true;
		}
		div.onmouseup=function(e){														//为什么这么写？忘了
			mask.style.display="none";
			e.cancelBubble=true;
		}
		div.onmousedown=function(e){													//拖拽div时根据选中的文件夹个数生成跟随鼠标移动的小文件夹
			var disX=e.clientX;
			var disY=e.clientY;
			div.onoff=true;
			div.className="file file-checked";
			var arr1=[];																//存放选中的
			var arr2=[];																//存放没有选中的
			console.log(element.length);
			for(i=0;i<element.length;i++){
				if(element[i].onoff){
					arr1.push(element[i]);
				}else{
					arr2.push(element[i]);
				}
				
			}
			console.log(arr1.length);
			
			document.onmousemove=function(e){
//				console.log(arr1.length);
				var odisX=e.clientX;
				var odisY=e.clientY;
				
				
				for(i=0;i<arr1.length;i++){												//根据arr1的长度生成小文件夹的个数
					var smaDiv=document.createElement('div');
					smaDiv.setAttribute('class','image1');
					smaDiv.style.left=5*i+"px";
					smaDiv.style.top=5*i+"px";
					mask.appendChild(smaDiv);
				}
				mask.style.left=odisX+'px';
				mask.style.top=odisY+'px';
				if(odisX-disX==10||odisY-disY==10){
					mask.style.display='block';
				}
//				e.preventDefault();
				return false;
			}
			
			
			document.onmouseup=function(e){												//鼠标松开时的事件
				var ux=e.clientX;														//鼠标松开时的位置
				var uy=e.clientY;
				var a;
				
				for(i=0;i<arr2.length;i++){												//如果松开时的位置在arr2中的div上，即松开时那个位置的div没有被选中			
					if(ux>arr2[i].offsetLeft&&ux<parseFloat(arr2[i].getBoundingClientRect().right)&&uy>arr2[i].offsetTop&&uy<parseFloat(arr2[i].getBoundingClientRect().bottom)){
						a=i;
						break;
					}
				}
				console.log(a,Boolean(a));
				if(a>=0){
					for(i=0;i<arr1.length;i++){
						for(j=0;j<datas.length;j++){
							if(datas[j].id==arr1[i].fileId){
								datas[j].pid=arr2[a].fileId;
							}
						}
					}
				}
				mask.innerHTML='';
//				mask.style.display='none';
				document.onmousemove=null;
				e.cancelBubble=true;
				getChildren(currentPid);
				
			}
			e.cancelBubble=true;
		}
		

		
		//文件右键事件  
//		如果当前文件夹是选中状态并且其他文件夹没有选中，则显示第一种右键菜单menu1
//		如果当前文件夹是选中状态并且还有其他选中的文件夹，则显示第二种右键菜单menu2，区别是右键菜单没有重命名
//		如果当前文件夹是没有选中，选中并显示第一种右键菜单menu1
		div.oncontextmenu=function(e){																		//右键文件夹事件		
			var arr1=[];																					//存放已选中的文件夹
			this.onoff=true;																				//右键之后的文件夹设为选中状态。为什么这么做？因为微云就是这么干的
			this.className="file file-checked";
			for(i=0;i<element.length;i++){																	//选中的文件夹存入arr1中，局部变量，执行完函数即销毁
				if(element[i].onoff){
					arr1.push(element[i]);
				}
			}
			console.log(arr1.length);
			if(this.onoff&&arr1.length==1){																	//这个条件代表只有当前的这个div被选中，那么显示第一种右键菜单
				menu2.style.display="none";
				menu1.style.display="block";
				menu1.style.left=e.clientX+'px';
				menu1.style.top=e.clientY+'px';
			}else if(this.onoff&&arr1.length!=1){															//这个条件代表有多个div被选中，那么显示第二种右键菜单
				menu1.style.display="none";
				menu2.style.display="block";
				menu2.style.left=e.clientX+'px';
				menu2.style.top=e.clientY+'px';
			}else if(!this.onoff){																			//这个条件是？似乎是没必要的，删了应该没问题
				menu2.style.display="none";
				menu1.style.display="block";
				menu1.style.left=e.clientX+'px';
				menu1.style.top=e.clientY+'px';
			}
			document.onmousemove =null;
			
			return false;
//			e.preventDefault();
			e.cancelBubble=true;
			
		}
	}
	
	document.oncontextmenu=function(e){																		//阻止阻止再阻止，别问为什么
//		e.preventDefault();
		return false;
	}
	
	selectAll.onoff=false;																					//全选没啥好说的
	selectAll.onclick=function(e){
		if(!this.onoff){
			for(i=0;i<element.length;i++){
				this.className="active";
				element[i].className="file file-checked";
				element[i].onoff=true;
				this.onoff=true;
			}
		}else{
			for(i=0;i<element.length;i++){
				this.className="";
				element[i].className="file";
				element[i].onoff=false;
				this.onoff=false;
			}
			
		}
		e.cancelBubble=true;
	}
	selectAll.onmouseup=function(e){																		//别问为什么，用心感受
		e.cancelBubble=true;
	}
	newFile.onclick=function(){
		console.log(1);
		var name = prompt('请输入文件夹的名称');
        datas.push({
            id: getMaxId() + 1,
            pid: currentPid,
            name: name,
            type: 'folder'
        });
        getChildren(currentPid);
	}
	bread.onclick = function(e) {
        if (e.target.tagName.toLowerCase() == 'a') {
            currentPid = e.target.getAttribute('fileId');
            getChildren(currentPid);
            showBreadcrumb();
        }
    }
	
	//删除按钮
	//1.获取选中的div  3.移除数据并重新渲染页面
	del.onclick=function(e){
		dele();
		e.cancelBubble=true;
//		e.preventDefault();
		return false;
	};
	
	//拖拽选择
	menu.onmousedown = function(e) {
		menu1.style.display="none";																
		menu2.style.display="none";
		selectAll.className="";
		var arr3=[];																//将所有选中的文件还原到未选中状态、、、、想不通可以用while循环length>0;则div[0].className="..."
		var div=document.getElementsByClassName('file file-checked');
		var a=div.length;
		for(i=0;i<a;i++){
			arr3.push(div[i]);
		}
		for(i=0;i<a;i++){
			arr3[i].className="file";
			arr3[i].onoff=false;
		}
		

		var w = e.clientX;																					//生成拖拽框
		var h = e.clientY;
		var box = document.createElement('div');
		box.className = 'box';
		box.style.left = w + 'px';
		box.style.top = h + 'px';
		document.body.appendChild(box);
	
		document.onmousemove = function(e) {
	
			box.style.width = Math.abs(e.clientX - w) + 'px';
			box.style.height = Math.abs(e.clientY - h) + 'px';
			box.style.left = Math.min(e.clientX, w) + 'px';
			box.style.top = Math.min(e.clientY, h) + 'px';
			
			var allFile=document.getElementsByClassName('file');
			moveSelect(box,allFile);
			
		}
	
		document.onmouseup = function() {
			document.onmousemove = null;
			document.body.removeChild(box);
			box = null;
		}
	
		return false;
	}
	
	function getChildren(id){																				//根据currentpid渲染页面	
		element=[];
		menu.innerHTML="";																					//清空文件夹容器
		var arr=[];																							//私有arr[],遍历datas数组，如果数组项pid属性的值是currentpid，那么将这项推入数组中
		for(i=0;i<datas.length;i++){
			if(datas[i].pid==id){
				arr.push(datas[i]);
			}
		}
		for(i=0;i<arr.length;i++){																			//有多少项就创建多少个文件夹
			createFile(arr[i]);																				//函数定义在第20行
		}
	}
	
	function getChildrens(id){																				//获取子元素，有返回值，函数封装不到位引起的问题
		var arr=[];
		for(i=0;i<datas.length;i++){
			if(datas[i].pid==id){
				arr.push(datas[i]);
			}
		}
		return arr;
	}
	
	function dele(){																						//删除函数
//		var menu=document.getElementById('menu');
		var file=menu.getElementsByClassName('file file-checked');											//获取所有选中文件夹
		console.log(file.length);
		for(i=0;i<file.length;i++){																			//根据选中文件夹的fileid找到dates中的对应id，并删除这一项，然后重新渲染页面
			for(j=0;j<datas.length;j++){
				if(file[i].fileId==datas[j].id){
					console.log(j);
					datas.splice(j,1);
				}
			}
		}
		getChildren(currentPid);
	}
	
	function showBreadcrumb() {
        var parentList = getParents(currentPid);
        if ( getInfo(currentPid) ) {
            parentList.unshift( getInfo(currentPid) );
        }
        var html = "<a fileId=0 href='javascript:;'>微云</a>";
        for (var i=parentList.length-1; i>=0; i--) {
            html += '<a fileId="'+ parentList[i].id +'" href="javascript:;">'+ parentList[i].name +'</a>';
        }
        breadcrumbList.innerHTML = html;
    }
	
	function moveSelect(box,allFile){
		var sW = box.offsetWidth;
		var sH = box.offsetHeight;
		var sT = box.offsetTop;
		var sL = box.offsetLeft;
		
		for(i=0;i<allFile.length;i++){
			allFile[i].oW = allFile[i].offsetWidth;
			allFile[i].oH = allFile[i].offsetHeight;
			allFile[i].oT = allFile[i].offsetTop;
			allFile[i].oL = allFile[i].offsetLeft;
			if( sL + sW < allFile[i].oL || sL > allFile[i].oL + allFile[i].oW || sT + sH < allFile[i].oT || sT > allFile[i].oT + allFile[i].oH ) {
				allFile[i].onoff=false;
				allFile[i].className='file';
			}else{
				allFile[i].onoff=true;
				allFile[i].className='file file-checked';
			}
			
		}
		var arr1=[];																//全选判断，可以封装成函数，然而我懒
		for(i=0;i<element.length;i++){												//遍历新建好的文件夹，如果文件夹是选中的，就将这个文件夹存放到arr1中
			if(element[i].onoff){
				arr1.push(element[i]);
			}
		}
		if(arr1.length==element.length){											//判断，如果选中的文件夹的个数和可视区的文件夹个数相同，则表明已全选
			selectAll.className='active';
		}else{
			selectAll.className='';
		}
	}
	
	function getMaxId() {
	    var maxId = 0;
	    for (var i=0; i<datas.length; i++) {
	        if ( datas[i].id > maxId ) {
	            maxId = datas[i].id;
	        }
	    }
	    return maxId;
	}
	function getInfo(id) {
    for (var i=0; i<datas.length; i++) {
        if (datas[i].id == id) {
            return datas[i];
        }
    }
}

	/*
	* 获取父级
	* */
	function getParent(id) {
	    var info = getInfo(id);
	    if (info) {
	        return getInfo(info.pid);
	    }
	}
	
	/*
	* 获取所有父级
	* */
	function getParents(id) {
	    var arr = [];
	    var parent = getParent(id);
	    if (parent) {
	        arr.push(parent);
	        arr = arr.concat( getParents(parent.id) );
	    }
	    return arr;
	}
	
	/*
	* 找所有子级
	* */ 
	function getAllChildren(id, level) {
	    var arr = [];
	    var level = level || 0;
	    var children = getChildrens(id);
	    console.log(children);
	    for (var i=0; i<children.length; i++) {
	        children[i].level = level;
	        arr.push( children[i] );
	        arr = arr.concat( getAllChildren(children[i].id, level+1) );
	    }
	    return arr;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//页面其他操作
	var contentLeft=document.getElementById('content_left');
	var li=contentLeft.getElementsByTagName('li');
	for(i=0;i<li.length;i++){
		li[i].onclick=function(){
			for(j=0;j<li.length;j++){
				li[j].className="";
			}
			this.className="active";
		}
	}
	
	var tree=document.getElementsByClassName('tree')[0];
	var main=document.getElementsByClassName('main')[0];
	var left_tree=document.getElementById('tree');
	var haha=document.getElementById('haha');
	var mainWidth=main.offsetWidth;
	tree.onoff=false;
//	tree.onclick=function(){
//		if(!this.onoff){
//			left_tree.style.display="block";
//			this.onoff=true;
//			main.className="main fl";
//			var main1=document.getElementsByClassName('main fl')[0];
//			main1.style.width=document.documentElement.clientWidth-contentLeft.offsetWidth-left_tree.offsetWidth-10+'px';
//		}else{
//			left_tree.style.display="none";
//			this.onoff=false;
//			main.className="main";
//			main.style.width=mainWidth+'px';
//		}
//		
//	}
//	Tree(0,haha);
	
	
	function Tree(currentid,obj){
		var childrenAll = getChildrens(currentid);
		
	    for (var i=0; i<childrenAll.length; i++) {
	        var s = 0;
	        var adiv=document.createElement('div');
	        var bdiv=document.createElement('div');
	        var l=document.createElement('l');
	        l.onoff=false;
	        l.mark=childrenAll[i].id;
	        var t=document.createElement('t');
	        t.mark=childrenAll[i].id;
	        bdiv.style.marginLeft=s+'px';
	        t.innerHTML =childrenAll[i].name;
	        bdiv.appendChild(l);
	        bdiv.appendChild(t);
	        adiv.appendChild(bdiv);
	        obj.appendChild(adiv);
	        l.onclick=function(){
	        	if(!this.onoff){
	        		this.style.background="url(img/folder-tree.png) no-repeat 0px -100px";
	        		this.onoff=true;
	        		console.log(this.parentNode.children[1]);
	        		Tree(this.mark,this.parentNode.parentNode);
	        	}else{
	        		this.style.background="url(img/folder-tree.png) no-repeat 0px -52px";
	        		this.onoff=false;
	        	}
	        	
	        }
	    }
	}
}
