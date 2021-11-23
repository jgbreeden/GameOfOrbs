var keysdown = {}
let player = {}
var ss = document.createElement("img");
var ee = document.createElement("img");
var toolset = [];
var enemieslist = [];
function start(){
	document.getElementById("places").style.display = "block";
	document.getElementById("intro").style.display = "none";
	document.getElementById("character").style.display = "block";
	ss.src = "images/items.gif";
	ee.src = "images/enemies.png";
	console.log(typeof(ss));
	getData("tools.json", toolset);
	getData("enemies.json", enemieslist);
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
	if (plc == "plc1"){
		console.log("Desert");
	} else if (plc == "plc2"){
		console.log("Forest");
	} else if (plc == "plc3"){
		console.log("Artic");
	}
}
function main() {
	addEventListener("keydown", function (e) {
		keysdown[e.keyCode] = true;
		console.log(keysdown);
	}, false);
	addEventListener("keyup", function (e) {
		delete keysdown[e.keyCode];
	}, false);
	console.log("main");
	document.getElementById("character").style.display = "none";
	document.getElementById("game").style.display = "block";
	player = new Player();
	var valu = document.getElementById("char").value;
	game.init();
	if (valu == "char1"){
		console.log("Knight");
		player.speed = 2;
		player.power = 3;
		player.defens = 3;
		player.maxhp = 50;
		player.health = 50;
		player.inventory.push(new Tool ("Sword", "Weapon", 10, false, "grey"));
		player.inventory.push(new Tool ("sheild", "Armor", 5, false, "grey"));
		player.inventory.push(new Tool ("armor", "Armor", 6, false, "grey"));
	} else if (valu == "char2"){
		console.log("Wizard");
		player.speed = 3;
		player.power = 2;
		player.defens = 2;
		player.maxhp = 50;
		player.health = 50;
		player.inventory.push(new Tool ("staff", "Weapon", 7, false, "grey"));
		player.inventory.push(new Tool ("spell book", "Magic", false, false, "grey"));
		player.inventory.push(new Tool ("cloak", "Armor", 4, false, "grey"));
	} else if (valu == "char3"){
		console.log("Rogue");
		player.speed = 4;
		player.power = 2;
		player.defens = 1;
		player.maxhp = 50;
		player.health = 50;
		player.inventory.push(new Tool ("dagger", "Weapon", 3, false, "grey"));
		player.inventory.push(new Tool ("dagger", "Weapon", 3, false, "grey"));
		player.inventory.push(new Tool ("cloak", "Armor", 1, false, "black"));
	}
	for (j = 0; j < 10; j++){
		addtool();
	}
}
function update () {
	game.clear();
	//draw the background
/* 	game.ctx.fillStyle = "green";
	game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height); */
	//draw the player
	player.update();
	//loop through an aray of enemies and draw each one
	if (player.incombat){
		if (player.cframe%10 == 0){
			battle();
		}
	}
	stbat();
	for(i = 0; i < game.enemies.length; i++){
		game.enemies[i].update();
	}
	for(i = 0; i < game.tools.length; i++){
		game.tools[i].update();
	}
	for(i = 0; i < game.tools.length; i++){
		var dis = Math.sqrt((player.x - game.tools[i].x)**2 + (player.y - game.tools[i].y)**2)
		if (dis <= 20){
			console.log("picked up");
			player.inventory.push(game.tools[i]);
			game.tools.splice(i, 1);
			break;
		}
	}
	for(a = 0; a < player.inventory; a++){
		if(player.inventory[a].type == "Heal"){
			player.health += player.inventory[a].healing;
			if(player.health > player.maxhp){
				player.health = player.maxhp;
			}
			break
		}
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
	var v = 0;
	for (i = 0; i < game.enemies.length; i++){
		if (game.enemies[i].incombat){
			v += 1;
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
	var valu = document.getElementById("char").value;
	if (valu == "char1"){
		console.log("Knight");
		player.speed = 2;
		player.power = 3;
		player.defens = 3;
		player.maxhp = 100;
		player.health = 100;
		player.inventory.push(new Tool ("sword", "Weapon", 10, false, "grey"));
		player.inventory.push(new Tool ("sheild", "Armor", 5, false, "grey"));
		player.inventory.push(new Tool ("armor", "Armor", 6, false, "grey"));
	} else if (valu == "char2"){
		console.log("Wizard");
		player.speed = 3;
		player.power = 2;
		player.defens = 2;
		player.maxhp = 75;
		player.health = 75;
		player.inventory.push(new Tool ("staff", "Weapon", 7, false, "grey"));
		player.inventory.push(new Tool ("spell book", "Magic", false, false, "grey"));
		player.inventory.push(new Tool ("cloak", "Armor", 4, false, "grey"));
	} else if (valu == "char3"){
		console.log("Rogue");
		player.speed = 4;
		player.power = 2;
		player.defens = 1;
		player.maxhp = 50;
		player.health = 50;
		player.inventory.push(new Tool ("dagger", "Weapon", 3, false, "grey"));
		player.inventory.push(new Tool ("dagger", "Weapon", 3, false, "grey"));
		player.inventory.push(new Tool ("cloak", "Armor", 1, false, "black"));
	}
	player.x = 0;
	player.y = 0;
	game.init();
	for (j = 0; j < 10; j++){
		addtool();
	}
}
function adden (){
	game.enemies.push(game.addenemie());
}
function addtool (){
	var tole = Math.floor(Math.random() * 11);
	console.log(toolset)
	game.tools.push(new Tool (toolset[tole].name, toolset[tole].type, toolset[tole].power, toolset[tole].healing, toolset[tole].color, toolset[tole].xcolnum, toolset[tole].ycolnum));
}
function LEVE(){
	
}
function getData(need, target){
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200){
			var temp = JSON.parse(this.responseText);
			for (j = 0; j < temp.length; j++){
				target[j] = temp[j];
			}
			console.log(target.length);
		}
	}
	xhr.open("GET", need);
	xhr.send();
}