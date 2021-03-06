var game = {
	enemies : [],
	tools : [],
	Boss : {},
	obsticals : [],
	message : false,
	ariad: false,
	ariaf: false,
	ariaa: false,
	init : function () {
		this.canvas = document.getElementById("game");
		this.canvas.width = 1200;
		this.canvas.height = 600;
		this.ctx = this.canvas.getContext("2d");
		this.interval1 = setInterval(update, 20);
		this.interval2 = setInterval(adden, 5000);
		this.interval3 = setInterval(addtool, (10000/toolTime));
		console.log(10000/toolTime);
		this.enemies.push(this.addenemie());
	},
	clear : function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	addenemie : function(){
		let entype = Math.round(Math.random() * 3);
		let atk = enemieslist[entype].power;
		let def = enemieslist[entype].defens;
		let speed = enemieslist[entype].speed;
		let hp = enemieslist[entype].maxhp;
		let xcolnum = enemieslist[entype].xcolnum;
		let ycolnum = enemieslist[entype].ycolnum;
		let x = Math.floor(Math.random() * (this.canvas.width - 20));
		let y = Math.floor(Math.random() * (this.canvas.height - 20));
		let g = true
		while (g) {
			g = false;
			let dis = Math.sqrt((player.x - x)**2 + (player.y - y)**2)
			if (dis <= 100){
				g = true
				x = Math.floor(Math.random() * (this.canvas.width - 20));
				y = Math.floor(Math.random() * (this.canvas.height - 20));
			} else if (dis > 100){g = false;
				for (let t = 0; t < game.obsticals.length; t++){
					if (this.y <= (game.obsticals[t].y + game.obsticals[t].maxy) 
						&& this.x > game.obsticals[t].x 
						&& this.x < game.obsticals[t].maxx + game.obsticals[t].x
						&& this.y > game.obsticals[t].y - 20){
							g = true;
							x = Math.floor(Math.random() * (this.canvas.width - 20));
							y = Math.floor(Math.random() * (this.canvas.height - 20));
					}
				}
			}
		}
		let newen = new Enemis();
		newen.x = x;
		newen.y = y;
		newen.health = hp;
		newen.power = atk * bossp;
		newen.defens = def * bossp;
		newen.speed = speed;
		newen.xcolnum = 67 * xcolnum;
		newen.ycolnum = 67 * ycolnum;
		return newen
	}
}
class Character {
	constructor(name, imagename){
		this.health = 100;
		this.maxhp = this.health;
		this.name = name;
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.power = 3;
		this.defens = 1;
		this.inventory = [];
		this.imagename = imagename;
		this.incombat = false;
		this.cframe = 0;
	}
	update(){
		game.ctx.fillRect(this.x, this.y, 20, 20);
	}
	no_obstical(direct){
		var result = true;
		for (let t = 0; t < game.obsticals.length; t++){
			if (direct == 0 
				&& this.y - this.speed <= (game.obsticals[t].y + game.obsticals[t].maxy) 
				&& this.x > game.obsticals[t].x - 20
				&& this.x < game.obsticals[t].maxx + game.obsticals[t].x
				&& this.y > game.obsticals[t].y - 20){
					result = false;
			} else if (direct == 90 
				&& this.x + this.speed >= (game.obsticals[t].x - 20) 
				&& this.y > game.obsticals[t].y - 20
				&& this.y < game.obsticals[t].maxy + game.obsticals[t].y
				&& this.x < game.obsticals[t].x + game.obsticals[t].maxx){
					result = false;
			} else if (direct == 180 
				&& this.y + this.speed >= (game.obsticals[t].y - 20) 
				&& this.x > game.obsticals[t].x - 20
				&& this.x < game.obsticals[t].maxx + game.obsticals[t].x
				&& this.y < game.obsticals[t].y + game.obsticals[t].maxy){
					result = false;
			} else if (direct == 270 
				&& this.x - this.speed <= (game.obsticals[t].x + game.obsticals[t].maxx) 
				&& this.y > game.obsticals[t].y - 20
				&& this.y < game.obsticals[t].maxy + game.obsticals[t].y
				&& this.x > game.obsticals[t].x){
					result = false;
			}
		}
		return result;
	}
}
class Player extends Character {
	constructor(name, imagename){
		super(name, imagename);
		this.speed = 3;
		this.bossBattle = false;
		this.dust = 1;
		this.OGinventory = [];
		this.atktot = 0;
		this.deftot = 0;


	}
	update(){
		this.checkkeys();
		game.ctx.drawImage(pp, this.xcolnum, this.ycolnum, 64, 64, this.x, this.y, 32, 32);
		if (this.bossBattle || this.incombat){
			let colum = (this.dust%5) * 55
			let row = 0
			if (this.dust <= 5) {
				row = 0;
			} else if (this.dust <= 10) {
				row = 60
			} else {
				row = 120
			}
			game.ctx.drawImage(dd, colum, row, 60, 55, this.x, this.y, 32, 32);
		}
		let f = 0;
		for (let q = 0; q < this.inventory.length; q++){
			if (this.inventory[q].type == "orb"){
				f += 1;
				this.inventory[q].y = this.y - f * 20;
				this.inventory[q].x = this.x;
				this.inventory[q].update();
			}
		} 
		if (game.message){
			this.checkexit();
		}
	} 
	
