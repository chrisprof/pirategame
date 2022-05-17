const canvas = document.getElementById("gameCanvas");
const shipHealth = document.getElementById("shipHealth");
const ctx = canvas.getContext('2d');

const cannon = document.getElementById("cannon");
const boat = document.getElementById("boat");

let friction = 0.8

const height = canvas.height;
const width = canvas.width;

function rndmNum(max) {
    return Math.floor(Math.random() * max) + 1;
}
//Creates game objects
class gameObject
{
	constructor(img,x,y,width,height,color,speedValue,xspeed,yspeed,health,damage,render)
	{
		this.img = img;
		this.x = x;
		this.y = y;
		this.width= width;
		this.height= height;
		this.color= color;
		this.xspeed=xspeed;
		this.yspeed=yspeed;
		this.speedValue=speedValue;
		this.health=health;
		this.damage=damage;
		this.render = render;
	}

	rndmMove()
	{
		if(rndmNum(2)==1)
		{
			this.xspeed-=30;
		}

		else{				
			this.xspeed+=30;
		}
	}

	draw(ctx)
	{
		ctx.fillStyle=this.color;
		if(!this.img)
		{
			ctx.fillRect(this.x,this.y,this.width,this.height);
			return;
		}
		ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
	}

	goto(obj)
	{
		this.y = obj.y
		this.x = obj.x+obj.width/2;
	}

	getCenter(obj)
	{
		return obj.x+obj.width/2, obj.y+obj.height/2;
	}
	

	//makes the friction affect the speed
	runFriction(friction)
	{
		this.xspeed*=friction;
		this.yspeed*=friction;
	}

	//resets the speed to 0
	resetSpeed()
	{
		this.xspeed=0;
		this.yspeed=0;
	}

	//makes the game object move
	move()
	{
		this.y+=this.yspeed;
		this.x+=this.xspeed;
	}


	//*only for walls
	collisionCheck()
	{
			//Up
			if(this.y<=0)
			{
				this.y=0;
			}			

			//Left
			if(this.x<=0)
			{
				this.x=0;
			}

			//Down
			if(this.y>=height-this.height)
			{		
				this.y=height-this.height;
				this.yspeed-=this.speedValue;
			}

			//Right
			if(this.x>=width-this.width)
			{
				this.x=width-this.width;

			}

	}

	update(){
		if(this.render==true)
		{
			this.move();
			this.runFriction(friction);
			this.collisionCheck();
			this.draw(ctx);
		}
	}

	isDead()
	{
		if(this.health<=0)
		{
			this.render=false;
			return true;
		}

		else{
			return false;
		}
	}

}

function getDistance(obj1,obj2)
{
	let x1=obj1.x+obj1.width/2
	let y1=obj1.y+obj1.height/2;
	let x2=obj2.x+obj2.width/2
	let y2=obj2.y+obj2.height/2;
	return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
}

function hit()
{
	if(getDistance(proj,enemy)<=50)
	{
		return true;
	}

	else{
		return false;
	}
}

let plr = new gameObject(cannon,width/2,height/2,80,80,undefined,5,0,0,100,undefined,true);
let proj = new gameObject(undefined,0,0,10,10,"#ffd23d",10,0,0,undefined,5,false);
let enemy = new gameObject(boat,width/2,40,150,150,undefined,10,0,0,500,5,true);

moveLoop = setInterval(()=>{enemy.rndmMove()},500);

function render()
{
	ctx.clearRect(0,0,width,height);
	plr.update();
	proj.update();
	enemy.update();

	if(hit())
	{
		enemy.health-=proj.damage;
		console.log(enemy.health);
	}

	if(enemy.isDead())
	{
		shipHealth.innerHTML = "Ship Health: SUNKEN";
	}

	else{
		shipHealth.innerHTML = "Ship Health:"+enemy.health;
	}
}

var gameLoop = setInterval(render,1);

document.addEventListener("keydown",handleInput);

function fireProj()
{
	proj.goto(plr);
	proj.render=true;
	let shoot = setInterval(()=>{
		if(!proj.y<=0)
		{
			proj.yspeed-=10;

		}

		else{
			clearInterval(shoot);
			proj.render=false;
		}
	},20)
}

function handleInput(e)
{
	switch(e.key)
	{
		case "w": 
			plr.yspeed-=plr.speedValue;
		break;
		case "a": 
			plr.xspeed-=plr.speedValue;
		break;
					
		case "s": 
			plr.yspeed+=plr.speedValue;
		break;
		case "d":
			plr.xspeed+=plr.speedValue;
		break;
			
		case "j":
			fireProj();
		break;
			
	}
	
	render();
	
}
