window.onload=function(){
//	//生成一级目录
	var currentpid=0;
	
	//鼠标移入文件框，移出文件框， 模拟checkbox点击
	var file=document.getElementsByClassName('file');
	var cbox=document.getElementsByClassName('checkbox');
	var selectAll=document.getElementById('selectAll');
	var num=0;
	for(i=0;i<file.length;i++){
		file[i].index=i;
		file[i].onoff=false;
		cbox[i].onoff=false;
		cbox[i].index=i;
		file[i].onmouseover=function(){
			if(!this.onoff){
				cbox[this.index].style.display="block";
				this.className="file file-hover";
			}
		}
		file[i].onmouseout=function(){
			if(!this.onoff){
				cbox[this.index].style.display="none";
				this.className="file";
			}
		}
		cbox[i].onclick=function(e){
			if(!this.onoff){
				file[this.index].className="file file-checked";
				file[this.index].onoff=true;
				this.onoff=true;
				num++;
			}else{
				file[this.index].className="file";
				file[this.index].onoff=false;
				cbox[this.index].style.display="none";
				this.onoff=false;
				num--;
			}
			e.cancelBubble=true;
					
			if(num==file.length){
				selectAll.className='active';
				selectAll.onoff=true;
			}else{
				selectAll.className="";
				selectAll.onoff=false;
			}
		};
		
	
	
		
		
		//全选，反选，是否全选
		var file=document.getElementsByClassName('file');
		var cbox=document.getElementsByClassName('checkbox');
		
		selectAll.onoff=false;
		selectAll.onclick=function(){
			if(!this.onoff){
				this.className="active";
				this.onoff=true;
				num=file.length;
				for(i=0;i<file.length;i++){
					file[i].className="file file-checked";
					file[i].onoff=true;
					cbox[i].onoff=true;
					cbox[i].style.display="block";
				}
			}else{
				this.className="";
				this.onoff=false;
				num=0;
				for(i=0;i<file.length;i++){
					file[i].className="file";
					file[i].onoff=false;
					cbox[i].onoff=false;
					cbox[i].style.display="none";
				}
			}
		}
		
		
		//新建文件夹
		var list=document.getElementById('list');
		var newFile=list.getElementsByTagName('li')[5];
		var menu=document.getElementById('menu');
		newFile.onoff=true;
		newFile.onclick=function(e){
			if(this.onoff){
				this.onoff=false;
				var div=document.createElement('div');
				div.setAttribute('class','file');
				var span=document.createElement('span');
				span.setAttribute('class','checkbox');
				var div1=document.createElement('div');
				div1.setAttribute('class','image image-folder');
				var div2=document.createElement('div');
				div2.setAttribute('class','name');
				
				var input=document.createElement('input');
				input.setAttribute('type','txt');
				
				div.appendChild(span);
				div.appendChild(div1);
				div.appendChild(div2);
				div.appendChild(input);
				menu.appendChild(div);
				
			}
			e.cancelBubble=true;
			var inp=menu.getElementsByTagName('input')[0];
			inp.focus();
			input.onclick=function(e){
				e.cancelBubble=true;
			}
			document.onclick=function(){
				if(inp.value==""){
					alert('请输入文件名');
				}else{
					div.removeChild(inp);
					div2.innerHTML=inp.value;
				}
				newFile.onoff=true;
			}
			
		}
	}
}
