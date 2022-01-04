var keysdown = {}
let player = {}
var ss = document.createElement("img");
var ee = document.createElement("img");
var pp = document.createElement("img");
var bg = document.createElement("img");
var bb = document.createElement("img");
var dd = document.createElement("img");
var oo = document.createElement("img");
var toolset = [];
var enemieslist = [];
var playerlist = [];
var hp = {};
bg.src = "images/desert.png";
var bosslist = [];
var obsticallist = []
function start(){
    hp = document.getElementById("hp");
	hp.value = 0;
	document.getElementById("intro").style.display = "none";
	document.getElementById("character").style.display = "block";
	ss.src = "images/items.gif";
	ee.src = "images/enemies.png";
	pp.src = "images/char.png";
	bb.src = "images/bosses.png";
	dd.src = "images/dust.png";
	oo.src = "images/obstacles.png";
	getData("tools.json", toolset);
	getData("enemies.json", enemieslist);
	getData("player.json", playerlist);
	getData("boss.json", bosslist);
	getData("obsticals.json", obsticallist);
}

function setChar(chara){
	if (chara == "char1"){
		console.log("Knight stats");
	} else if (chara == "char2"){
		console.log("Wizard stats");
	} else if (chara == "char3"){
		console.log("Rogue stats");
	}
}
function setplace(plc){
	if (plc == "desert"){
		bg.src = "images/desert.png";
	} else if (plc == "forest"){
		bg.src = "images/forest.png";
	} else if (plc == "artic"){
		bg.src = "images/artic.png";
	}
}

function cont() {
	document.getElementById("character").style.display = "none";
	document.getElementById("places").style.display = "block";
	document.getElementById("game").style.display = "block";
	document.getElementById("invtl").style.display = "none";
}	
function main() {
	document.getElementById("invtl").style.display = "block";
	document.getElementById("places").style.display = "none";
	game.boss = new Boss;
	addEventListener("keydown", function (e) {
		keysdown[e.keyCode] = true;
		//console.log(keysdown);
	}, false);
	addEventListener("keyup", function (e) {
		delete keysdown[e.keyCode];
	}, false);
	console.log("main");
	
	
	player = new Player();
	MainSet();
}


