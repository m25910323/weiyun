window.onload=function(){
	function Init(){
		_this=this;
		this.selectAll=document.getElementById('selectAll');									//获取全选按钮
		this.menu=document.getElementById('menu');												//获取文件容器
		this.list=document.getElementById('list');												//获取文件容器上方按钮栏
		this.newFile=list.getElementsByTagName('li')[5];										//获取新建文件夹按钮
		this.del=list.getElementsByTagName('li')[4];											//获取删除按钮
		this.rename=list.getElementsByTagName('li')[3];											//获取重命名按钮
		this.bread=document.getElementById('bread');											//获取面包屑导航
		this.menu1=document.getElementById('menu1');											//获取第一种右键菜单
		this.menu2=document.getElementById('menu2');											//获取第二种右键菜单
		this.mask=document.getElementsByClassName('mask')[0];									//获取拖拽时跟随鼠标移动的div
		this.element=[];
		currentPid=0;
	}
	function newSingleFile(arr){
		that=this;
		this.div=document.createElement('div');													//整个文件夹
		this.div.setAttribute('class','file');													//初始class为file，
		this.div.onoff=false;																	//自定义开关，初始默认为false，用来判断是否选中
		this.div.fileId = arr.id;																//自定义属性，值为dates中的id值
//		console.log(this.div.fileId);
		this.span=document.createElement('span');												//模拟文件夹左上的checkbox；
		this.span.setAttribute('class','checkbox');												//设置默认class
		this.div1=document.createElement('div');												//放置文件夹图片的div
		this.div1.setAttribute('class','image image-folder');
		this.div2=document.createElement('div');												//放置文件夹名的div
		this.div2.setAttribute('class','name');
		this.div2.innerHTML=arr.name;															//文件夹名为dates中的name值
//		var input=document.createElement('input');												//用来替换low逼的重命名弹窗，先不管
//		input.setAttribute('type','txt');
//		element=[];
		this.div.appendChild(this.span);
		this.div.appendChild(this.div1);
		this.div.appendChild(this.div2);
//		div.appendChild(input);
		_this.menu.appendChild(this.div);
		_this.element.push(this.div);																//element存放新建好的文件夹
		(function addevent(obj,txt){
			that.createFile(obj,txt);
		})(this.div,this.div2);
	}
	
	newSingleFile.prototype.createFile=function(obj,txt){											//创建文件夹并设置事件
		that=this;
		obj.onmouseover=function(){																	//鼠标移入文件夹框的时候判断是否已经选中
			that.divMouseover(this);
		}
		obj.onmouseout=function(){																	//同理鼠标移出文件夹时，如果文件夹没有选中，则还原为默认样式，如果选中则保持选中时的样式
			that.divMouseout(this);
		}
		this.span.onclick=function(e){																//模拟的checkbox的点击事件
			that.spanClick(e,obj,txt);
		}
		this.span.onmousedown=function(e){													
			e.cancelBubble=true;
		}
		obj.onclick=function(e){																	//左键点击文件夹事件
			_this.menu.innerHTML="";
			currentPid = this.fileId;
			_this.getChildren(this.fileId);
			that.showBreadcrumb();
			document.onmousemove=null;
			e.cancelBubble=true;
		}
		obj.onmouseup=function(e){														
			_this.mask.style.display="none";
			e.cancelBubble=true;
		}
		obj.onmousedown=function(e){																//拖拽div时根据选中的文件夹个数生成跟随鼠标移动的小文件夹
			that.smallFile(e,obj);
		}
		
//		文件右键事件  
//		如果当前文件夹是选中状态并且其他文件夹没有选中，则显示第一种右键菜单menu1
//		如果当前文件夹是选中状态并且还有其他选中的文件夹，则显示第二种右键菜单menu2，区别是右键菜单没有重命名
//		如果当前文件夹是没有选中，选中并显示第一种右键菜单menu1
		obj.oncontextmenu=function(e){																			//右键文件夹事件
			that.Contextmenu(e);
		}
	}
	
	document.oncontextmenu=function(e){																			
//		e.preventDefault();
		return false;
	}
	
	newSingleFile.prototype.newfile=function(){
		_this.newFile.onclick=function(){
			console.log(1);
			this.name = prompt('请输入文件夹的名称');
	        datas.push({
	            id: _this.getMaxId() + 1,
	            pid: currentPid,
	            name: this.name,
	            type: 'folder'
	        });
	        _this.getChildren(currentPid);
		}
	}
	
	//	//删除按钮
	//	//1.获取选中的div  3.移除数据并重新渲染页面
	newSingleFile.prototype.delet=function(){
		that=this;
		_this.del.onclick=function(e){
			console.log(1);
			that.dele();
			e.cancelBubble=true;
	//		e.preventDefault();
			return false;
		};
	}
	//拖拽选择
	newSingleFile.prototype.Drag=function(){
		_this.menu.onmousedown = function(e) {
			_this_=this;
			_this.menu1.style.display="none";																
			_this.menu2.style.display="none";
			_this.selectAll.className="";
			this.arr3=[];																						//将所有选中的文件还原到未选中状态、、、、想不通可以用while循环length>0;则div[0].className="..."
			this.div=document.getElementsByClassName('file file-checked');
			this.a=this.div.length;
			for(i=0;i<this.a;i++){
				this.arr3.push(this.div[i]);
			}
			for(i=0;i<this.a;i++){
				this.arr3[i].className="file";
				this.arr3[i].onoff=false;
			}
			this.w = e.clientX;																			//生成拖拽框
			this.h = e.clientY;
			this.box = document.createElement('div');
			this.box.className = 'box';
			this.box.style.left = this.w + 'px';
			this.box.style.top = this.h + 'px';
			document.body.appendChild(this.box);
			document.onmousemove = function(e) {
				_this_.box.style.width = Math.abs(e.clientX - _this_.w) + 'px';
				_this_.box.style.height = Math.abs(e.clientY - _this_.h) + 'px';
				_this_.box.style.left = Math.min(e.clientX, _this_.w) + 'px';
				_this_.box.style.top = Math.min(e.clientY, _this_.h) + 'px';
				this.allFile=document.getElementsByClassName('file');
				that.moveSelect(_this_.box,this.allFile);
			}
			document.onmouseup = function() {
				document.onmousemove = null;
				document.body.removeChild(_this_.box);
				_this_.box = null;
			}
			return false;
		}
	}
	
	Init.prototype.getChildrens=function(id){															//获取子元素，有返回值，函数封装不到位引起的问题
		this.arr=[];
		for(i=0;i<datas.length;i++){
			if(datas[i].pid==id){
				this.arr.push(datas[i]);
			}
		}
		return this.arr;
	}
	
	Init.prototype.getMaxId=function() {
	    this.maxId = 0;
	    for (var i=0; i<datas.length; i++) {
	        if ( datas[i].id > this.maxId ) {
	            this.maxId = datas[i].id;
	        }
	    }
	    return this.maxId;
	}
	
	Init.prototype.getInfo=function(id) {
		for (var i=0; i<datas.length; i++) {
			if (datas[i].id == id) {
				return datas[i];
			}
		}
	}
	
	Init.prototype.getChildren=function(id){
		this.element=[];
		this.menu.innerHTML="";																					//清空文件夹容器
		this.arr=[];																							//私有arr[],遍历datas数组，如果数组项pid属性的值是currentpid，那么将这项推入数组中
		for(i=0;i<datas.length;i++){
			if(datas[i].pid==id){
				this.arr.push(datas[i]);
			}
		}
		for(i=0;i<this.arr.length;i++){																			//有多少项就创建多少个文件夹
			var nf=new newSingleFile(this.arr[i]);
//			that.createFile(this.arr[i]);																		//函数定义在第20行
		}
	}
	
	/*
	* 获取父级
	* */
	Init.prototype.getParent=function(id) {
	    this.info = this.getInfo(id);
	    if (this.info) {
	        return this.getInfo(this.info.pid);
	    }
	}
	
	/*
	* 获取所有父级
	* */
	Init.prototype.getParents=function(id) {
		this.arr = [];
		this.parent = this.getParent(id);
	    if (this.parent) {
	        this.arr.push(this.parent);
	        this.arr = this.arr.concat( this.getParents(this.parent.id) );
	    }
	    return this.arr;
	}
	
	/*
	* 找所有子级
	* */ 
	Init.prototype.getAllChildren=function(id, level) {
	    this.arr = [];
	    this.level = level || 0;
	    this.children = getChildrens(id);
//	    console.log(children);
	    for (var i=0; i<this.children.length; i++) {
	        this.children[i].level = this.level;
	        this.arr.push( this.children[i] );
	        this.arr = this.arr.concat( this.getAllChildren(this.children[i].id, this.level+1) );
	    }
	    return this.arr;
	}
	
	newSingleFile.prototype.divMouseover=function(obj){
		if(!obj.onoff){																//如果没有选中则设置为移入时的样式
			obj.className="file file-hover";
		}else{																		//如果选中则保持选中的样式
			obj.className="file file-checked";
		}
	}
	
	newSingleFile.prototype.divMouseout=function(obj){
		if(obj.onoff){
			obj.className="file file-checked";
		}else{
			obj.className="file";
		}
	}
	
	newSingleFile.prototype.spanClick=function(e,obj,txt){
		this.arr1=[];																//私有arr1，存放已经选中的div
		if(!obj.onoff){
			obj.className="file file-checked";										//如果div没有被选中，则设置为选中状态
			obj.onoff=true;															//设置开关为true，表示已选中
		}else{																		//否则设置div为鼠标移入时的状态，关闭开关，表示此事div未选中
			obj.className="file file-hover";
			obj.onoff=false;
		}
		for(i=0;i<_this.element.length;i++){												//遍历新建好的文件夹，如果文件夹是选中的，就将这个文件夹存放到arr1中
			if(_this.element[i].onoff){
				this.arr1.push(_this.element[i]);
			}
		}
		if(this.arr1.length==_this.element.length){											//判断，如果选中的文件夹的个数和可视区的文件夹个数相同，则表明已全选
			_this.selectAll.className='active';
		}else{
			_this.selectAll.className='';
		}
		(function(obj,txt){
			_this.rename.onclick=function(){												//点击重命名，如果当前div是选中的，那么弹出输入框，输入的值就是新的文件夹名，同时将dates中的name修改
				console.log(obj.fileId);
				if(obj.onoff){
					this.name = prompt('请输入文件夹的名称');
					txt.innerHTML=_this.arr.name=this.name;
				}
			}
		})(obj,txt);
		e.cancelBubble=true;
	}
	
	newSingleFile.prototype.Contextmenu=function(e){
		this.arr1=[];																		//存放已选中的文件夹
		this.onoff=true;																	//右键之后的文件夹设为选中状态。为什么这么做？因为微云就是这么干的
		this.className="file file-checked";
		for(i=0;i<_this.element.length;i++){												//选中的文件夹存入arr1中，局部变量，执行完函数即销毁
			if(_this.element[i].onoff){
				this.arr1.push(_this.element[i]);
			}
		}
		if(this.onoff&&this.arr1.length==1){												//这个条件代表只有当前的这个div被选中，那么显示第一种右键菜单
			_this.menu2.style.display="none";
			_this.menu1.style.display="block";
			_this.menu1.style.left=e.clientX+'px';
			_this.menu1.style.top=e.clientY+'px';
		}else if(this.onoff&&this.arr1.length!=1){											//这个条件代表有多个div被选中，那么显示第二种右键菜单
			_this.menu1.style.display="none";
			_this.menu2.style.display="block";
			_this.menu2.style.left=e.clientX+'px';
			_this.menu2.style.top=e.clientY+'px';
		}
		document.onmousemove =null;
		return false;
//		e.preventDefault();
		e.cancelBubble=true;
	}
	
	newSingleFile.prototype.selectall=function(e){
		_this.selectAll.onoff=false;
		_this.selectAll.onclick=function(e){
			if(!this.onoff){
				for(i=0;i<_this.element.length;i++){
					this.className="active";
					_this.element[i].className="file file-checked";
					_this.element[i].onoff=true;
					this.onoff=true;
				}
			}else{
				for(i=0;i<_this.element.length;i++){
					this.className="";
					_this.element[i].className="file";
					_this.element[i].onoff=false;
					this.onoff=false;
				}
			}
			e.cancelBubble=true;
		}
		_this.selectAll.onmouseup=function(e){																		
			e.cancelBubble=true;
		}
	}
	
	newSingleFile.prototype.moveSelect=function(box,allFile){
		this.sW = box.offsetWidth;
		this.sH = box.offsetHeight;
		this.sT = box.offsetTop;
		this.sL = box.offsetLeft;
		for(i=0;i<allFile.length;i++){
			allFile[i].oW = allFile[i].offsetWidth;
			allFile[i].oH = allFile[i].offsetHeight;
			allFile[i].oT = allFile[i].offsetTop;
			allFile[i].oL = allFile[i].offsetLeft;
			if( this.sL + this.sW < allFile[i].oL || this.sL > allFile[i].oL + allFile[i].oW || this.sT + this.sH < allFile[i].oT || this.sT > allFile[i].oT + allFile[i].oH ) {
				allFile[i].onoff=false;
				allFile[i].className='file';
			}else{
				allFile[i].onoff=true;
				allFile[i].className='file file-checked';
			}
		}
		this.arr1=[];																//全选判断，可以封装成函数，然而我懒
		for(i=0;i<_this.element.length;i++){										//遍历新建好的文件夹，如果文件夹是选中的，就将这个文件夹存放到arr1中
			if(_this.element[i].onoff){
				this.arr1.push(_this.element[i]);
			}
		}
		if(this.arr1.length==_this.element.length){									//判断，如果选中的文件夹的个数和可视区的文件夹个数相同，则表明已全选
			_this.selectAll.className='active';
		}else{
			_this.selectAll.className='';
		}
	}
	
	newSingleFile.prototype.showBreadcrumb=function() {
        this.parentList = _this.getParents(currentPid);
        console.log(currentPid);
        if ( _this.getInfo(currentPid) ) {
        	this.parentList.unshift(_this.getInfo(currentPid) );
        }
        this.html = "<a fileId=0 href='javascript:;'>微云</a>";
        for (var i=this.parentList.length-1; i>=0; i--) {
            this.html += '<a fileId="'+ this.parentList[i].id +'" href="javascript:;">'+ this.parentList[i].name +'</a>';
        }
        breadcrumbList.innerHTML = this.html;
    }
	
	newSingleFile.prototype.Bread=function(){
		_this.bread.onclick = function(e){
			if (e.target.tagName.toLowerCase() == 'a') {
				currentPid = e.target.getAttribute('fileId');
				_this.getChildren(currentPid);
				that.showBreadcrumb();
			}
		}
	}
	
	newSingleFile.prototype.dele=function(){															//删除函数
		this.file=_this.menu.getElementsByClassName('file file-checked');								//获取所有选中文件夹
		for(i=0;i<this.file.length;i++){																//根据选中文件夹的fileid找到dates中的对应id，并删除这一项，然后重新渲染页面
			for(j=0;j<datas.length;j++){
				if(this.file[i].fileId==datas[j].id){
					datas.splice(j,1);
				}
			}
		}
		_this.getChildren(currentPid);
	}
	
	newSingleFile.prototype.smallFile=function(e,obj){
		that=this;
		this.disX=e.clientX;
		this.disY=e.clientY;
		obj.onoff=true;
		obj.className="file file-checked";
		this.arr1=[];																			//存放选中的
		this.arr2=[];																			//存放没有选中的
		for(i=0;i<_this.element.length;i++){
			if(_this.element[i].onoff){
				this.arr1.push(_this.element[i]);
			}else{
				this.arr2.push(_this.element[i]);
			}
		}
		document.onmousemove=function(e){
			this.odisX=e.clientX;
			this.odisY=e.clientY;
			for(i=0;i<that.arr1.length;i++){													//根据arr1的长度生成小文件夹的个数
				this.smaDiv=document.createElement('div');
				this.smaDiv.setAttribute('class','image1');
				this.smaDiv.style.left=5*i+"px";
				this.smaDiv.style.top=5*i+"px";
				_this.mask.appendChild(this.smaDiv);
			}
			_this.mask.style.left=this.odisX+'px';
			_this.mask.style.top=this.odisY+'px';
			if(this.odisX-that.disX==10||this.odisY-that.disY==10){
				_this.mask.style.display='block';
			}
//			e.preventDefault();
			return false;
		}
		document.onmouseup=function(e){															//鼠标松开时的事件
			this.ux=e.clientX;																	//鼠标松开时的位置
			this.uy=e.clientY;
			for(i=0;i<that.arr2.length;i++){													//如果松开时的位置在arr2中的div上，即松开时那个位置的div没有被选中			
				if(this.ux>that.arr2[i].offsetLeft&&this.ux<parseFloat(that.arr2[i].getBoundingClientRect().right)&&this.uy>that.arr2[i].offsetTop&&this.uy<parseFloat(that.arr2[i].getBoundingClientRect().bottom)){
					this.a=i;
					break;
				}
			}
			if(this.a>=0){
				for(i=0;i<that.arr1.length;i++){
					for(j=0;j<datas.length;j++){
						if(datas[j].id==that.arr1[i].fileId){
							datas[j].pid=that.arr2[this.a].fileId;
						}
					}
				}
			}
			_this.mask.innerHTML='';
			document.onmousemove=null;
			e.cancelBubble=true;
			_this.getChildren(currentPid);
		}
		e.cancelBubble=true;
	}
	var  init=new Init();
	var nsf=new newSingleFile(currentPid);
	nsf.selectall();
	nsf.newfile();
	nsf.Bread();
	nsf.delet();
	nsf.Drag();
	init.getChildren(0);
	nsf.showBreadcrumb();
}
	