	checkkeys(){
		if (!this.incombat && !this.bossBattle){
			if (keysdown[40] && this.y < (game.canvas.height - 20) && this.no_obstical(180)){
				this.y += this.speed
			}
			if (keysdown[38] && this.y > 0 && this.no_obstical(0)){
				this.y -= this.speed
			}
			if (keysdown[37] && this.x > 0 && this.no_obstical(270)){
				this.x -= this.speed
			}
			if (keysdown[39] && this.x < (game.canvas.width - 20) && this.no_obstical(90)){
				this.x += this.speed
			}
		} else {
			this.cframe += 1;
		}
	}
	checkexit(){
		if (this.x > game.canvas.width / 2 - 10 && this.x < game.canvas.width / 2 + 10){
			if (this.y < 5){
				setScene("top");
			} 
			else if (this.y > game.canvas.height - 21){
				setScene("bottom");
		}
		else if (this.y > game.canvas.height / 2 - 10 && this.y < game.canvas.height / 2 + 10 && this.x < 5){
				setScene("left");
			}
		}
	}
	setdef(){
		this.atktot = this.power;
		for (let g = 0; g < this.inventory.length; g++){
			if (this.inventory[g].type == "Weapon" || this.inventory[g].type == "Magic"){
				this.atktot += this.inventory[g].power;
			}
		}
		this.deftot = this.power;
		for (let g = 0; g < this.inventory.length; g++){
			if (this.inventory[g].type == "Armor" || this.inventory[g].type == "Magic"){
				this.deftot += this.inventory[g].power;
			}
		}
	}
}
class Enemis extends Character {
	constructor(name, imagename, xcolnum, ycolnum){
		super(name, imagename);
		this.health = 20;
		this.maxhp = this.health;
		this.dir = 0;
		this.maxframs = 100;
		this.frams = this.maxframs;
		this.speed = 1;
		this.xcolnum = xcolnum;
		this.ycolnum = ycolnum;
	}
	update(){
		if (!this.incombat){
			this.move();
		} else {
			this.cframe += 1;
		}
		game.ctx.drawImage(ee, this.xcolnum, this.ycolnum, 67, 67, this.x, this.y, 32, 32);
	}
	move(){
		if (this.distance() && !player.bossBattle){
			//console.log(this.speed);
				if (player.x > this.x && this.no_obstical(90)){
					this.x += this.speed;
				} else if (player.x < this.x && this.no_obstical(270)){
					this.x -= this.speed;
				}
				if (player.y > this.y && this.no_obstical(180)){
					this.y += this.speed;
				} else if (player.y < this.y && this.no_obstical(0)){
					this.y -= this.speed;
				}
			//console.log(this.x);
			//console.log(this.y);
		} else {
			if (this.frams == this.maxframs){
				this.direction();
				this.frams = 0;
			} else {
				this.frams += 1;
			}
			if (this.dir == 0){
				if (this.y > 0 && this.no_obstical(0)){
					this.y -= 1;
				} else {
					this.direction();
					this.frams = 0;
				}
			} else if (this.dir == 45){
				if (this.y > 0 && this.x < game.canvas.width -20 && this.no_obstical(0) && this.no_obstical(90)){
					this.y -= 1;
					this.x += 1;
				} else {
					this.direction();
					this.frams = 0;
				}
			} else if (this.dir == 90){
				if (this.x < game.canvas.width -20 && this.no_obstical(90)){
					this.x += 1;
				} else {
					this.direction();
					this.frams = 0;
				}
			} else if (this.dir == 135){
				if (this.y < game.canvas.height -20 && this.x < game.canvas.width -20 && this.no_obstical(90) && this.no_obstical(180)){
					this.y += 1;
					this.x += 1;
				} else {
					this.direction();
					this.frams = 0;
				}
			} else if (this.dir == 180){
				if (this.y < game.canvas.height -20 && this.no_obstical(180)){
					this.y += 1;
				} else {
					this.direction();
					this.frams = 0;
				}
			} else if (this.dir == 225){
				if (this.y < game.canvas.height -20 && this.x > 0 && this.no_obstical(180) && this.no_obstical(270)){
					this.y += 1;
					this.x -= 1;
				} else {
					this.direction();
					this.frams = 0;
				}
			} else if (this.dir == 270){
				if(this.x > 0 && this.no_obstical(this.dir)){
					this.x -= 1;
				}
			} else if (this.dir == 315){
				if (this.y > 0 && this.x > 0 && this.no_obstical(270) && this.no_obstical(0)){
					this.y -= 1;
					this.x -= 1;
				}
			} else if (this.dir == 360){
				this.y -= 0;
				this.x -= 0;
				this.frams += 3;
			}
		}
	}
	distance(){
		if (!player.bossBattle){
			var dis = Math.sqrt((player.x - this.x)**2 + (player.y - this.y)**2)
			if (dis <= 100){
				return true
			} else if (dis > 100){
				return false
			}
		}
	}
	direction(){
		this.dir = Math.floor(Math.random() * 8) * 45
	}
}
class Boss extends Character {
	constructor(name, imagename){
		super(name, imagename);
		this.inventory = {};
	}
	update(){
		game.ctx.drawImage(bb, this.xcolnum, this.ycolnum, 92, 92, this.x, this.y, 46, 46);
		if(this.distance()){
			player.bossBattle = true;
		}
		this.inventory.y = this.y - 20;
		this.inventory.x = this.x;
		this.inventory.update();
	}
	distance(){
		var dis = Math.sqrt((player.x - this.x)**2 + (player.y - this.y)**2)
		if (dis <= 50){
			return true
		} else if (dis > 50){
			return false
		}
	}
}
class Tool{
	constructor(name, type, power, healing, color, xcolnum, ycolnum){
		this.name = name;
		this.type = type;
		this.power = power;
		this.healing = healing;
		this.color = color;
		let g = true;
		while (g) {
			this.x = Math.floor(Math.random() * (game.canvas.width - 20));
			this.y = Math.floor(Math.random() * (game.canvas.height - 20));
			g = false;
			let j = 0;
			for (let t = 0; t < game.obsticals.length; t++){
				if (this.y <= (game.obsticals[t].y + game.obsticals[t].maxy) 
					&& this.x > game.obsticals[t].x 
					&& this.x < game.obsticals[t].maxx + game.obsticals[t].x
					&& this.y > game.obsticals[t].y - 20){
						if (j < game.obsticals.length){
							j += 1;
						} else {
							g = true;
						}
				}
			}
		}
		this.xcolnum = xcolnum * 32;
		this.ycolnum = ycolnum * 32;
	}
	update(){
		game.ctx.drawImage(ss, this.xcolnum, this.ycolnum, 32, 32, this.x, this.y, 16, 16);
		//game.ctx.fillStyle = "grey";
		//game.ctx.fillRect(this.x, this.y, 20, 20);
	}
}
class Obstacles{
	constructor(x, y, xcord, ycord, xgrab, ygrab){
		this.x = x;
		this.y = y;
		this.xcord = xcord;
		this.ycord = ycord;
		this.maxx = xgrab;
		this.maxy = ygrab;
	}
	update(){
		game.ctx.drawImage(oo, this.xcord, this.ycord, this.maxx, this.maxy, this.x, this.y, this.maxx, this.maxy);
	}
}
//characters
	//players
		//wizzard
		//knight
		//rough
	//npc
		//non boss
		//boss
//ittems
	//regular
	//orbs