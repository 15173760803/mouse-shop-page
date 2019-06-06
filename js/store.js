/**
 * 状态存储
 */
const myStore = {
	// 负责管理订单数据的状态
	orders: {
		arr: new Map(),
		totalPrice: 0,
		totalCount: 0,
		/**
		 * 传入一个 goods object，将其置入订单数据列表
		 */
		add: function(goods){
			if(!this.arr.get(goods.goodsId)){
				// 当前集合中不存在该商品
				this.arr.set(goods.goodsId, goods);
			}else{
				// 当前集合中已经存在该商品
				const tmpGoods = this.arr.get(goods.goodsId);
				tmpGoods.count++;
			}
			
			// 若 diffCount 为正数，则增加商品；若为负数，则减少商品
			this.totalCompute(1, goods.price)
			// 渲染...
			this.render();
		},
		diff: function(goodsId, diffCount){
			if(!this.arr.get(goodsId)){
				// 不存在该商品
				throw new Error('not find this goods for id ['+goodsId+'] !');
			}
			// 获取当前需要操作的商品对象
			const goods = this.arr.get(goodsId);
			// 对商品对象进行操作，直接反应到Map集合
			// 若商品数量 减少 至0， 则移除该商品
			// 否则，仅变动商品数量，并重新计算总数量和价格
			if(goods.count - 1 === 0){
				this.remove(goodsId);
			}else{
				goods.count += diffCount;
				// 计算总价
				// 若 diffCount 为正数，则增加商品；若为负数，则减少商品
				this.totalCompute(diffCount, goods.price)
			}
			if(diffCount !== 0){
				// 渲染...
				this.render();
			}
		},
		remove: function(goodsId){
			if(this.arr.has(goodsId)){
				const goods = this.arr.get(goodsId);
				// 若 diffCount 为正数，则增加商品；若为负数，则减少商品
				this.totalCompute( -(goods.count) , goods.price);
				// 在集合中移除商品
				this.arr.delete(goodsId);
				// 渲染...
				this.render();
			}
		},
		totalCompute: function(diffCount, diffPrice){
			// 计算总数量、价格
			if( diffCount === undefined || diffPrice === undefined ){
				// 循环 Map 计算
				this.totalCount = 0;
				this.totalPrice = 0;
				this.arr.forEach(function(goods){
					this.totalCount += diffCount;
					this.totalPrice += ( diffPrice * diffCount );
				}.bind(this));
			}else{
				// 直接计算
				this.totalCount += diffCount;
				this.totalPrice += ( diffPrice * diffCount );
			}
		},
		load: function(){
			// 初始化时，载入DOM元素
			this.DOMs = {rightMenu: {items: []}};
			this.DOMs.rightMenu.cartBox = $('.right-menu .cart-box');
			this.DOMs.rightMenu.cartFooter = $('.right-menu .cart-footer');
		},
		render: function(){
			// 
			this.DOMs.rightMenu.items = this.DOMs.rightMenu.cartBox.find('.cart-item');
			const $rightCartBox = this.DOMs.rightMenu.cartBox;
			const $items = this.DOMs.rightMenu.items;
			
			// 右侧购物车渲染过程
			if($items.length < this.arr.size){
				// 新增
				this.arr.forEach(function(goods){
//					console.log('新增...', goods);
					if( $items.filter('[goodsId='+goods.goodsId+']').length === 0 ){
//						console.log('$rightCartBox add...', $items);
						let $newItem = $(
							`<div class="cart-item" goodsId="${goods.goodsId}" price="${goods.price}" count="${goods.count}">
								<div class="ci-img">
									<img src="${goods.goodsImg}" alt="" />
								</div>
								<div class="ci-content">
									<div class="ci-content-title">${goods.goodsName}</div>
									<div class="ci-content-price">
										<div class="info">
											<span class="price">￥${goods.price.toFixed(2)}</span>*<span class="count">${goods.count}</span>
										</div>
										<div class="control">
											<span class="diff">-</span>
											<span class="add">+</span>
										</div>
										<div class="del">删除</div>
									</div>
								</div>
							</div>`
						).insertAfter($rightCartBox.find('.cart-title'));
						// 添加事件
						// 右侧购物车商品项鼠标移入显示控制台
						$newItem.hover(function(){
							$(this).find('.control').show();
							$(this).find('.del').show();
						},function(){
							$(this).find('.control').hide();
							$(this).find('.del').hide();
						});
						
						$newItem.find('.ci-content-price .control .diff').click(function(){
							myStore.orders.diff($(this).parents('.cart-item').attr('goodsId'), -1);
						});
						$newItem.find('.ci-content-price .control .add').click(function(){
							myStore.orders.diff($(this).parents('.cart-item').attr('goodsId'), 1);
						});
						// 删除按钮
						$newItem.find('.ci-content-price .del').click(function(){
							myStore.orders.remove( $(this).parents('.cart-item').attr('goodsId') );
						});
					}
				});
			}else if($items.length > this.arr.size){
				// 删除
				console.log('删除。。。');
				$items.each(function(index,el){
					if( !this.arr.has($(el).attr('goodsId')) ){
						$(el).remove();
					}
				}.bind(this))
			}else{
				// 修改
				console.log('修改。。。');
				$items.each(function(index,el){
					let oldCount = $(el).attr('count');
					let newCount = this.arr.get( $(el).attr('goodsId') ).count;
					if(oldCount !== newCount){
						$(el).find('.ci-content-price .count').text(newCount);
					}
				}.bind(this));
			}
			// 右侧菜单栏总数据渲染
			$rightCartBox.find('.cart-footer .text .count .val').text( this.totalCount );
			$rightCartBox.find('.cart-footer .text .price .val').text( this.totalPrice );
			// 提示框总数量渲染
			$('.right-menu .aside-box .icon-cart1 .count').text(this.totalCount);
		}
	}
}
// 初始化加载
myStore.orders.load();