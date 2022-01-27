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
var bossp = 1;
var toolTime = 1;
bg.src = "images/desert.png";
var bosslist = [];
var obsticallist = [];
var inventorysnap = [];
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
	addEventListener("keydown", function (e) {
		keysdown[e.keyCode] = true;
		//console.log(keysdown);
	}, false);
	addEventListener("keyup", function (e) {
		delete keysdown[e.keyCode];
	}, false);
	console.log("main");
	game.init();
	player = new Player();
	var valu = document.getElementById("char").value;
	var p = 0
	if (valu == "char1"){
		p = 0;
	} else if (valu == "char2"){
		p = 1;
	} else if (valu == "char3"){
		p = 2;
	}
	for (let j = 0; j < playerlist[p].inventory.length; j++){
		player.OGinventory.push(new Tool (playerlist[p].inventory[j].name, playerlist[p].inventory[j].type, playerlist[p].inventory[j].power, playerlist[p].inventory[j].healing, playerlist[p].inventory[j].color, playerlist[p].inventory[j].xcolnum, playerlist[p].inventory[j].ycolnum));
	}
	MainSet();
}


function update () {
	game.clear();
	let boss = document.getElementById("place").value;
	if (boss == "desert"){
		game.ariad = true;
	} else if (boss == "forest"){
		game.ariaf = true;
	} else if (boss == "artic"){
		game.ariaa = true;
	}
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
	}
	if (game.message){
		next_aria();
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
		if (player.inventory[g].type == "Weapon" || player.inventory[g].type == "Magic"){
			atktot += player.inventory[g].power;
		}
	}
	var deftot = player.power;
	for (g = 0; g < player.inventory.length; g++){
		if (player.inventory[g].type == "Armor" || player.inventory[g].type == "Magic"){
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
		game.message = true;
	}
}
function next_aria(){
	let message1 = "";
	let message2 = "";
	let boss = document.getElementById("place").value;
	if (boss == "desert"){
		if (!game.ariaa){
			message1 = "the artic";
		}
		if (!game.ariaf){
			message2 = "the forest";
		}
	} else if (boss == "forest"){
		if (!game.ariad){
			message1 = "the desert";
		}
		if (!game.ariaa){
			message2 = "the artic";
		}
	} else if (boss == "artic"){
		if (!game.ariaf){
			message1 = "the forest";
		}
		if (!game.ariad){
			message2 = "the desert";
		}
	}
	if (message1 != ""){
		game.ctx.fillText(message1, (game.canvas.width/2 - 20), 20, 200);
	}
	if (message2 != ""){
		game.ctx.fillText(message2, (game.canvas.width/2 - 20), game.canvas.height - 20, 200);
	}
/*	if (game.ariad){
		game.ctx.fillText("the artic", (game.canvas.width/2 - 20), 20, 200);
		game.ctx.fillText("the forest", (game.canvas.width/2 - 20), game.canvas.height, 200);
	} else if (game.ariaf){
		game.ctx.fillText("the desert", (game.canvas.width/2 - 20), 20, 200);
		game.ctx.fillText("the artic", (game.canvas.width/2 - 20), game.canvas.height, 200);
	} else if (game.ariaa){
		game.ctx.fillText("the forest", (game.canvas.width/2 - 20), 20, 200);
		game.ctx.fillText("the desert", (game.canvas.width/2 - 20), game.canvas.height, 200);
	}*/
}
function battle(){
	var atktot = player.power;
	for (g = 0; g < player.inventory.length; g++){
		if (player.inventory[g].type == "Weapon" || player.inventory[g].type == "Magic"){
			atktot += player.inventory[g].power;
		}
	}
	var deftot = player.power;
	for (g = 0; g < player.inventory.length; g++){
		if (player.inventory[g].type == "Armor" || player.inventory[g].type == "Magic"){
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
	game.init();
	clearInterval(game.interval1);
	clearInterval(game.interval2);
	clearInterval(game.interval3);
	game.enemies = [];
	game.tools = [];
	player.inventory = [];
	game.obsticals = [];
	MainSet();
}
// interlude1:
	//needs to set a variable to the the players curent eneventory.
	//needs to swap what version of te reset function is used, as well as what version of mainset will be used so that
	//the player will keep there items, exp, level and orbs when they go to the next sceen.
	//cant allow the player to chose the same area twice.
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
	xhr.open("POST", need);
	xhr.send();
}
function MainSet(){
	game.message = false;
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
	player.inventory = []
	for (let j = 0; j < player.OGinventory.length; j++){
		player.inventory.push(player.OGinventory[j]);
	}
	for (let h = 0; h < obsticallist[b].obsticles.length; h++){
		game.obsticals.push(new Obstacles (obsticallist[b].obsticles[h].x, obsticallist[b].obsticles[h].y, obsticallist[b].obsticles[h].xcord, obsticallist[b].obsticles[h].ycord, obsticallist[b].obsticles[h].xgrab, obsticallist[b].obsticles[h].ygrab));
	}
	player.x = 0;
	player.y = 0;
	game.boss = new Boss;
	game.boss.power = bosslist[b].power * bossp;
	game.boss.defens = bosslist[b].defens * bossp;
	console.log(game.boss.power);
	console.log(game.boss.defens);
	game.boss.maxhp = bosslist[b].maxhp;
	game.boss.health = bosslist[b].maxhp;
	game.boss.xcolnum = 92 * bosslist[b].xcolnum;
	game.boss.ycolnum = 92 * bosslist[b].ycolnum;
	console.log(new Tool (bosslist[b].inventory1.name, bosslist[b].inventory1.type, bosslist[b].inventory1.power, bosslist[b].inventory1.healing, bosslist[b].inventory1.color, bosslist[b].inventory1.xcolnum, bosslist[b].inventory1.ycolnum));
	game.boss.inventory = new Tool (bosslist[b].inventory1.name, bosslist[b].inventory1.type, bosslist[b].inventory1.power, bosslist[b].inventory1.healing, bosslist[b].inventory1.color, bosslist[b].inventory1.xcolnum, bosslist[b].inventory1.ycolnum);
	console.log(game.boss.inventory);
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
function setScene(label){
	let boss = document.getElementById("place").value;
	if (label == "top"){
		if (boss == "desert"){
			if(!game.ariaa){
				setplace("artic")
				document.getElementById("place").value = "artic"
				moving()
				console.log("top")
			}
		} else if (boss == "forest"){
			if(!game.ariad){
				setplace("desert")
				document.getElementById("place").value = "desert"
				moving()
				console.log("top")
			}
		} else if (boss == "artic"){
			if(!game.ariaf){
				setplace("forest")
				document.getElementById("place").value = "forest"
				moving()
				console.log("top")
			}
		}
	}
	else if (label == "bottom"){
		if (boss == "desert"){
			if(!game.ariaf){
				setplace("forest")
				document.getElementById("place").value = "forest"
				moving()
				console.log("bottom")
			}
		} else if (boss == "forest"){
			if(!game.ariaa){
				setplace("artic")
				document.getElementById("place").value = "artic"
				moving()
				console.log("bottom")
			}
		} else if (boss == "artic"){
			if(!game.ariad){
				setplace("desert")
				document.getElementById("place").value = "desert"
				moving()
				console.log("bottom")
			}
		}
	} 
}
function moving(){
	player.OGinventory = [];
	for (let p = 0; p < player.inventory.length; p++){
		player.OGinventory.push(player.inventory[p]);
	}
	bossp += bossp + bossp/2;
	toolTime += 1;
	game.obsticals = [];
	game.tools = [];
	game.enemies = [];
	reset1()
}