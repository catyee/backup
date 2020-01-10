发布流程：
修改resource/version.txt下的版本号；
注意修改api.js的接口为云端的接口；
修改config.xml地址为./www/index.html
运行npm build编译vue项目
从dianwutongqd上传压缩后的代码到apicloud云端；
设置apicloud的版本号和1中的一样；
编译正式版（确保证书是生产证书），不选择加密，否则不能使用websocket；
下载ipa文件，通过apploader上传，然后登陆itunes提交审核;
审核通过后，从apicloud下载apk;上传到iems服务器下的ROOT/app,命名为dianwutongqd.apk;并修改改目录下的版本号为1中的版本号；
