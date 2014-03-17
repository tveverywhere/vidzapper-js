vidzapper-nodejs-api
====================

Nodejs API for connecting to VidZapper

How to Use
-------------

`javascript
var opt={
	id:'YOUR API KEY',
	secret:'YOUR API SECRET',
	server:'https://release.vzconsole.com/api/'
}


var vz=new VidZapper(opt);
vz.api('util/storage',{id:120},function (d) {
  if(!!d.error) throw new Error(d.message);
  console.log(d);
});
``

