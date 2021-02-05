var PLAY=1;
var gamestate=PLAY;
var END=0;
var trex, trex_running,trex_collided,edges;
var ground,groundImage,invisibleGround;
var cloud,cloudsGroup,cloudImage
var obstaclesGroup,
    obstacleImage1,obstacleImage2,obstacleImage3,obstacleImage4,
    obstacleImage5,obstacleImage6,obstacle;
var restart,restartImage;
var gameOver,gameOverImage;
var score=0;
var jumpSound , checkPointSound, dieSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided= loadAnimation("trex_collided-1.png");
  groundImage = loadImage("ground2.png");
  cloudImage=loadImage("cloud.png");
  gameOverImage=loadImage("gameOver.png");
  restartImage=loadImage("restart.png");
  obstacleImage1=loadImage("obstacle1.png");
  obstacleImage2=loadImage("obstacle2.png");
  obstacleImage3=loadImage("obstacle3.png");
  obstacleImage4=loadImage("obstacle4.png");
  obstacleImage5=loadImage("obstacle5.png");
  obstacleImage6=loadImage("obstacle6.png");
  
}

function setup(){
  createCanvas(600,200);
  
  // creating trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  //trex.debug = true;
  trex.setCollider("rectangle",0,0,30,trex.height);
  //edges = createEdgeSprites();
  
  //adding scale and position to trex
  trex.scale = 0.5;
  
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
 
  invisibleGround = createSprite(200,190,400,20);
  invisibleGround.visible=false;
  
  gameOver=createSprite(240,100,400,20)
  gameOver.addImage(gameOverImage);
  gameOver.scale=0.5
  gameOver.visible=false
  
  restart=createSprite(240,140,100,20)
  restart.addImage(restartImage);
  restart.scale=0.5
  restart.visible=false
  
  cloudsGroup=new Group();
  obstaclesGroup=new Group();
  jumpSound = loadSound("jump.mp3"); 
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}


function draw(){
  
  //set background color 
  background("white");
  text("Score: " + score, 500, 50);
  
  //stop trex from falling down
  trex.collide(invisibleGround)
  
  if(gamestate===PLAY){
     ground.velocityX = -(4+3*score/100);
    score = score + Math.round(getFrameRate()/60);
    if(score > 0 && score % 100 === 0){ 
      checkPointSound.play(); 
    }
    //jump when space key is pressed
    if(keyDown("space") && trex.y>=100){
      trex.velocityY = -10;
      jumpSound.play();
    }
    if (ground.x < 0) {
      ground.x = ground.width / 2; 
    }

    trex.velocityY = trex.velocityY + 0.5;
    spawnClouds(); 
    spawnObstacles();
    if(obstaclesGroup.isTouching(trex)){
     gamestate=END; 
      dieSound.play();
      //ai to trex
      //trex.velocityY = -10;
      //jumpSound.play();
    }
  }
  else if(gamestate===END){
    ground.velocityX=0;
    trex.velocityY=0;
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setLifetimeEach(-1);                                 cloudsGroup.setLifetimeEach(-1);
    gameOver.visible=true;
    restart.visible=true;
    if(mousePressedOver(restart)){
      reset();
    }
  }
  drawSprites();
}
function spawnObstacles(){
  if(frameCount%60 === 0){
   obstacle= createSprite(600, 165, 10, 40);
   obstacle.velocityX=-(3+4*score/100);
  
  var randNum = Math.round(random(1, 6));
  switch (randNum) { 
      case 1: 
      obstacle.addImage(obstacleImage1);
      break; 
      case 2:
      obstacle.addImage(obstacleImage2);
      break; 
      case 3:
      obstacle.addImage(obstacleImage3);
      break;
      case 4:
      obstacle.addImage(obstacleImage4); 
      break;
      case 5:
      obstacle.addImage(obstacleImage5); 
      break; 
      case 6:
      obstacle.addImage(obstacleImage6); 
      break; 
      default: break;
      
       } 
    obstacle.lifetime=        Math.round(ground.width/abs(obstacle.velocityX));
    obstaclesGroup.add(obstacle);
    obstacle.scale = 0.5;
  }
}

function spawnClouds(){
  if(frameCount%60 === 0){
    cloud = createSprite(600, 100, 40, 10);
    cloud.y = Math.round(random(10, 60));
    cloud.addImage("cloud", cloudImage); 
    cloud.velocityX = -3;
    cloud.scale=0.4
    //increasing the depth of trex
    cloud.depth=trex.depth
    trex.depth=trex.depth+1
    cloud.lifetime = Math.round(ground.width/abs(cloud.velocityX));
    cloudsGroup.add(cloud);
    
  }
}

function reset(){
  gamestate=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  score=0;
  trex.changeAnimation("running", trex_running);
}




