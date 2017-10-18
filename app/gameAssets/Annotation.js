
function Annotation(x, y, text, color, endTime) {
  this.x = x;
  this.y = y;
  this.text = text;
  this.color = color;
  this.textSize = 12;
  this.endTime = endTime;
  this.active = true;

  this.update = function () {
    this.textSize += 0.1;
    this.y -= 0.25;
    if (Date.now() > this.endTime) {
      this.active = false;
    }
  };

  this.render = function (context) {
    context.fillStyle = this.color;
    context.font = `${Math.floor(this.textSize)}px Luckiest Guy`;
    context.fillText(this.text, this.x, this.y);
  };
}

export default Annotation;
