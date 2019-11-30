const cryptoJS = require("crypto-js");
const { createCanvas } = require('canvas')

// 使用盐加密
exports.encryptWithSalt = function (str, salt, enc = 'Hex') {
  const hash = cryptoJS.SHA256(cryptoJS.SHA256(str) + salt);
  if (enc) {
    enc = enc.toLowerCase();
  }
  return hash.toString(cryptoJS.enc[enc]);
}

randomStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomColor(min, max) {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

// 生成验证码
exports.drawPic = function (num, width, height) {
  let picTxt = ''; // 随机数
  let canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d'); // 获取 context 对象
  ctx.textBaseline = 'bottom'; // 文字上下对齐方式--底部对齐
  ctx.fillStyle = randomColor(180, 240); // 填充画布颜色
  ctx.fillRect(0, 0, width, height); // 填充矩形--画画
  for (let i = 0; i < num; i++) {
    const x = (width - 10) / num * i + 10;
    const y = randomNum(height / 2, height);
    const deg = randomNum(-45, 45);
    const txt = randomStr[randomNum(0, randomStr.length)];
    picTxt += txt; // 获取一个随机数
    ctx.fillStyle = randomColor(10, 100); // 填充随机颜色
    ctx.font = randomNum(18, 25) + 'px SimHei'; // 设置随机数大小，字体为SimHei
    ctx.translate(x, y); // 将当前xy坐标作为原始坐标
    ctx.rotate(deg * Math.PI / 180); // 旋转随机角度
    ctx.fillText(txt, 0, 0); // 绘制填色的文本
    ctx.rotate(-deg * Math.PI / 180);
    ctx.translate(-x, -y);
  }
  for (let i = 0; i < num; i++) {
    // 定义笔触颜色
    ctx.strokeStyle = randomColor(90, 180);
    ctx.beginPath();
    // 随机划线--4条路径
    ctx.moveTo(randomNum(0, width), randomNum(0, height));
    ctx.lineTo(randomNum(0, width), randomNum(0, height));
    ctx.stroke();
  }
  for (let i = 0; i < num * 10; i++) {
    ctx.fillStyle = randomColor(0, 255);
    ctx.beginPath();
    // 随机画原，填充颜色
    ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
    ctx.fill();
  }
  return {
    text: picTxt,
    body: canvas.toDataURL()
  }
}