function update () {
	game.clear();
	//draw the background
// 	game.ctx.fillStyle = "green";
	game.ctx.drawImage(bg, 0, 0);
	//draw the player
	player.update();
	//loop through an aray of enemies and draw each one
	if (player.incombat){
		if (player.cframe%10 == 0){
			battle();
			player.dust++;
		}
	}
	if (!player.bossBattle){
		stbat();
	} else {
		if (player.cframe%10 == 0){
			bBattle();
			player.dust++;
		}
	}
	for(i = 0; i < game.enemies.length; i++){
		game.enemies[i].update();
	}
	for(i = 0; i < game.tools.length; i++){
		game.tools[i].update();
	}
	for(i = 0; i < game.tools.length; i++){
		var dis = Math.sqrt((player.x - game.tools[i].x)**2 + (player.y - game.tools[i].y)**2)
		if (dis <= 20){
			//console.log("picked up");
			if (game.tools[i].type == "Heal"){
				player.health += game.tools[i].healing;
				if(player.health > player.maxhp){
					player.health = player.maxhp;
				}
				hp.value = player.health
			} else {
				player.inventory.push(game.tools[i]);
				showInv();
			}
			game.tools.splice(i, 1);
			break;
		}
	}
	if (game.boss != null){
		game.boss.update();
	}
	for (let h = 0; h < game.obsticals.length; h++){
		game.obsticals[h].update();
		console.log(h);
	}
	//check for contact
}
function stbat(){
	var pcom = false; 
	for(i = 0; i < game.enemies.length; i++){
		var dis = Math.sqrt((player.x - game.enemies[i].x)**2 + (player.y - game.enemies[i].y)**2)
		if (dis <= 20){
			game.enemies[i].incombat = true;
			pcom = true;
		} else if (dis > 20){
			game.enemies[i].incombat = false;
		}
	}
	player.incombat = pcom;
}
function bBattle(){
	var atktot = player.power;
	for (g = 0; g < player.inventory.length; g++){
		if (player.inventory[g].type == "Weapon"){
			atktot += player.inventory[g].power;
		}
	}
	var deftot = player.power;
	for (g = 0; g < player.inventory.length; g++){
		if (player.inventory[g].type == "Armor"){
			deftot += player.inventory[g].power;
		}
	}
	var bdamage = atktot - game.boss.defens
	if (bdamage <= 0){
		bdamage = 1;
	}
	game.boss.health -= bdamage;
	var pdamage = game.boss.power - deftot
	if (pdamage <= 0){
		pdamage = 1;
	}
	player.health -= pdamage;
	if (player.health <= 0){
		reset1();
		player.bossBattle = false;
	} else if (game.boss.health <= 0){
		player.inventory.push(game.boss.inventory)
		game.boss = null;
		player.bossBattle = false;
	}
}
function battle(){
	var atktot = player.power;
	for (g = 0; g < player.inventory.length; g++){
		if (player.inventory[g].type == "Weapon"){
			atktot += player.inventory[g].power;
		}
	}
	var deftot = player.power;
	for (g = 0; g < player.inventory.length; g++){
		if (player.inventory[g].type == "Armor"){
			deftot += player.inventory[g].power;
		}
	}
	
	for (i = 0; i < game.enemies.length; i++){
		if (game.enemies[i].incombat){
			var damage = atktot - game.enemies[i].defens;
			if (damage <= 0){
				damage = 1;
			}
			game.enemies[i].health -= damage;
			if (game.enemies[i].health <= 0){
				game.enemies.splice(i, 1);
			}
			break;
		}
	}
	for (i = 0; i < game.enemies.length; i++){
		var damage = game.enemies[i].power - deftot;
		if (damage <= 0){
			damage = 1;
		}
		if (game.enemies[i].incombat){
			player.health -= damage;
		}
		if (player.health <= 0){
			reset1();
		}
	}
	showHealth();
	
	var v = 0;
	for (i = 0; i < game.enemies.length; i++){
		if (game.enemies[i].incombat){
			v++;
		}
	}
	if (v == 0){
		player.incombat = false;
	}
}
function reset1(){
	clearInterval(game.interval1);
	clearInterval(game.interval2);
	clearInterval(game.interval3);
	game.enemies = [];
	game.tools = [];
	player.inventory = [];
	game.obsticals = [];
	MainSet();
}
function adden (){
	game.enemies.push(game.addenemie());
}
function addtool (){
	var tole = Math.floor(Math.random() * 11);
	game.tools.push(new Tool (toolset[tole].name, toolset[tole].type, toolset[tole].power, toolset[tole].healing, toolset[tole].color, toolset[tole].xcolnum, toolset[tole].ycolnum));
}
//function LEVE(){
//	
//}
function getData(need, target){
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200){
			var temp = JSON.parse(this.responseText);
			for (j = 0; j < temp.length; j++){
				target[j] = temp[j];
			}
		}
	}
	xhr.open("GET", need);
	xhr.send();
}
function MainSet(){
	game.init();
	var valu = document.getElementById("char").value;
	var p = 0
	if (valu == "char1"){
		p = 0;
	} else if (valu == "char2"){
		p = 1;
	} else if (valu == "char3"){
		p = 2;
	}
	var boss = document.getElementById("place").value;
	var b = 0
	if (boss == "desert"){
		b = 1;
	} else if (boss == "forest"){
		b = 0;
	} else if (boss == "artic"){
		b = 2;
	}
	player.speed = playerlist[p].speed;
	player.power = playerlist[p].power;
	player.defens = playerlist[p].defens;
	player.maxhp = playerlist[p].maxhp;
	player.health = playerlist[p].maxhp;
	player.xcolnum = 64 * playerlist[p].xcolnum;
	player.ycolnum = 64 * (2 + playerlist[p].ycolnum);
	for (let j = 0; j < playerlist[p].inventory.length; j++){
		player.inventory.push(playerlist[p].inventory[j]);
	}
	for (let h = 0; h < obsticallist[b].obsticles.length; h++){
		console.log(obsticallist[b].obsticles.length);
		game.obsticals.push(new Obstacles (obsticallist[b].obsticles[h].x, obsticallist[b].obsticles[h].y, obsticallist[b].obsticles[h].xcord, obsticallist[b].obsticles[h].ycord, obsticallist[b].obsticles[h].xgrab, obsticallist[b].obsticles[h].ygrab));
	}
	player.x = 0;
	player.y = 0;
	game.boss.power = bosslist[b].power;
	game.boss.defens = bosslist[b].defens;
	game.boss.maxhp = bosslist[b].maxhp;
	game.boss.health = bosslist[b].maxhp;
	game.boss.xcolnum = 92 * bosslist[b].xcolnum;
	game.boss.ycolnum = 92 * bosslist[b].ycolnum;
	game.boss.inventory = bosslist[b].inventory1;
	game.boss.x = 1000;
	game.boss.y = 345;
	for (j = 0; j < 10; j++){
		addtool();
	}
}
function showHealth() {
	hp.value = player.health;
	
}
function showInv() {
	var text = "";
	for (t = 0; t < player.inventory.length; t++){
		text += "<li>" + player.inventory[t].name + "</li>";

	}
	tlset = document.getElementById("tlset");
	tlset.innerHTML = text;
}