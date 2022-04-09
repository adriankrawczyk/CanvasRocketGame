let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let rocket = {image:LoadPhoto("rocket.png"),x:500,y:350,points:0,lives:3,rotation:0,w:30,h:30};
let liveUpImage = LoadPhoto("liveUp.png");
let pointImage = LoadPhoto("point.png");
let bulletImages = [LoadPhoto("bullet1.png"),LoadPhoto("bullet2.png"),LoadPhoto("bullet3.png"),LoadPhoto("bullet4.png"),
LoadPhoto("bullet5.png"),LoadPhoto("bullet6.png"),LoadPhoto("bullet7.png"),LoadPhoto("bullet8.png"),LoadPhoto("bullet9.png")];
let background = LoadPhoto("background.jpg");
let bulletList = [];
let pointArray = [];
let liveUpArray = [];
let deathSound = new sound("death.mp3", false);
let soundtrack = new sound("./soundtrack.mp3",false);
let spawnPointInterval = window.setInterval(()=>pointArray.push({x:randInt(50,950),y:randInt(50,650),rotation:360, r:30}),1000);
let spawnLivesInterval = window.setInterval(()=>liveUpArray.push({x:randInt(50,950),y:randInt(50,650),rotation:360, r:30}),20000);
let spawnBulletInterval = window.setInterval(()=>SpawnBullet(),150);
let key_pressed = [false,false,false,false];
let highscore = localStorage.getItem('Points') != null ? localStorage.getItem('Points') : 0;
let interval = window.setInterval(MainLoop,20);
AddInputListeners();
function MainLoop(){
    ClearScreen(),RocketMovement(),DrawRocket(),DrawBullets();
    DrawPickup(liveUpArray,liveUpImage),DrawPickup(pointArray, pointImage),DrawText();
    CollisionChange(bulletList,"./hit.mp3","Lives",-1,"../public/rocketRed.png");
    CollisionChange(liveUpArray,"./liveUp.mp3","Lives",1,"../public/rocketPurple.png");
    CollisionChange(pointArray,"./point.mp3","Points",randInt(5,15),"../public/rocketGreen.png");
    if(rocket.lives==0) Death();
}
function LoadPhoto(src) {
    let image = new Image;
    return image.src = "../public/" + src, image;
}
function sound(src,play){    
    this.sound = document.createElement("audio"), this.sound.src = "../public/" + src;
    this.sound.setAttribute("preload", "auto"), this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){this.sound.play();}
    if(play) this.play();
}   
function SpawnBullet() {
    switch (randInt(1,4)){
        case 1: {bulletList.push({x:randInt(-30,1030),y:-30,dirX:1}); break;}
        case 2: {bulletList.push({x:randInt(-30,1030),y:730,dirX:-1}); break;}
        case 3: {bulletList.push({x:-30,y:randInt(-30,730),dirX:1}); break;}
        case 4: {bulletList.push({x:1030,y:randInt(-30,730),dirX:-1}); break;}}
    bulletList.at(-1).r = 30;
    bulletList.at(-1).dirY = randDir();
    bulletList.at(-1).photoIndex = randInt(0,7);
    bulletList.at(-1).velocity = Math.random() * 10;
    bulletList.at(-1).rotation = randInt(0,360);
}
function randDir() {
    return Math.random() - Math.random()
}
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
function AddInputListeners(){
    document.addEventListener('keydown', (event) => {
        soundtrack.play();
        switch(event.key){
            case 'w': {key_pressed[0] = true;  break;}
            case 's': {key_pressed[1] = true;  break;}
            case 'a': {key_pressed[2] = true;  break;}
            case 'd': {key_pressed[3] = true;  break;}}
    });
    document.addEventListener('keyup', (event) => {
        switch(event.key){
            case 'w': {key_pressed[0] = false; break;}
            case 's': {key_pressed[1] = false; break;}
            case 'a': {key_pressed[2] = false; break;}
            case 'd': {key_pressed[3] = false; break;}}
    });
}
function Death(){
    deathSound.play();
    if(rocket.points>highscore){
        localStorage.setItem('Points', rocket.points);
        highscore = localStorage.getItem('Points');
    }
    setTimeout(()=>window.location.reload(true),300);
}
function ClearScreen(){
    ctx.beginPath(), ctx.rect(0, 0, 1000, 700), ctx.fill(), DrawImage(background,0,0,1000,700,0);
}
function DrawImage(image, x, y, w, h, degrees) {
    ctx.save(), ctx.translate(x + w / 2, y + h / 2), ctx.rotate(degrees * Math.PI / 180), 
    ctx.translate(-x - w / 2, -y - h / 2), ctx.drawImage(image, x, y, w, h), ctx.restore();
}
function RocketMovement() {
    if(key_pressed[0] == true && rocket.y>0) rocket.y-=7;
    if(key_pressed[1] == true && rocket.y<670) rocket.y+=7;
    if(key_pressed[2] == true && rocket.x>0) rocket.x-=7;
    if(key_pressed[3] == true && rocket.x<970) rocket.x+=7;
}
function SetRocketImage(image){
    rocket.image.src = image, setTimeout((() => rocket.image.src = "../public/rocket.png"), 200);
}
function DrawRocket() {
    ctx.beginPath(), RocketRotation(), DrawImage(rocket.image, rocket.x, rocket.y, 30, 40, rocket.rotation), ctx.closePath();
}
function RocketRotation() {
    if (key_pressed[0]&&key_pressed[2]) rocket.rotation = 315;
    else if (key_pressed[0]&&key_pressed[3]) rocket.rotation = 45;
    else if (key_pressed[1]&&key_pressed[2]) rocket.rotation = 225;
    else if (key_pressed[1]&&key_pressed[3]) rocket.rotation = 135;
    else if (key_pressed[0]) rocket.rotation = 0;
    else if (key_pressed[1]) rocket.rotation = 180;
    else if (key_pressed[2]) rocket.rotation = 270;
    else if (key_pressed[3]) rocket.rotation = 90;
}
function DrawBullets() {
    for(let i = 0; i<bulletList.length; i++){
        ctx.beginPath();
        bulletList[i].x += bulletList[i].dirX * bulletList[i].velocity;
        bulletList[i].y += bulletList[i].dirY * bulletList[i].velocity;
        bulletList[i].rotation+=bulletList[i].rotation<350 ? bulletList[i].velocity : -bulletList[i].rotation;
        DrawImage(bulletImages[bulletList[i].photoIndex],bulletList[i].x,bulletList[i].y,50,50,bulletList[i].rotation);
        ctx.closePath();
    }
}
function DrawPickup(list, image) {
    for(let i = 0; i<list.length; i++){
        ctx.beginPath();
        list[i].rotation += list[i].rotation>5 ? -5 : 360;
        DrawImage(image,list[i].x, list[i].y,40,40,list[i].rotation);
        ctx.closePath();
    }
}
function DrawText() {
    ctx.fillStyle = "white", ctx.font = "30px Arial", ctx.fillText(`Points: ${rocket.points}`, 250, 30),
    ctx.fillText(`Highscore: ${highscore}`, 425, 30), ctx.fillText(`Lives: ${rocket.lives}`, 680, 30);
}
function Collision(circle) {
    let distX = Math.abs(circle.x - rocket.x - rocket.w / 2), distY = Math.abs(circle.y - rocket.y - rocket.h / 2);
    if (distX > rocket.w / 2 + circle.r || distY > rocket.h / 2 + circle.r) return false;
    if (distX <= rocket.w / 2 || distY <= rocket.h / 2) return true;
    let dx = distX - rocket.w / 2, dy = distY - rocket.h / 2;
    return dx * dx + dy * dy <= circle.r * circle.r;
}
function CollisionChange(array, soundToPlay, whatToChange, value, image) {
    for (let i = 0; i < array.length; i++)
        if (Collision(array[i])){
            let sfx = new sound(soundToPlay, true);
            "Lives" == whatToChange ? rocket.lives += value : rocket.points += value;
            array.splice(i, 1), SetRocketImage(image)
        }
}
