vidzapper-nodejs-api
====================

Nodejs API for connecting to VidZapper

Configurations
-------------

```javascript
var opt={
	id:'YOUR API KEY',
	secret:'YOUR API SECRET',
	server:'https://release.vzconsole.com/api/'
}
```

Calling API Method
---------

```javascript
var vz=new VidZapper(opt);
vz.api('<<METHOD NAME>>',Post_Obj,function (d) {
  if(!!d.error) throw new Error(d.message);
  console.log(d);
});
```




