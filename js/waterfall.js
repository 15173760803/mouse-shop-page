/**
 * 
 * @param {Object} config
 */
let Waterfall = function( config ){
	// 如果以new关键字调用，则子对象拥有init方法可以使用
	this.init && this.init(config);
}
Waterfall.prototype = {
	conf:{},	// 数据配置信息
	coord: {},  // 记录（每一列下一个色块的）坐标位置
	init: function(config){
		// 将配置赋值给当前对象的配置属性
		this.conf = config;
		let bw = this.conf.boxWidth;
		let blw = this.conf.blockWidth;
		// 列数量 = (容宽%块宽===0)？（容宽/块宽-1）：~~(容宽/块宽)
		this.conf.columnCount = (bw%blw===0)?(bw/blw-1):~~(bw/blw);
		// 剩余宽度 = （容宽 - 块宽*列数）
		this.conf.residueWidth = bw - blw * this.conf.columnCount;
		// 容器内边距（左右） = 剩余宽度 % （列数*2）
		this.conf.boxPadding = this.conf.residueWidth % (this.conf.columnCount * 2);
		// 色块外边距= （剩余宽度-容器内边距和） / （列数量*2）
		this.conf.blockMargin = (this.conf.residueWidth - this.conf.boxPadding) / (this.conf.columnCount * 2);
		// 初始化列(末尾)坐标位
		this.coord.length = this.conf.columnCount;
		for (let i=0;i<this.coord.length;i++ ) {
			this.coord[i] = {
				x: this.conf.boxPadding/2 + i*blw + (i*2+1)*this.conf.blockMargin,
				y: this.conf.boxPadding/2 + this.conf.blockMargin
			};
		}
	},
	colorArr: [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'],
	getColor: function(){
		// 返回一个随机颜色
		return '#' + Array(6).fill(0).map( _=>this.colorArr[~~(Math.random()*16)] ).join('');
	},
	getNextCoord: function(height){
		// 1. 筛选最符合标准的坐标对象
		let nextIndex = 0;
		let nextCoord = this.coord[nextIndex];
		for (let n=1; n<this.coord.length; n++) {
			let tempCoord = this.coord[n];
			if(tempCoord.y < nextCoord.y){
				nextCoord = tempCoord;
				nextIndex = n;
			}
		}
		// 2. 将当前的高度位置，重新计算入坐标对象的某一行之中
		this.coord[nextIndex] = {
			x: nextCoord.x,
			y: nextCoord.y + height + this.conf.blockMargin*2
		}
		// 返回坐标对象
		return nextCoord;
	},
	// 生成色块的方法
	generate: function(){
		// 生成一个div（色块）
		let el = document.createElement('div');
		// 生成色块的随机高度范围
		let el_height = (30 + ~~(Math.random() * 100));
		el.setAttribute('class', 'block');
		el.style.height = el_height + 'px';
		el.style.backgroundColor = this.getColor();
		
		// 给色块设置坐标位置
		let nextCoords = this.getNextCoord(el_height);
		el.style.marginLeft = nextCoords.x + 'px';
		el.style.marginTop = nextCoords.y + 'px';
		
		// 将生成的色块添加至容器内部
		this.conf.box.append( el );
	}
}
