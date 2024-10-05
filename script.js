//setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



console.log(ctx);
const gradient = ctx.createLinearGradient (0,0, canvas.width, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(0.5, 'magenta');
gradient.addColorStop(1, 'blue');
ctx.fillStyle = gradient;
ctx.strokeStyle = 'white';


class Particle {
constructor (effect){
    this.effect = effect;
    this.radius = Math.random() * 5 + 2;
    this.x = this.radius + Math.random() * (this.effect.width  - this.radius *2);
    this.y= this.radius + Math.random () * (this.effect.height - this.radius *2);
    this.vx = Math.random() * 1 - 0.5;
    this.vy = Math.random() * 1 - 0.5;

}
draw (context){
//context.fillStyle = 'hsl(' + this.x* 0.5 + ', 100%, 50%)';//
context.beginPath();
context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
context.fill();
//context.stroke();
}
update(){
    this.x += this.vx; 
    if (this.x > this.effect.width -this.radius || this.x <this.radius ) this.vx *= -1;

    this.y += this.vy;
    if (this.y > this.effect.width -this.radius || this.y <this.radius ) this.vx *= -1;

}
}

class Effect {
constructor(canvas){
    this.canvas= canvas;
    this.width= this.canvas.width;
    this.height= this.canvas.height;
    this.particles = [];
    this.numberOfParticles = 200;
    this.createParticles();
}
createParticles (){
    for (let i=0; i <this.numberOfParticles; i++){
        this.particles.push(new Particle(this));
    }
}
handleParticles(context){
    //it goes through code line by line
    //connect line first then the particle so lines r connected behind particles
    this.connectParticles(context);
    this.particles.forEach(particle => {
        particle.draw(context);
        particle.update();
    });
   
}
//connectParticles expects context as an argument 
connectParticles(context){
    const maxDistance = 100;
    //we compare every particle to another particle using nested for loops
    for (let a = 0; a < this.particles.length; a++){
        for (let b = a; b < this.particles.length; b ++){
            //how to calculate distance between particle a and particle b , 2 distance 
            // point somewhere in canvas
            // how tro calculate the distance between 2 points in 2d space
            //physics simulation, games or creative coding projects 
            //we need to imagine there is a right triangle between them
            // we calculate distance x between particle a and particle b on the horizontal axis
            // y for verticle
            //uses pythagoras theorem formula to calculate the distance 
            // c square = a square + b square
            //math.hypot , built in method to calculate distance
             const dx = this.particles [a].x - this.particles[b].x;
             const dy= this.particles [a].y - this.particles[b].y;
             const distance = Math.hypot(dx, dy);
//when their distance is less than max distance means they are closer
             if (distance < maxDistance){
                //save method will save all canvas settings 
                context.save();
                //to make smoother effect
                //defining opacity using global alpha 
             const opacity = 1 -(distance/maxDistance);
             context.globalAlpha = opacity; 
             context.beginPath();
             context.moveTo(this.particles[a].x, this.particles[a].y);
             context.lineTo(this.particles[b].x, this.particles[b].y);
//using stroke method to draw line
            context.stroke();
            //calling restore resets canvas set 
            context.restore ();
}
        }
    }
}  
}
const effect = new Effect (canvas);


function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
}
animate();