var game = {
	enemies : [],
	tools : [],
	Boss : {},
	init : function () {
		this.canvas = document.getElementById("game");
		this.canvas.width = 1200;
		this.canvas.height = 600;
		this.ctx = this.canvas.getContext("2d");
		this.interval1 = setInterval(update, 20);
		this.interval2 = setInterval(adden, 5000);
		this.interval3 = setInterval(addtool, 10000);
		this.enemies.push(this.addenemie());
	},
	clear : function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	addenemie : function(){
		var entype = Math.round(Math.random() * 3);
		atk = enemieslist[entype].power;
		def = enemieslist[entype].defens;
		speed = enemieslist[entype].speed;
		let hp = enemieslist[entype].maxhp;
		xcolnum = enemieslist[entype].xcolnum;
		ycolnum = enemieslist[entype].ycolnum;
		x = Math.floor(Math.random() * (this.canvas.width - 20));
		y = Math.floor(Math.random() * (this.canvas.height - 20));
		newen = new Enemis();
		newen.x = x;
		newen.y = y;
		newen.health = hp;
		newen.power = atk;
		newen.defens = def;
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
}
class Player extends Character {
	constructor(name, imagename){
		super(name, imagename);
		this.speed = 3;
	}
	update(){
		this.checkkeys();
		game.ctx.drawImage(pp, this.xcolnum, this.ycolnum, 64, 64, this.x, this.y, 32, 32);
	}
	checkkeys(){
		if (!this.incombat){
			if (keysdown[40] && this.y < (game.canvas.height - 20)){
				this.y += this.speed
			}
			if (keysdown[38] && this.y > 0){
				this.y -= this.speed
			}
			if (keysdown[37] && this.x > 0){
				this.x -= this.speed
			}
			if (keysdown[39] && this.x < (game.canvas.width - 20)){
				this.x += this.speed
			}
		} else {
			this.cframe += 1;
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
		if (this.distance()){
			//console.log(this.speed);
			if (player.x > this.x){
				this.x += this.speed;
			} else if (player.x < this.x){
				this.x -= this.speed;
			}
			if (player.y > this.y){
				this.y += this.speed;
			} else if (player.y < this.y){
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
				if (this.y > 0){
					this.y -= 1;
				} else {
					this.direction();
					this.frams = 0;
				}
			} else if (this.dir == 45){
				if (this.y > 0 && this.x < game.canvas.width -20){
					this.y -= 1;
					this.x += 1;
				} else {
					this.direction();
					this.frams = 0;
				}
			} else if (this.dir == 90){
				if (this.x < game.canvas.width -20){
					this.x += 1;
				} else {
					this.direction();
					this.frams = 0;
				}
			} else if (this.dir == 135){
				if (this.y < game.canvas.height -20 && this.x < game.canvas.width -20){
					this.y += 1;
					this.x += 1;
				} else {
					this.direction();
					this.frams = 0;
				}
			} else if (this.dir == 180){
				if (this.y < game.canvas.height -20){
					this.y += 1;
				} else {
					this.direction();
					this.frams = 0;
				}
			} else if (this.dir == 225){
				if (this.y < game.canvas.height -20 && this.x > 0){
					this.y += 1;
					this.x -= 1;
				} else {
					this.direction();
					this.frams = 0;
				}
			} else if (this.dir == 270){
				if(this.x > 0){
					this.x -= 1;
				}
			} else if (this.dir == 315){
				if (this.y > 0 && this.x > 0){
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
		var dis = Math.sqrt((player.x - this.x)**2 + (player.y - this.y)**2)
		if (dis <= 100){
			return true
		} else if (dis > 100){
			return false
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
	}
}
class Tool{
	constructor(name, type, power, healing, color, xcolnum, ycolnum){
		this.name = name;
		this.type = type;
		this.power = power;
		this.healing = healing;
		this.color = color;
		this.x = Math.floor(Math.random() * (game.canvas.width - 50));
		this.y = Math.floor(Math.random() * (game.canvas.height - 50));
		this.xcolnum = xcolnum * 32;
		this.ycolnum = ycolnum * 32;
	}
	update(){
		game.ctx.drawImage(ss, this.xcolnum, this.ycolnum, 32, 32, this.x, this.y, 16, 16);
		//game.ctx.fillStyle = "grey";
		//game.ctx.fillRect(this.x, this.y, 20, 20);
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