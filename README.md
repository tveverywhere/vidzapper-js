VidZapper Nodejs Package
====================

[![NPM](https://nodei.co/npm/vz.png?downloads=true)](https://nodei.co/npm/vz/)


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

call function name vz.get2 for version 2 of the api.
