/**
 * 商品对象的构造
 */
const Goods = function(goodsId,goodsName,goodsImg,price){
	this.goodsId = goodsId;
	this.goodsName = goodsName;
	this.goodsImg = goodsImg;
	this.price = price;
	this.count = 1;
}
