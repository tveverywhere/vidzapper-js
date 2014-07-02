VidZapper Nodejs Package
====================

Nodejs API for connecting to VidZapper

Configurations
-------------

```javascript
var opt={
	id:'YOUR API KEY',
	secret:'YOUR API SECRET',
	server:'YOUR VIDZAPPER API URL'
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
```javascript
var vz=new VidZapper(opt);
vz.post('<<METHOD NAME>>',Post_Obj,function (d) {
  if(!!d.error) throw new Error(d.message);
  console.log(d);
});
```

```javascript
var vz=new VidZapper(opt);
vz.get('<<METHOD NAME>>','a=1&b=2',function (d) {
  if(!!d.error) throw new Error(d.message);
  console.log(d);
});
```
