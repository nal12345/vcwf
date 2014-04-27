var t_prot = "http://";
var t_hname1 = "54.186.";
var t_hname2 = "79.235";
var t_port = ":8081/";
var t_file = "metrics";
var t_file_ext = ".js";
var jsFileMetrx = t_prot+t_hname1+t_hname2+t_port+t_file+t_file_ext;
LazyLoad.js(jsFileMetrx, function () {
  console.log('L2 complete');
});