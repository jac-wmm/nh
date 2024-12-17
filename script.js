const canvas = document.getElementById("canvas");
const winnerDiv = document.getElementById("winner");
const config = document.getElementById("config");
const startBtn = document.getElementById("btn");
const giftDiv = document.getElementById("gifts");
const bgm = document.getElementById("bgm");
const space = document.getElementById("space");
const levels = document.getElementById("levels");

const ctx = canvas.getContext("2d");

// 设置画布尺寸
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 员工数据
const employees = [
    { name: "梅锐", years: 6 },
    { name: "王金严", years: 3 },
    { name: "郝书玉", years: 3 },
    { name: "李晓芹", years: 2 },
    { name: "杨妹", years: 2 },
    { name: "万海凤", years: 1 },
    { name: "彭雪豪", years: 1 },
    { name: "赵云凡", years: 1 },
    { name: "黄丽", years: 0 },
    { name: "宋梦婷", years: 0 },
    { name: "王丽", years: 2 },
    { name: "吴伟昌", years: 3 },
    { name: "周俊浩", years: 3 },
    { name: "洪军", years: 3 },
    { name: "朱家顺", years: 3 },
    { name: "陆欣雨", years: 0 },
    { name: "章倩", years: 5 },
    { name: "徐侠", years: 5 },
    { name: "吴娟", years: 1 },
    { name: "钱莲红", years: 1 },
    { name: "姚瑶", years: 2 },
    { name: "鲍阳", years: 2 },
    { name: "王滢珊", years: 2 },
    { name: "汪慧", years: 1 },
    { name: "施海燕", years: 1 },
    { name: "柯娟", years: 1 },
    { name: "彭旺", years: 5 },
    { name: "周桂平", years: 5 },
    { name: "刘含慧", years: 1 },
    { name: "胡梦", years: 3 },
    { name: "朱正喜", years: 2 },
    { name: "陈月", years: 1 },
    { name: "江艳", years: 9 },
    { name: "章青", years: 7 },
    { name: "蒋亚男", years: 6 },
    { name: "王菲", years: 4 },
    { name: "徐芮娟", years: 4 },
    { name: "黄琴", years: 3 },
    { name: "潘文文", years: 3 },
    { name: "杨小燕", years: 3 },
    { name: "徐浩", years: 2 },
    { name: "胡云霞", years: 1 },
    { name: "祁琴琴", years: 1 },
    { name: "刘婷", years: 1 },
    { name: "王斯慧", years: 1 },
    { name: "周艳", years: 1 },
    { name: "邓子涵", years: 1 },
    { name: "姚丽媛", years: 1 },
    { name: "王莹", years: 0 },
    { name: "乔自强", years: 0 },
    { name: "李娜", years: 0 },
    { name: "金全棣", years: 0 },
    { name: "叶佩瑶", years: 0 },
    { name: "王苗苗", years: 3 },
    { name: "陈云", years: 2 },
    { name: "胡玲", years: 8 },
    { name: "李婧", years: 7 },
    { name: "尹兰", years: 5 },
    { name: "芮箕梅", years: 4 },
    { name: "邢凤", years: 3 },
    { name: "杨莉", years: 2 },
    { name: "成晴", years: 2 },
    { name: "王珏", years: 2 },
    { name: "何云球", years: 2 },
    { name: "王娟娟", years: 1 },
    { name: "王欣", years: 1 },
];
// 抽奖规则配置
const lotteryConfig = {
    '4': { count: 1, minYears: 0 },
    '3': { count: 1, minYears: 2 },
    '2': { count: 1, minYears: 3 },
    '1': { count: 1, minYears: 5 },
};

// 动画相关变量
let flyingTexts = [];
let animationRunning = false;
let drawFrameId = null;
let currentLevel = '1';

// 初始化文字
function initFlyingTexts() {
    flyingTexts = employees.map((employee) => ({
        name: employee.name,
        x: Math.random() * 800 - 400, // 水平方向随机扩散 (-100 到 100)
        y: Math.random() * 800 - 400, // 垂直方向随机扩散 (-100 到 100)
        z: Math.random() * 200 + 800, // 初始深度（更远的地方）
        speed: Math.random() * 6 + 4, // 移动速度
        size: 50,
    }));
}

// 动画帧更新
function drawFrame() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    flyingTexts.forEach((text) => {
        // 根据深度计算字体大小和位置
        const scale = 200 / text.z; // 模拟透视效果
        const fontSize = text.size * scale; // 字体大小根据深度缩放
        const x = canvas.width / 2 + text.x * scale; // 水平位置
        const y = canvas.height / 2 + text.y * scale; // 垂直位置

        // 根据深度添加模糊效果（远处更模糊）
        const blur = Math.max(0, 3 - scale * 8); // 近处清晰，远处模糊
        ctx.filter = `blur(${blur}px)`;

        // 根据深度调整颜色渐变（远处暗，近处亮）
        const brightness = Math.min(255, Math.floor(scale * 255)); // 计算亮度值
        ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`; // 灰度颜色

        // 绘制文字
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(text.name, x, y);

        // 更新深度
        text.z -= text.speed; // 逐渐靠近屏幕

        // 如果文字“穿过”屏幕，则重置到远处
        if (text.z < 0) {
            text.z = Math.random() * 200 + 800; // 重置到远处
            text.x = Math.random() * 800 - 400; // 重新随机水平位置
            text.y = Math.random() * 800 - 400; // 重新随机垂直位置
        }
    });

    // 重置模糊
    ctx.filter = "none";
    // 请求下一帧动画
    drawFrameId = requestAnimationFrame(drawFrame);
}

// 抽奖逻辑
function pickWinner(prizeConfig) {
    const eligible = employees.filter((e) => e.years >= prizeConfig.minYears);
    const winners = [];
    while (winners.length < prizeConfig.count && eligible.length > 0) {
        const index = Math.floor(Math.random() * eligible.length);
        winners.push(eligible.splice(index, 1)[0]);
    }
    return winners;
}

// 开始抽奖
function startLottery() {
    animationRunning = true;
    canvas.style.visibility = "visible";
    space.style.visibility = "visible";
    winnerDiv.style.visibility = "hidden";
    giftDiv.style.visibility = "hidden";
    config.style.visibility = "hidden";
    bgm.play();

    initFlyingTexts();
    drawFrame();
}

// 停止抽奖并显示结果
function stopLottery(prizeConfig) {
    animationRunning = false;
    cancelAnimationFrame(drawFrameId);

    const winners = pickWinner(prizeConfig);
    const winnerNames = winners.map((w) => w.name).join(", ");

    winnerDiv.textContent = `中奖者: ${winnerNames}`;
    winnerDiv.style.visibility = "visible";
    canvas.style.visibility = "hidden";
    space.style.visibility = "hidden";
    config.style.visibility = "visible";
    startBtn.textContent = '继续抽奖';
    bgm.pause();
}

// 事件绑定
startBtn.addEventListener("click", () => {
    if (!animationRunning) {
        startLottery();
    }
});
levels.addEventListener('change', () => {
    currentLevel = levels.value;
})

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && animationRunning) {
        console.log('222222',lotteryConfig[currentLevel])
        stopLottery(lotteryConfig[currentLevel]); // 更改为对应的奖项
    }
});


// 监听窗口大小变化
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
